import React, { useState, useMemo } from "react";
import { PREBUILT_PCS, CURRENCIES, WHATSAPP_NUMBER } from "@/data/catalog";

function convert(priceSar, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.SAR;
  const v = priceSar * c.rate;
  return v < 10 ? v.toFixed(2) : v.toFixed(0);
}

export default function Prebuilt({ currency }) {
  const [budget, setBudget] = useState(3500);
  const curr = CURRENCIES[currency] || CURRENCIES.SAR;

  const suggested = useMemo(() => {
    // pick by closest match to budget
    let best = PREBUILT_PCS[0];
    let dist = Infinity;
    PREBUILT_PCS.forEach((p) => {
      const d = Math.abs(p.price - budget);
      if (d < dist) { dist = d; best = p; }
    });
    return best;
  }, [budget]);

  const orderPrebuilt = (pc) => {
    const msg = `السلام عليكم 👋\nأريد طلب ${pc.name} من *إتقان*:\n\n${pc.details}\n🛡️ ضمان ${pc.warranty}\n💰 ${convert(pc.price, currency)} ${curr.symbol}\n\nمن فضلك أكد التوفر.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="section" data-testid="prebuilt-section">
      <div className="container-itcan">
        <div className="text-center mb-10">
          <div className="chip mb-3"><i className="fa-solid fa-rocket" /> READY-TO-SHIP</div>
          <h2 className="section-title gradient-gold">تجميعات إتقان الجاهزة</h2>
          <p className="section-sub">جربة، مُحسَّنة، ومضمونة. اختر تجميعتك أو حدد ميزانيتك ودعنا نرشّح لك الأنسب.</p>
        </div>

        {/* Budget finder */}
        <div className="glass-strong p-6 mb-10 max-w-3xl mx-auto" data-testid="budget-finder">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gold-light">🎯 حدد ميزانيتك</span>
            <span className="chip">{convert(budget, currency)} {curr.symbol}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="15000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full"
            data-testid="budget-slider"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>1,000</span><span>5,000</span><span>10,000</span><span>15,000</span>
          </div>
          <div className="mt-6 text-center p-4 rounded-xl" style={{ background: "rgba(212,168,67,0.07)", border: "1px solid var(--line)" }}>
            <div className="text-xs text-gold-light mb-1">🎯 الأقرب لميزانيتك:</div>
            <div className="font-display text-xl text-gold font-bold">{suggested.name}</div>
            <div className="text-sm text-[var(--text-muted)] mt-2">{suggested.details}</div>
            <div className="font-display text-2xl gradient-gold font-black mt-3">
              {convert(suggested.price, currency)} {curr.symbol}
            </div>
            <button onClick={() => orderPrebuilt(suggested)} className="btn-gold mt-3" data-testid="order-suggested">
              <i className="fa-brands fa-whatsapp" /> اطلب هذه التجميعة
            </button>
          </div>
        </div>

        {/* All prebuilt cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5" data-testid="prebuilt-grid">
          {PREBUILT_PCS.map((pc) => (
            <div key={pc.id} className="glass p-5 flex flex-col h-full hover:translate-y-[-4px] transition-transform"
                 style={{ borderColor: pc.accent + "55" }}
                 data-testid={`prebuilt-card-${pc.id}`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="chip" style={{ color: pc.accent, borderColor: pc.accent + "66", background: pc.accent + "10" }}>
                  {pc.tier === "economy" ? "اقتصادي" : pc.tier === "balanced" ? "متوازن" : pc.tier === "pro" ? "احترافي" : "أسطوري"}
                </div>
                <i className="fa-solid fa-shield-halved text-gold" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">{pc.name}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-grow">{pc.details}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-display text-3xl font-black gradient-gold">{convert(pc.price, currency)}</span>
                <span className="text-sm text-[var(--text-muted)] mb-1">{curr.symbol}</span>
              </div>
              <div className="text-xs text-gold-light mb-3">🛡️ {pc.warranty} ضمان</div>
              <button onClick={() => orderPrebuilt(pc)} className="btn-gold w-full justify-center" data-testid={`order-${pc.id}`}>
                <i className="fa-brands fa-whatsapp" /> اطلب الآن
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
