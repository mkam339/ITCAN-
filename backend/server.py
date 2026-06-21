from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
import uuid
import tempfile
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

from emergentintegrations.llm.chat import (
    LlmChat,
    UserMessage,
    FileContentWithMimeType,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI(title="ITCAN PC Builder API")
api_router = APIRouter(prefix="/api")


# =========================================================
# Models
# =========================================================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatTurn(BaseModel):
    role: str  # "user" | "assistant"
    text: str


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    history: Optional[List[ChatTurn]] = None


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class DiagnoseRequest(BaseModel):
    description: str
    image_base64: Optional[str] = None  # data URL or raw base64
    image_mime: Optional[str] = "image/jpeg"


class DiagnoseResponse(BaseModel):
    diagnosis: str


class BuildSave(BaseModel):
    name: Optional[str] = "تجميعتي"
    parts: Dict[str, Any]
    total_sar: float
    currency: Optional[str] = "SAR"
    customer_note: Optional[str] = None


class BuildOut(BuildSave):
    id: str
    created_at: str


# =========================================================
# System prompts
# =========================================================
SYSTEM_PROMPT_CHAT = (
    "أنت 'إتقان AI' المساعد الذكي لمتجر إتقان لتجميع أجهزة الكمبيوتر في السعودية. "
    "تحدّث دائماً بالعربية الفصحى المبسطة بأسلوب احترافي وودود. "
    "مهمتك مساعدة العملاء في اختيار قطع الحاسب (المعالج، كرت الشاشة، الرامات، التخزين، التبريد، الكيسة، مزود الطاقة)، "
    "اقتراح تجميعات حسب الميزانية بالريال السعودي، شرح الفروقات التقنية، حل المشاكل الشائعة، "
    "وتقديم نصائح للألعاب والتصميم والمونتاج. "
    "إذا طلب العميل شراء أو حجز، اطلب منه التواصل عبر واتساب 0563036134. "
    "حافظ على إجابات قصيرة ومنظمة بنقاط عند الإمكان."
)

SYSTEM_PROMPT_DIAGNOSE = (
    "أنت 'مهندس إتقان' خبير صيانة وتجميع الحاسب. حلّل الصورة المُرفقة لمشكلة العميل في جهازه. "
    "قدّم تشخيصاً عربياً واضحاً ومرتباً يحتوي على: 1) ما تراه في الصورة. 2) السبب المحتمل. "
    "3) خطوات الحل بالترتيب. 4) قطع الغيار الموصى بها إن وُجدت من متجر إتقان. "
    "كن دقيقاً وعملياً. إن لم تتأكد، فاطلب صورة أوضح."
)


# =========================================================
# Helpers
# =========================================================
def _normalize_b64(data_url: str) -> str:
    if "," in data_url and data_url.startswith("data:"):
        return data_url.split(",", 1)[1]
    return data_url


# =========================================================
# Routes
# =========================================================
@api_router.get("/")
async def root():
    return {"message": "ITCAN API alive", "version": "2.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d.get("timestamp"), str):
            d["timestamp"] = datetime.fromisoformat(d["timestamp"])
    return docs


# ---------- AI Chat (non-streaming JSON for simplicity in this UI) ----------
@api_router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "EMERGENT_LLM_KEY missing")

    session_id = req.session_id or str(uuid.uuid4())

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=SYSTEM_PROMPT_CHAT,
    ).with_model("gemini", "gemini-3-flash-preview")

    # Replay history (library keeps its own per-instance memory; we only get one instance per request,
    # so we send prior turns as a single context prefix prepended to the user message).
    context_block = ""
    if req.history:
        lines = []
        for t in req.history[-8:]:
            who = "العميل" if t.role == "user" else "إتقان AI"
            lines.append(f"{who}: {t.text}")
        if lines:
            context_block = "سجل المحادثة السابق:\n" + "\n".join(lines) + "\n\nالرسالة الحالية:\n"

    user_msg = UserMessage(text=context_block + req.message)

    try:
        reply = await chat.send_message(user_msg)
    except Exception as e:
        logger.error(f"chat error: {e}")
        raise HTTPException(500, f"AI error: {e}")

    # persist
    doc = {
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "user": req.message,
        "assistant": reply,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_history.insert_one(doc)

    return ChatResponse(session_id=session_id, reply=reply)


# ---------- AI Image Diagnosis ----------
@api_router.post("/ai/diagnose", response_model=DiagnoseResponse)
async def ai_diagnose(req: DiagnoseRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "EMERGENT_LLM_KEY missing")

    session_id = str(uuid.uuid4())
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=SYSTEM_PROMPT_DIAGNOSE,
    ).with_model("gemini", "gemini-3-flash-preview")

    file_contents = []
    tmp_path = None
    if req.image_base64:
        try:
            raw = base64.b64decode(_normalize_b64(req.image_base64))
            ext = ".jpg"
            mime = req.image_mime or "image/jpeg"
            if "png" in mime:
                ext = ".png"
            elif "webp" in mime:
                ext = ".webp"
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
            tmp.write(raw)
            tmp.close()
            tmp_path = tmp.name
            file_contents.append(
                FileContentWithMimeType(file_path=tmp_path, mime_type=mime)
            )
        except Exception as e:
            raise HTTPException(400, f"Bad image: {e}")

    user_msg = UserMessage(
        text=f"وصف العميل لمشكلته: {req.description}\n\nرجاءً قدّم التشخيص الكامل.",
        file_contents=file_contents or None,
    )

    try:
        reply = await chat.send_message(user_msg)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

    return DiagnoseResponse(diagnosis=reply)


# ---------- Save / fetch builds ----------
@api_router.post("/builds", response_model=BuildOut)
async def save_build(b: BuildSave):
    doc = b.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.builds.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/builds", response_model=List[BuildOut])
async def list_builds():
    docs = await db.builds.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return docs


# =========================================================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
