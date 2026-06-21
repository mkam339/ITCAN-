import React, { useMemo, useState, Suspense, lazy } from "react";
import { PARTS_META, CURRENCIES, WHATSAPP_NUMBER, CASE_OPTIONS } from "@/data/catalog";

const ThreeScene = lazy(() => import("@/components/ThreeScene"));

const PART_ORDER = ["cpu", "mobo", "ram", "ssd", "gpu", "cooler", "psu", "case"];

function convert(priceSar, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.SAR;
  const v = priceSar * c.rate;
  if (v < 10) return v.toFixed(2);
  return v.toFixed(0);
}

export default function PCBuilder({ currency }) {
  const [parts, setParts] = useState({});
  const [showCaseGrid, setShowCaseGrid] = useState(false);

  const total = useMemo(() => {
    let sum = 0;
    PART_ORDER.forEach((k) => {
      const v = parts[k];
      if (!v) return;
      const opt = PARTS_META[k].options.find((o) => o.value === v);
      if (opt) sum += opt.price;
    });
    return sum;
  }, [parts]);

  const filledCount = PART_ORDER.filter((k) => parts[k]).length;
  const progress = (filledCount / PART_ORDER.length) * 100;

  const curr = CURRENCIES[currency] || CURRENCIES.SAR;

  const setPart = (k, v) => setParts((p) => ({ ...p, [k]: v || undefined }));

  const sendWhatsApp = () => {
    const lines = PART_ORDER
      .filter((k) => parts[k])
      .map((k) => `• ${PARTS_META[k].label}: ${parts[k]}`)
      .join("\n");
    const msg = `السلام عليكم 👋\nأريد طلب التجميعة التالية من *إتقان*:\n\n${lines}\n\n💰 *المجموع:* ${convert(total, currency)} ${curr.symbol}\n\nمن فضلك أكد التوفر والسعر النهائي.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const resetBuild = () => setParts({});

  // For 3D scene "live preview"
  const sceneParts = {
    ...parts,
    userControlling: true,
  };

  return (
    <section className="section" data-testid="builder-section">
      <div className="container-itcan">
        <div className="text-center mb-10">
          <div className="chip mb-3"><i className="fa-solid fa-cube" /> ENGINE V2 • REAL-TIME 3D</div>
          <h2 className="section-title gradient-gold">جمّع جهازك ثلاثي الأبعاد</h2>
          <p className="section-sub">اختر أي قطعتين وشاهدهما يتركّبان فعلياً — حدّد كل القطع لتظهر الكيسة الكاملة بألوانها الحقيقية.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT: 3D viewer */}
          <div className="lg:col-span-7" data-testid="builder-3d">
            <div className="canvas-frame" style={{ minHeight: 560 }}>
              <div className="canvas-badge"><span className="dot" /> LIVE 3D ASSEMBLY</div>
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-gold-light">
                  <div className="text-center">
                    <i className="fa-solid fa-cube text-4xl shimmer animate-pulse mb-3" />
                    <div className="font-display">جارٍ تحميل المحرك ثلاثي الأبعاد...</div>
                  </div>
                </div>
              }>
                <ThreeScene parts={sceneParts} mode="live" />
              </Suspense>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-[var(--text-muted)] bg-black/40 px-3 py-1 rounded-full backdrop-blur">
                <i className="fa-solid fa-hand-pointer" /> اسحب للتدوير • السكرول للتكبير
              </div>
            </div>

            {/* Progress bar */}
            <div className="glass mt-4 p-4">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="font-bold text-gold-light">تقدم التجميعة</span>
                <span className="text-[var(--text-muted)]">{filledCount} / {PART_ORDER.length}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-black/40">
                <div className="h-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#d4a843,#f4d36e)" }} />
              </div>
              {progress === 100 && (
                <div className="text-center mt-3 text-sm text-gold font-bold">
                  ✨ تجميعة كاملة — الكيسة ظهرت في الـ3D!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: parts selectors */}
          <div className="lg:col-span-5 space-y-3" data-testid="builder-selects">
            {PART_ORDER.map((key) => {
              const meta = PARTS_META[key];
              const isCase = key === "case";
              return (
                <div key={key} className="glass p-4">
                  <label className="flex items-center justify-between mb-2 font-bold text-sm">
                    <span className="flex items-center gap-2">
                      <i className={`fa-solid ${meta.icon} text-gold`} />
                      {meta.label}
                    </span>
                    {parts[key] && (
                      <span className="chip text-[10px]">
                        {convert(meta.options.find((o) => o.value === parts[key])?.price || 0, currency)} {curr.symbol}
                      </span>
                    )}
                  </label>
                  <select
                    value={parts[key] || ""}
                    onChange={(e) => setPart(key, e.target.value)}
                    className="itcan-select"
                    data-testid={`select-${key}`}
                  >
                    <option value="">— اختر {meta.label} —</option>
                    {meta.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value} — {convert(o.price, currency)} {curr.symbol}
                      </option>
                    ))}
                  </select>

                  {isCase && (
                    <button
                      type="button"
                      className="btn-ghost mt-3 !text-xs !py-2"
                      onClick={() => setShowCaseGrid((v) => !v)}
                      data-testid="toggle-case-grid"
                    >
                      <i className="fa-solid fa-images" /> {showCaseGrid ? "إخفاء معرض الكيسات" : "اختر الكيسة من المعرض"}
                    </button>
                  )}

                  {isCase && showCaseGrid && (
                    <div className="grid grid-cols-3 gap-2 mt-3" data-testid="case-grid-inline">
                      {CASE_OPTIONS.map((c) => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => setPart("case", c.value)}
                          className={`case-card !rounded-lg ${parts.case === c.value ? "selected" : ""}`}
                          title={c.value}
                          data-testid={`case-mini-${c.value.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <div className="img-wrap !min-h-[80px] !p-1">
                            <img src={c.image} alt={c.value} className="!max-h-[80px]" />
                          </div>
                          <div className="text-[10px] text-center py-1 px-1 truncate" style={{ color: c.color === "white" ? "#fff" : "#fff" }}>
                            {c.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Total + actions */}
            <div className="price-card text-center" data-testid="total-card">
              <div className="text-sm text-gold-light mb-1">💰 المجموع التقديري</div>
              <div className="font-display text-4xl font-black gradient-gold mb-2" data-testid="total-price">
                {convert(total, currency)} {curr.symbol}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-4">
                {total > 0 ? `${total.toLocaleString()} ر.س — شامل ضمان 18 شهر` : "ابدأ بإضافة القطع"}
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <button onClick={sendWhatsApp} disabled={!total} className="btn-gold disabled:opacity-50" data-testid="send-whatsapp">
                  <i className="fa-brands fa-whatsapp" /> اطلب عبر واتساب
                </button>
                <button onClick={resetBuild} className="btn-ghost" data-testid="reset-build">
                  <i className="fa-solid fa-rotate-left" /> إعادة تعيين
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
