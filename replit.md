# Overview

This project is a pnpm workspace monorepo using TypeScript, designed to build a comprehensive e-commerce platform. The primary artifact is an Express API server (`api-server`) and a React-based product catalog site (`pallde-store`). The goal is to create a scalable and maintainable system for managing product information, including multilingual support and a flexible pricing system, by integrating data from various manufacturers and e-commerce platforms. The project aims to provide a robust solution for displaying and managing a diverse catalog of children's furniture and play equipment, targeting both retail and wholesale markets with a global presence.

# User Preferences

I prefer detailed explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `lib/api-zod`.
Do not make changes to the folder `lib/api-client-react`.
Do not make changes to the file `artifacts/pallde-store/src/data/products.ts`.
Do not make changes to the file `artifacts/pallde-store/src/data/manufacturers.ts`.
Do not make changes to the folder `artifacts/pallde-store/public/images/`.

# System Architecture

The project is structured as a pnpm monorepo with separate packages for applications (`artifacts/`) and shared libraries (`lib/`). TypeScript is used throughout, leveraging composite projects for efficient type-checking across packages.

**UI/UX Decisions (pallde-store):**
- **Design Approach:** Cloned and adapted product catalog layouts from `pallde.com` and `thelittleconcept.com`, replacing branding with generic placeholders.
- **Admin Panel:** A yellow dashed box on `ProductDetailPage` displays admin-only information like SKU, original source link, and internal product ID.
- **Bilingual Support:** Full bilingual support (Turkish/English) for product names, descriptions, UI strings, and manufacturer details, managed via `LanguageContext` and `useT()` hook. Language switching is available in the Header and Login page.
- **Category System:** Supports hierarchical categories with an optional `parent` field. The homepage displays parent categories as expandable groups.
- **Measurements:** Products display dual units (cm and inches).
- **Product Data:** Static product data is stored in `src/data/products.ts`, sourced from multiple manufacturers with approximately 1,500 products and 2,906 local images.

**Exchange Rate Bar:** Sticky dark bar at top of page showing live USD/TL rate from Frankfurter API (ECB), refreshes every 5 min. Component: `ExchangeRateBar.tsx`.

**AI Competitor Analysis (Live Web Search Pipeline):** Backend POST `/api/competitor-analysis` uses a 3-phase pipeline with **real web search** (no hallucinated URLs):
1. **Phase 1 — Regional Query Generation**: OpenAI gpt-4o generates 3 localized search queries optimized per market (TR: Turkish keywords in cm, Trendyol/Hepsiburada style; USA: American keywords with cm→inch conversion and US bed size mapping like Twin/Full; EU: English keywords in cm, Amazon.co.uk/Wayfair.co.uk style). Each query includes gl/hl geolocation params.
2. **Phase 2 — Live Web Search + Deep Verification**: Uses OpenAI Responses API with `web_search_preview` tool to find REAL product URLs from e-commerce sites. Each region searches 10 candidate URLs. TR and USA regions undergo full deep verification (HTTP GET + HTML body scan with 16 dead-page patterns). EU region uses GDPR bypass strategy: UK market first (gl=gb, hl=en, Amazon.co.uk/Wayfair.co.uk/John Lewis/Etsy UK), with Germany fallback (gl=de, hl=de, Amazon.de/Otto.de) if UK yields < 5 results. EU links from known domains skip HTTP body scraping (which fails due to GDPR cookie walls returning 403/503) and instead validate via URL pattern matching (Amazon ASIN, Etsy listing ID, etc.). Target: 5 verified per region. Verified URLs are enriched with product details via LLM. SSRF protection via blocked hosts list and HTTPS-only enforcement. Detailed error logging: every API request/response, query, and rejection reason logged to console.
3. **Phase 3 — Market Summary**: AI generates a market position summary from the combined results.
DB schema stores `regionalQueries` (jsonb) alongside competitors. 24h cache per SKU. Frontend `CompetitorAnalysis.tsx` shows collapsible AI-generated query panel, step-based loading indicator, and per-tab query display. Vite proxy forwards `/pallde-store/api/` to API server port 8080. Schema: `lib/db/src/schema/competitor-analyses.ts` (includes `RegionalQuery`, `RegionalQueries`, `CompetitorRecord` interfaces). Key constants: `TARGET_PER_REGION=5`, `SEARCH_URLS_PER_REGION=10`, verification batch size=3.

**Manufacturer Data:** 11 manufacturers with full real contact info (address, phone, WhatsApp, email, tax ID, owner/founder names, social media). Countries: TR, USA, Ukraine, Poland, Israel, Romania. Interface includes `ownerContact` and `linkedin` fields.

**Technical Implementations:**
- **API Server (`api-server`):** An Express 5 API server handling routes, request/response validation using Zod schemas generated from OpenAPI, and database persistence.
- **Database (`lib/db`):** PostgreSQL with Drizzle ORM. Drizzle Kit is used for migrations, with a fallback for development.
- **API Specification (`lib/api-spec`):** Manages the OpenAPI 3.1 spec and Orval configuration for code generation.
- **API Codegen:** Orval generates React Query hooks and a fetch client into `lib/api-client-react`, and Zod schemas into `lib/api-zod`.
- **Pricing System:** Prices are stored as USD cost and converted to various display prices (list, sale, wholesale, bulk) using multipliers defined in `src/lib/pricing.ts`. Wholesale and bulk tiers are determined by cart value thresholds.
- **Build System:** `esbuild` is used for bundling applications into CJS. `tsc --build --emitDeclarationOnly` is used for type-checking and generating declaration files.
- **Scripting:** Utility scripts are organized in the `scripts` package, allowing execution of individual TypeScript files.

# External Dependencies

- **Monorepo Tool:** pnpm workspaces
- **Node.js:** Version 24
- **TypeScript:** Version 5.9
- **API Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Validation:** Zod (`zod/v4`), `drizzle-zod`
- **API Codegen:** Orval (from OpenAPI spec)
- **Build Tool:** esbuild (CJS bundle)
- **Frontend Framework:** React (with Vite for `pallde-store`)
- **State Management (Frontend):** React Query
- **Image Storage:** Local `public/images/` directory for all product images.
- **Data Sources:** Data scraped or compiled from various e-commerce sites like pallde.com, thelittleconcept.com, bonchicbaby.com.tr, cedarworks.com, woodandhearts.com (Shopify), communityplaythings.com (Sitecore CMS), plywoodproject.com (Shopify), woodandroom.net (Shopify), and Etsy shops (SABOconcept, RiseUpDesignz, weMadeITpl, WoodenEducationalToy, BushAcres, WoodjoyCollection).