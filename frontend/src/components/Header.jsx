import React from "react";
import { CURRENCIES } from "@/data/catalog";

export default function Header({ currency, setCurrency, activeTab, setActiveTab }) {
  return (
    <>
      {/* Top contact bar */}
      <div className="w-full text-center py-2 text-xs font-tech tracking-wider border-b border-[var(--line)]"
        style={{ background: "linear-gradient(90deg,#05050a,#12100a,#05050a)" }}
        data-testid="top-bar">
        <span className="text-gold mx-2"><i className="fa-solid fa-shield-halved" /> ضمان 18 شهراً على كل التجميعات</span>
        <span className="text-[var(--text-muted)] mx-2">|</span>
        <span className="text-gold mx-2"><i className="fa-solid fa-truck-fast" /> توصيل لكل دول الخليج</span>
        <span className="text-[var(--text-muted)] mx-2">|</span>
        <span className="text-gold mx-2"><i className="fa-brands fa-whatsapp" /> 0563036134</span>
      </div>

      {/* Currency strip */}
      <div className="w-full flex items-center justify-center gap-3 py-1.5 text-xs flex-wrap"
        style={{ background: "rgba(5,5,10,0.85)" }}>
        <div className="chip"><i className="fa-solid fa-globe" /> العملة العالمية</div>
        <div className="flex items-center gap-2">
          <label className="text-[var(--text-muted)] font-bold">العملة:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            data-testid="currency-select"
            className="itcan-select !py-1 !px-3 !pr-8 !text-xs !w-auto"
          >
            {Object.entries(CURRENCIES).map(([code, c]) => (
              <option key={code} value={code}>{c.flag} {code} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 px-5 py-3 flex items-center justify-between"
        style={{ background: "rgba(5,5,10,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}
        data-testid="main-header">
        <div className="flex items-center gap-3" data-testid="brand">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-black text-lg"
            style={{ background: "linear-gradient(135deg,#f4d36e,#b78a2d)", color: "#0d0a04", boxShadow: "0 4px 18px var(--gold-glow)" }}>
            إت
          </div>
          <div className="leading-tight">
            <div className="font-display font-black text-xl gradient-gold">ITCAN</div>
            <div className="text-[10px] text-[var(--text-muted)] tracking-widest">إتقان • PC BUILDER</div>
          </div>
        </div>

        <nav className="hidden md:flex tab-nav">
          {[
            { id: "builder", label: "🛠️ تجميع مخصص" },
            { id: "prebuilt", label: "⚡ تجميعات جاهزة" },
            { id: "cases", label: "📦 الكيسات" },
            { id: "ai", label: "🤖 المهندس الذكي" },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
              data-testid={`nav-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <a
          href={`https://wa.me/966563036134?text=${encodeURIComponent("السلام عليكم، أحب أستفسر عن تجميعة")}`}
          target="_blank"
          rel="noreferrer"
          className="btn-gold !text-sm"
          data-testid="header-whatsapp"
        >
          <i className="fa-brands fa-whatsapp" /> تواصل واتساب
        </a>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden flex justify-center py-3" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="tab-nav flex-wrap">
          {[
            { id: "builder", label: "🛠️" },
            { id: "prebuilt", label: "⚡" },
            { id: "cases", label: "📦" },
            { id: "ai", label: "🤖" },
          ].map((t) => (
            <button
              key={t.id}
              className={`tab-btn !text-base ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
              data-testid={`mnav-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
