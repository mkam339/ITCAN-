import React from "react";
import { WHATSAPP_NUMBER, PHONE_DISPLAY, STORE_URL } from "@/data/catalog";

export default function Footer() {
  return (
    <footer className="mt-12 pb-10" style={{ borderTop: "1px solid var(--line)", background: "rgba(5,5,10,0.6)" }} data-testid="footer">
      <div className="container-itcan py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black"
                style={{ background: "linear-gradient(135deg,#f4d36e,#b78a2d)", color: "#0d0a04" }}>إت</div>
              <div className="font-display font-black text-xl gradient-gold">ITCAN</div>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              متجر إتقان للحاسبات — تجميعات احترافية بأعلى المواصفات وضمان 18 شهراً، بألوان وأشكال حقيقية في معاينة ثلاثية الأبعاد.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gold-light mb-3">روابط سريعة</h4>
            <ul className="text-sm space-y-2 text-[var(--text-muted)]">
              <li><a href="#" className="hover:text-gold">التجميع المخصص</a></li>
              <li><a href="#" className="hover:text-gold">التجميعات الجاهزة</a></li>
              <li><a href="#" className="hover:text-gold">معرض الكيسات</a></li>
              <li><a href="#" className="hover:text-gold">المهندس الذكي</a></li>
              <li><a href={STORE_URL} target="_blank" rel="noreferrer" className="hover:text-gold">المتجر الإلكتروني</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold-light mb-3">الدفع والشحن</h4>
            <ul className="text-sm space-y-2 text-[var(--text-muted)]">
              <li>💳 جميع وسائل الدفع المحلية</li>
              <li>🚚 توصيل لكل دول الخليج</li>
              <li>🛡️ ضمان 18 شهراً</li>
              <li>🔄 استبدال خلال 7 أيام</li>
              <li>📦 تجميع و اختبار قبل الشحن</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold-light mb-3">تواصل معنا</h4>
            <div className="space-y-2 text-sm">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors" data-testid="footer-whatsapp">
                <i className="fa-brands fa-whatsapp text-green-400 text-lg" /> {PHONE_DISPLAY}
              </a>
              <a href={STORE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors" data-testid="footer-store">
                <i className="fa-solid fa-globe text-gold text-lg" /> itcan.store
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-gold transition-colors">
                <i className="fa-brands fa-instagram text-pink-400 text-lg" /> @itcan.store
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-gold transition-colors">
                <i className="fa-brands fa-tiktok text-white text-lg" /> @itcan.store
              </a>
            </div>
          </div>
        </div>

        <div className="divider-gold"></div>
        <div className="text-center text-xs text-[var(--text-muted)]">
          © 2026 ITCAN • إتقان • جميع الحقوق محفوظة • Powered by AI 🤖
        </div>
      </div>
    </footer>
  );
}
