import React, { useState } from "react";
import { CASE_OPTIONS, CURRENCIES, WHATSAPP_NUMBER } from "@/data/catalog";

function convert(priceSar, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.SAR;
  const v = priceSar * c.rate;
  return v < 10 ? v.toFixed(2) : v.toFixed(0);
}

export default function CasesGallery({ currency }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const curr = CURRENCIES[currency] || CURRENCIES.SAR;

  const filtered = CASE_OPTIONS.filter((c) => {
    if (filter === "all") return true;
    if (filter === "black" || filter === "white") return c.color === filter;
    return c.style === filter;
  });

  const orderCase = (c) => {
    const msg = `السلام عليكم 👋\nأريد طلب الكيسة *${c.value}* من إتقان.\n💰 ${convert(c.price, currency)} ${curr.symbol}\n\nمن فضلك أكد التوفر.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filters = [
    { id: "all", label: "الكل" },
    { id: "black", label: "أسود" },
    { id: "white", label: "أبيض" },
    { id: "panoramic", label: "بانورامية" },
    { id: "cube", label: "مكعب" },
    { id: "tower", label: "Tower" },
    { id: "premium", label: "Premium" },
  ];

  return (
    <section className="section" data-testid="cases-section">
      <div className="container-itcan">
        <div className="text-center mb-8">
          <div className="chip mb-3"><i className="fa-solid fa-cube" /> ITCAN CASE COLLECTION</div>
          <h2 className="section-title gradient-gold">معرض الكيسات الأصلية</h2>
          <p className="section-sub">16 موديل من تشكيلة إتقان — بألوان حقيقية وتفاصيل بانورامية وإضاءة RGB.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8 overflow-x-auto tab-row">
          <div className="tab-nav">
            {filters.map((f) => (
              <button key={f.id}
                onClick={() => setFilter(f.id)}
                className={`tab-btn ${filter === f.id ? "active" : ""}`}
                data-testid={`case-filter-${f.id}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="cases-grid">
          {filtered.map((c) => (
            <div key={c.value}
              className={`case-card ${active === c.value ? "selected" : ""}`}
              onClick={() => setActive(c.value)}
              data-testid={`case-card-${c.value.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="img-wrap">
                <img src={c.image} alt={c.value} loading="lazy" />
              </div>
              <div className="p-3 border-t" style={{ borderColor: "var(--line)" }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display text-sm font-bold text-white">{c.value}</div>
                  <span className="w-3 h-3 rounded-full" style={{ background: c.neon, boxShadow: `0 0 8px ${c.neon}` }} />
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-2">
                  {c.color === "black" ? "🖤 أسود" : "🤍 أبيض"} • {c.style.toUpperCase()}
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-display font-black gradient-gold text-lg">
                    {convert(c.price, currency)} <span className="text-xs">{curr.symbol}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); orderCase(c); }}
                    className="btn-gold !text-xs !px-3 !py-1.5"
                    data-testid={`buy-${c.value.replace(/\s+/g, "-").toLowerCase()}`}>
                    <i className="fa-brands fa-whatsapp" /> اطلب
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
