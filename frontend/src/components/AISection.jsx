import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { QUICK_CHAT_TAGS, WHATSAPP_NUMBER } from "@/data/catalog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function ChatPanel() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "أهلاً بك في إتقان 👋 أنا المهندس الذكي. اسألني عن أي قطعة، تجميعة، أو مشكلة في جهازك." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const boxRef = useRef();

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", text: msg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ai/chat`, {
        message: msg,
        session_id: sessionId,
        history: newMsgs.slice(0, -1),
      });
      setSessionId(res.data.session_id);
      setMessages((m) => [...m, { role: "assistant", text: res.data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "⚠️ تعذر الاتصال. حاول مرة أخرى أو تواصل واتساب 0563036134." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="chat-panel">
      <div ref={boxRef} className="chat-box flex flex-col">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
            {m.role === "assistant" && <div className="text-xs text-gold-light font-bold mb-1">🤖 إتقان AI</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="bubble bubble-ai" data-testid="chat-loading">
            <span className="inline-block animate-pulse">يكتب...</span>
            <span className="inline-flex gap-1 mr-2">
              {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 my-3" data-testid="quick-tags">
        {QUICK_CHAT_TAGS.map((t) => (
          <button key={t} onClick={() => send(t)} className="chip hover:!bg-[var(--gold)] hover:!text-black transition-all cursor-pointer">
            {t}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اسأل المهندس الذكي..."
          className="itcan-input flex-1"
          data-testid="chat-input"
        />
        <button onClick={() => send()} className="btn-gold" disabled={loading} data-testid="chat-send">
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </div>
  );
}

function DiagnosePanel() {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [b64, setB64] = useState(null);
  const [mime, setMime] = useState("image/jpeg");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const onPick = (f) => {
    if (!f) return;
    setFile(f);
    setMime(f.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      setPreview(data);
      setB64(data); // data:URL
    };
    reader.readAsDataURL(f);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onPick(f);
  };

  const analyze = async () => {
    if (!desc.trim() && !b64) return;
    setLoading(true);
    setDiagnosis("");
    try {
      const res = await axios.post(`${API}/ai/diagnose`, {
        description: desc || "حلل الصورة وقدم تقييماً للجهاز.",
        image_base64: b64,
        image_mime: mime,
      });
      setDiagnosis(res.data.diagnosis);
    } catch (e) {
      setDiagnosis("⚠️ تعذر التحليل. حاول مرة أخرى أو تواصل واتساب 0563036134.");
    } finally {
      setLoading(false);
    }
  };

  const sendDiagnosisWhatsApp = () => {
    const msg = `السلام عليكم 👋\nأحتاج دعم فني — هذا تشخيص الذكاء الاصطناعي:\n\n${diagnosis}\n\nمشكلتي: ${desc || "(انظر للصورة)"}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div data-testid="diagnose-panel">
      <div
        className={`drop-zone ${drag ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("img-pick").click()}
        data-testid="drop-zone"
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-56 mx-auto rounded-lg" data-testid="image-preview" />
        ) : (
          <>
            <i className="fa-solid fa-image text-4xl text-gold mb-2 block"></i>
            <div className="font-bold text-gold-light">اسحب صورة المشكلة هنا أو اضغط للاختيار</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">JPEG / PNG / WEBP</div>
          </>
        )}
        <input
          id="img-pick"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onPick(e.target.files[0])}
          data-testid="file-input"
        />
      </div>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="صف المشكلة... (مثال: جهازي ما يقلع، يظهر ضوء أحمر على اللوحة الأم)"
        className="itcan-textarea mt-3"
        data-testid="diagnose-desc"
      />

      <div className="flex gap-2 mt-3 flex-wrap">
        <button onClick={analyze} disabled={loading || (!desc.trim() && !b64)} className="btn-gold flex-1 justify-center" data-testid="diagnose-btn">
          {loading ? <><i className="fa-solid fa-spinner fa-spin" /> جارٍ التشخيص...</> : <><i className="fa-solid fa-stethoscope" /> ابدأ التشخيص</>}
        </button>
        {diagnosis && (
          <button onClick={sendDiagnosisWhatsApp} className="btn-neon" data-testid="diagnose-whatsapp">
            <i className="fa-brands fa-whatsapp" /> أرسل للدعم
          </button>
        )}
      </div>

      {diagnosis && (
        <div className="glass mt-4 p-4" data-testid="diagnosis-box">
          <div className="font-bold text-gold-light mb-2"><i className="fa-solid fa-microchip" /> تشخيص المهندس الذكي:</div>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{diagnosis}</div>
        </div>
      )}
    </div>
  );
}

export default function AISection() {
  const [tab, setTab] = useState("chat");

  return (
    <section className="section" data-testid="ai-section">
      <div className="container-itcan">
        <div className="text-center mb-8">
          <div className="chip mb-3"><i className="fa-solid fa-brain" /> AI POWERED • GEMINI 3</div>
          <h2 className="section-title gradient-gold">المهندس الذكي</h2>
          <p className="section-sub">اسأل أي شيء عن تجميعة الكمبيوتر، أو ارفع صورة لمشكلة وسنخبرك بالحل.</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="tab-nav">
            <button onClick={() => setTab("chat")} className={`tab-btn ${tab === "chat" ? "active" : ""}`} data-testid="tab-chat">
              <i className="fa-solid fa-comments" /> شات الذكاء الاصطناعي
            </button>
            <button onClick={() => setTab("diag")} className={`tab-btn ${tab === "diag" ? "active" : ""}`} data-testid="tab-diag">
              <i className="fa-solid fa-image" /> تشخيص الصور
            </button>
          </div>
        </div>

        <div className="glass-strong p-6 max-w-3xl mx-auto">
          {tab === "chat" ? <ChatPanel /> : <DiagnosePanel />}
        </div>
      </div>
    </section>
  );
}
