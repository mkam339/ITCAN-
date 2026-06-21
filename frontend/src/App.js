import React, { useState } from "react";
import "@/styles/itcan.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PCBuilder from "@/components/PCBuilder";
import Prebuilt from "@/components/Prebuilt";
import CasesGallery from "@/components/CasesGallery";
import AISection from "@/components/AISection";
import Footer from "@/components/Footer";

// FontAwesome via CDN
function FontAwesome() {
  React.useEffect(() => {
    if (document.getElementById("fa-cdn")) return;
    const l = document.createElement("link");
    l.id = "fa-cdn";
    l.rel = "stylesheet";
    l.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(l);
  }, []);
  return null;
}

function App() {
  const [currency, setCurrency] = useState("SAR");
  const [activeTab, setActiveTab] = useState("builder");

  const goTo = (id) => {
    setActiveTab(id);
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div dir="rtl" lang="ar" data-testid="app-root">
      <FontAwesome />
      <Header
        currency={currency}
        setCurrency={setCurrency}
        activeTab={activeTab}
        setActiveTab={(id) => goTo(id)}
      />

      <Hero goBuilder={() => goTo("builder")} goPrebuilt={() => goTo("prebuilt")} />

      <div id="section-builder"><PCBuilder currency={currency} /></div>
      <div id="section-prebuilt"><Prebuilt currency={currency} /></div>
      <div id="section-cases"><CasesGallery currency={currency} /></div>
      <div id="section-ai"><AISection /></div>

      <Footer />

      {/* Floating chat fab */}
      <a
        href={`https://wa.me/966563036134?text=${encodeURIComponent("السلام عليكم، أحتاج استشارة")}`}
        target="_blank"
        rel="noreferrer"
        className="chat-fab"
        title="تواصل عبر واتساب"
        data-testid="floating-whatsapp"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
    </div>
  );
}

export default App;
