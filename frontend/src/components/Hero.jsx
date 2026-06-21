import React from "react";

export default function Hero({ goBuilder, goPrebuilt }) {
  return (
    <section className="section spotlight">
      <div className="container-itcan">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7" data-testid="hero-text">
            <div className="chip mb-5 animate-pulse-gold"><i className="fa-solid fa-bolt" /> الجيل القادم من تجميع الحواسيب</div>
            <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.1] mb-5">
              <span className="gradient-gold">إتـقـان</span>
              <br />
              <span className="text-white">ITCAN</span>
              <br />
              <span className="gradient-neon text-3xl md:text-4xl">جمّع جهازك ثلاثي الأبعاد</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-xl mb-7 max-w-2xl leading-relaxed">
              اختر القطع وشاهدها <strong className="text-gold">تتركّب فعلياً</strong> أمامك بألوانها وأشكالها الحقيقية،
              من المعالج وحتى الكيسة. مدعوم بالذكاء الاصطناعي لتشخيص المشاكل واقتراح أفضل تجميعة.
            </p>
            <div className="flex flex-wrap gap-3" data-testid="hero-cta">
              <button onClick={goBuilder} className="btn-gold text-base" data-testid="cta-build">
                <i className="fa-solid fa-screwdriver-wrench" /> ابدأ التجميع ثلاثي الأبعاد
              </button>
              <button onClick={goPrebuilt} className="btn-ghost text-base" data-testid="cta-prebuilt">
                <i className="fa-solid fa-rocket" /> تجميعات جاهزة
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl" data-testid="hero-stats">
              {[
                { k: "+18", v: "شهر ضمان" },
                { k: "120+", v: "قطعة أصلية" },
                { k: "24/7", v: "دعم فني" },
              ].map((s) => (
                <div key={s.k} className="glass !rounded-2xl p-4 text-center">
                  <div className="font-display font-black text-2xl gradient-gold">{s.k}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative" data-testid="hero-art">
            <div className="glass-strong p-6 animate-float relative overflow-hidden">
              <div className="absolute -inset-px rounded-[20px] pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 20%, rgba(212,168,67,0.18), transparent 60%)" }} />
              <div className="flex justify-between items-center mb-4 relative">
                <div className="chip"><i className="fa-solid fa-microchip" /> LIVE 3D PREVIEW</div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                </div>
              </div>
              <div className="aspect-[5/4] rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0a0a14,#050608)" }}>
                <img src="/cases/tft418-pro-black.png" alt="ITCAN Case" className="max-h-[280px] object-contain animate-float" />
              </div>
              <div className="mt-4 text-center">
                <div className="font-display text-gold-light font-bold text-sm">TFT418 PRO • BLACK</div>
                <div className="text-xs text-[var(--text-muted)]">RGB Panoramic • Tempered Glass</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
