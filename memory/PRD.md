# ITCAN PC Builder — Product Requirements (PRD)

## Original Problem Statement (verbatim)
> اريد التعديلات علي هذا الموقع الاتي في قائمة تجميع البي سي بنفسك اريد فقط تعديل ال 3D بحيث لما تختر قطعتين يتركبو علي بعض بالشكل الحقيقي لهم ومع الوانهم الحقيقية ولما تجمع بي سي كامل يظهر لك البي سي كامل مع كل تفصيله تبين الانواع والاشكال التي اخترتها بالظبط واريدك تعيد تصميم الديزاين بشكل كامل ومن الصفر دون تخريب اي ميزة سابقة وحسن الذكاء الاصطناعي حق الصور وحق الشات وحسن كل المميزات الموجودة دون تخريب اي شي وخذ كل ما تحتاجه من معلومات للموقع من هذا المتجر https://itcan.store/  وحط هذه الصور للكيسات وتاكد من ظهورها للجميع وتظره بنفس الشكل والالوان في ال 3D 

User left implementation decisions to the agent ("اعمل كل شي نعم وعلي ذوقك...").

## Architecture
- **Frontend**: React 19 (CRA + craco) — RTL Arabic, NEON-DARK + GOLD design, Three.js (`@react-three/fiber` + `@react-three/drei`).
- **Backend**: FastAPI (Python) — async, MongoDB via motor.
- **AI**: Gemini 3 Flash via `emergentintegrations` for chat + multimodal image diagnosis (Emergent Universal LLM key).
- **DB**: MongoDB (collections: `chat_history`, `builds`, `status_checks`).

## Completed Features (2026-01)
1. **3D Real-time Assembly Viewer (Three.js R3F)** – any selected part renders on a live motherboard. Selecting two parts shows them assembled together. Selecting a case wraps the build inside the actual ITCAN case with its real color and RGB accent.
2. **Custom PC Builder** – 8 categories (CPU, motherboard, RAM, SSD, GPU, cooler, PSU, case) with full ITCAN catalog; live total + progress bar; WhatsApp order builder.
3. **Inline Case Picker** – 16 ITCAN cases choosable directly inside the Builder with mini thumbnails.
4. **Pre-built PCs (4 tiers)** – Basic / Economy / Pro / Legendary with budget-slider auto-suggestion.
5. **Cases Gallery** – 16 ITCAN models (Penguin Pro, Sushi 345, Covid 55 Eco, Striker, Majesty Barq, Majesty X-Space, Midnight Black, Artic White, TFT418 Pro – Black/White each) with filters: all / black / white / panoramic / cube / tower / premium.
6. **AI Engineer (Chat)** – Arabic multi-turn chat (Gemini 3 Flash), quick-tag suggestions, session persistence.
7. **AI Image Diagnosis** – Upload an image of a PC issue + Arabic description → returns diagnosis text; can forward to WhatsApp support.
8. **Currency Conversion** – 25 currencies (SAR base) with live recomputation.
9. **WhatsApp Integration** – every CTA prefills detailed Arabic messages to `+966 563036134`.
10. **Floating WhatsApp FAB**.

## User Personas
- **PC Gamer (شاب سعودي/خليجي)** — wants the cheapest balanced build, compares parts visually.
- **Tech Enthusiast** — wants top-end builds (RTX 4090 / i9), watches the 3D render.
- **Casual Buyer** — uses budget slider + buys a prebuilt.
- **Support User** — has a problem with their PC, uploads photo for AI diagnosis.

## Core Requirements (static)
- RTL Arabic, no English-only screens.
- All UI must be functional without account / login.
- Currency must default to SAR and persist on switch within session.
- Every part option must be ITCAN-available stock.
- WhatsApp must be the primary order channel.
- The 3D viewer must show real colors and shapes — never abstract.

## Test Status
- Backend: **100%** (5/5 pytest tests) — root, ai/chat, ai/chat multi-turn, ai/diagnose, builds CRUD.
- Frontend: **100%** (9/9 Playwright flows) — RTL home, currency, builder math, 3D canvas, progress, prebuilt + slider, gallery filters, AI chat, AI diagnose with upload.

## Prioritized Backlog
**P1**
- Persist saved builds per user (currently saved only in DB without owner).
- Optional: download configured 3D as PNG / share link.

**P2**
- Stripe / Tap / Hyperpay direct checkout (currently WhatsApp-based).
- Animated assembly transitions (parts "fly in" on selection).
- Add CPU + Cooler socket compatibility validator.
- VR/360 view for cases.

## Files of Interest
- `/app/backend/server.py` — all FastAPI routes.
- `/app/frontend/src/App.js` — root layout.
- `/app/frontend/src/components/ThreeScene.jsx` — Three.js 3D PC.
- `/app/frontend/src/components/PCBuilder.jsx` — main builder.
- `/app/frontend/src/components/CasesGallery.jsx` — 16 cases.
- `/app/frontend/src/components/AISection.jsx` — chat + diagnose.
- `/app/frontend/src/data/catalog.js` — catalog + currencies + WhatsApp + 4 prebuilds.
- `/app/frontend/public/cases/*.png` — 16 real ITCAN case photos.
