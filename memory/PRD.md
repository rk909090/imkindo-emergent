# Imkindo — Product Requirements Document (PRD)

## Original Problem Statement
Build a premium one-page website for Imkindo (imkindo.com) — an Applied Intelligence company evolving from a digital marketing firm. Audience: investors, enterprise clients, strategic partners, organisations exploring AI. Feel: premium tech / venture studio / AI research org. Avoid robots, AI faces, generic chatbot imagery, cheap SaaS styling, excessive blue/purple gradients.

## User Choices (from ask_human)
- Scope: **V1 one-page website**
- Email delivery: **Skipped for V1** — enquiries stored in MongoDB only
- Logo: user has real logo file (imk. wordmark, two red dots), currently recreated in code
- Admin dashboard: skipped for V1
- Venture links: NowAgentAI → https://www.nowagentai.com · NowMoveMe → https://www.nowmoveme.co.uk/uk

## Architecture (V1)
- Frontend: React 19 + Tailwind + shadcn/ui (Select, Sonner) + custom canvas animation
- Backend: FastAPI + Motor (async MongoDB)
- Database: MongoDB collection `enquiries`
- Design system: Cabinet Grotesk (display) + Manrope (body) + JetBrains Mono (overlines); dark #050505 base; single red accent #E60000

## Personas
- **Investors / VC / Family Offices** — evaluating Imkindo as an AI venture holding
- **Enterprise / SME buyers** — exploring bespoke AI implementations
- **Strategic partners** — property, hospitality, technology, media
- **Talent / media** — general enquiries

## Core Requirements (static)
- Premium dark venture-studio aesthetic
- One-page scroll: Hero → Positioning → Value Creation (3 cards) → Ventures (NowAgentAI, NowMoveMe) → Partnerships → Contact form → Footer
- Working enquiry form persisted in MongoDB
- Responsive: desktop / tablet / mobile
- Code structured so pages/ventures can be added later

## Implemented (2026-02)
- ✅ Hero with canvas-based network animation + single red intelligence node
- ✅ Sticky glass header w/ smooth-scroll nav + mobile menu
- ✅ Positioning statement + 25-year narrative
- ✅ Discover / Build / Scale grid tiles with hover glow
- ✅ NowAgentAI & NowMoveMe venture blocks with unique SVG glyphs and external CTA links
- ✅ Partnerships section with abstract dark backdrop and value pillars
- ✅ Contact form: 9 fields, 2 shadcn Selects (bare-metal styled), sonner toast feedback, success state
- ✅ Footer with two ventures, contact email, copyright
- ✅ Backend endpoints: `POST /api/enquiries`, `GET /api/enquiries`
- ✅ SEO: page title, description, OG tags, preconnect for fonts
- ✅ Testing agent: 100% pass on both backend (7 pytest cases) and frontend (all flows)
- ✅ **Contact form email delivery (2026-07)** — Hostinger SMTP (smtp.hostinger.com:465 SSL) sends: (1) internal notification to `mark@imkindo.com` on every submission and (2) auto-confirmation reply to the visitor. Delivery runs as a FastAPI BackgroundTask (non-blocking; DB is source of truth if SMTP fails).
- ✅ **Public contact email changed** from `connect@imkindo.com` → `mark@imkindo.com` (Contact + Footer).

## P0 Backlog (next)
- Real Imkindo `imk.` logo asset (user to upload; will replace code recreation)
- Pre-deployment hardening: auth on `GET /api/enquiries`, CORS lockdown to imkindo.com, 15s axios timeout on form submit
- Retry production deployment on Emergent + guide user through Entri DNS mapping (www.imkindo.com currently on Hostinger)
- Password-protected `/admin` page listing enquiries (filter, CSV export)

## P1 Backlog
- Multi-page structure (About, Ventures detail, Partnerships) if the story expands
- CRM integration (HubSpot / Salesforce) for auto-piping enquiries
- AI enquiry qualification (LLM tags each enquiry by intent/value)
- Automated follow-up workflows

## P2 Backlog
- Case-study / thought-leadership section
- Investor deck / data-room lightbox
- Analytics dashboard on enquiries (source, org type, conversion)
