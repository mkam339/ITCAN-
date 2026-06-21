"""ITCAN PC Builder backend API tests."""
import os
import base64
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
def test_root_alive(session):
    r = session.get(f"{API}/", timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "ITCAN" in data.get("message", ""), data


# ---------- AI Chat ----------
def test_ai_chat_basic_arabic(session):
    payload = {"message": "اقترح لي تجميعة 5000 ريال"}
    r = session.post(f"{API}/ai/chat", json=payload, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "session_id" in data and isinstance(data["session_id"], str)
    assert "reply" in data and isinstance(data["reply"], str)
    assert len(data["reply"]) > 5
    # Has at least one Arabic character
    assert any("\u0600" <= ch <= "\u06FF" for ch in data["reply"]), f"Reply not Arabic: {data['reply'][:200]}"


def test_ai_chat_multi_turn(session):
    r1 = session.post(f"{API}/ai/chat", json={"message": "أبغى تجميعة ألعاب بـ 4000 ريال"}, timeout=90)
    assert r1.status_code == 200, r1.text
    d1 = r1.json()
    sid = d1["session_id"]
    history = [
        {"role": "user", "text": "أبغى تجميعة ألعاب بـ 4000 ريال"},
        {"role": "assistant", "text": d1["reply"]},
    ]
    r2 = session.post(
        f"{API}/ai/chat",
        json={"message": "كم تكلف الكيسة فقط؟", "session_id": sid, "history": history},
        timeout=90,
    )
    assert r2.status_code == 200, r2.text
    d2 = r2.json()
    assert d2["session_id"] == sid
    assert len(d2["reply"]) > 5


# ---------- AI Diagnose ----------
def _make_real_jpeg_base64():
    """Create a tiny but real JPEG with visible content (not blank)."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        pytest.skip("PIL not available")
    img = Image.new("RGB", (320, 240), color=(20, 20, 30))
    d = ImageDraw.Draw(img)
    # Draw something resembling a motherboard area
    d.rectangle([20, 20, 300, 220], outline=(80, 200, 80), width=3)
    d.rectangle([60, 60, 160, 140], fill=(40, 40, 60), outline=(200, 180, 60), width=2)
    d.rectangle([180, 60, 280, 110], fill=(60, 30, 30), outline=(220, 80, 80), width=2)
    d.text((30, 200), "CPU FAN ERROR", fill=(255, 255, 255))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def test_ai_diagnose_with_image(session):
    b64 = _make_real_jpeg_base64()
    payload = {
        "description": "الجهاز يطلع رسالة CPU FAN ERROR ولا يقلع",
        "image_base64": b64,
        "image_mime": "image/jpeg",
    }
    r = session.post(f"{API}/ai/diagnose", json=payload, timeout=120)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "diagnosis" in data
    assert len(data["diagnosis"]) > 10
    assert any("\u0600" <= ch <= "\u06FF" for ch in data["diagnosis"]), data["diagnosis"][:200]


# ---------- Builds ----------
def test_create_and_list_build(session):
    payload = {
        "name": "TEST_build_pytest",
        "parts": {
            "cpu": "Ryzen 5 7600",
            "gpu": "RTX 4060",
            "ram": "DDR5 32GB",
            "case": "Penguin Pro Black",
        },
        "total_sar": 4999.0,
        "currency": "SAR",
        "customer_note": "auto-test",
    }
    r = session.post(f"{API}/builds", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str)
    assert "created_at" in data and isinstance(data["created_at"], str)
    assert data["total_sar"] == 4999.0
    assert data["parts"]["cpu"] == "Ryzen 5 7600"

    build_id = data["id"]

    # List builds and find ours
    r2 = session.get(f"{API}/builds", timeout=20)
    assert r2.status_code == 200, r2.text
    arr = r2.json()
    assert isinstance(arr, list)
    ids = [b.get("id") for b in arr]
    assert build_id in ids, f"Saved build {build_id} not found in list"
