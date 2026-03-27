# PALLDE STORE - A'dan Z'ye Proje Dokümantasyonu
## Tam Kapsamlı Teknik ve İş Mantığı Rehberi

**Proje Adı:** Pallde Çocuk Mobilyaları - Ürün Kataloğu & Rakip Analiz Platformu
**Tarih:** Mart 2026
**Platform:** Replit (pnpm monorepo)
**Dil:** TypeScript (Full-stack)

---

## 1. PROJENİN AMACI VE KAPSAMI

Bu proje, çocuk mobilyası ve oyun ekipmanı sektöründe faaliyet gösteren birden fazla üretici/markayı tek bir platformda toplayan, superadmin-korumalı bir ürün kataloğu ve pazar analizi platformudur.

### Hedefler:
- 11 farklı üreticiden ~1.500 ürünü tek bir katalogda toplamak
- Tüm ürün görsellerini yerel olarak saklamak (4.022 görsel)
- Tüm fiyatları USD bazında tutmak ve otomatik kademe sistemi uygulamak
- Tam çift dilli destek (Türkçe/İngilizce)
- Çift ölçü birimi (cm + inches)
- AI destekli gerçek zamanlı rakip analizi (canlı web araması ile)
- Canlı döviz kuru takibi (USD/TRY)

### Veri Kaynakları (Scrape/Compile Edilen Siteler):
| Kaynak | Tür | Platform |
|--------|-----|----------|
| pallde.com | Ana marka | Custom |
| thelittleconcept.com | Türk mobilya | Custom |
| bonchicbaby.com.tr | Türk mobilya | Custom |
| cedarworks.com | ABD oyun ekipmanı | Custom |
| woodandhearts.com | Ukrayna tırmanma | Shopify |
| communityplaythings.com | ABD sınıf mobilyası | Sitecore CMS |
| plywoodproject.com | Polonya mobilya | Shopify |
| woodandroom.net | Ukrayna mobilya | Shopify |
| SABOconcept (Etsy) | Ukrayna ahşap oyuncak | Etsy |
| WoodenEducationalToy (Etsy) | İsrail eğitici oyuncak | Etsy |
| WoodjoyCollection (Etsy) | Romanya mobilya | Etsy |

---

## 2. TEKNİK MİMARİ

### 2.1 Monorepo Yapısı (pnpm workspace)

```
workspace/
├── artifacts/                    # Uygulamalar
│   ├── api-server/               # Express 5 API sunucusu (port 8080)
│   │   ├── src/
│   │   │   ├── index.ts          # Sunucu giriş noktası
│   │   │   ├── app.ts            # Express app konfigürasyonu
│   │   │   ├── routes/
│   │   │   │   ├── competitor-analysis.ts  # AI rakip analizi (ana dosya ~1000 satır)
│   │   │   │   ├── health.ts     # Health check endpoint
│   │   │   │   └── index.ts      # Route birleştirici
│   │   │   └── middlewares/      # Express middleware'ler
│   │   └── build.ts              # esbuild yapılandırması
│   │
│   ├── pallde-store/             # React + Vite frontend (ana uygulama)
│   │   ├── src/
│   │   │   ├── App.tsx           # Ana uygulama, routing, auth gate
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx          # Ürün kataloğu (sidebar + grid)
│   │   │   │   ├── ProductDetailPage.tsx # Ürün detayı (kompakt, katlanabilir)
│   │   │   │   ├── LoginPage.tsx         # Superadmin giriş
│   │   │   │   ├── ContactPage.tsx       # İletişim
│   │   │   │   └── not-found.tsx         # 404
│   │   │   ├── components/
│   │   │   │   ├── CategorySidebar.tsx   # Sol sabit kategori ağacı
│   │   │   │   ├── CompetitorAnalysis.tsx # Rakip analiz UI (tab'lı, kartlı)
│   │   │   │   ├── ExchangeRateBar.tsx   # Canlı döviz kuru çubuğu
│   │   │   │   ├── Header.tsx            # Üst navigasyon + dil değiştirici
│   │   │   │   ├── Footer.tsx            # Alt bilgi
│   │   │   │   ├── ProductCard.tsx       # Ürün kartı (grid elemanı)
│   │   │   │   ├── CartDrawer.tsx        # Sepet çekmecesi
│   │   │   │   ├── ScrollToTop.tsx       # Yukarı çık butonu
│   │   │   │   └── ui/                   # shadcn/ui bileşenleri
│   │   │   ├── data/
│   │   │   │   ├── products.ts           # 1.500 ürün + 75 kategori (statik)
│   │   │   │   └── manufacturers.ts      # 11 üretici bilgisi
│   │   │   ├── context/
│   │   │   │   ├── CartContext.tsx        # Sepet state yönetimi + kademe
│   │   │   │   └── LanguageContext.tsx    # Dil state yönetimi (TR/EN)
│   │   │   ├── i18n/
│   │   │   │   ├── index.ts              # useT() hook
│   │   │   │   ├── tr.ts                 # Türkçe çeviriler (115 satır)
│   │   │   │   └── en.ts                 # İngilizce çeviriler (115 satır)
│   │   │   └── lib/
│   │   │       └── pricing.ts            # Fiyatlandırma motoru
│   │   └── public/
│   │       └── images/                   # 4.022 yerel ürün görseli
│   │           ├── (630 root-level images)
│   │           ├── cedarworks/           # 176 görsel
│   │           ├── communityplaythings/  # 617 görsel
│   │           ├── plywoodproject/       # 804 görsel
│   │           ├── saboconcept/          # 100 görsel
│   │           ├── woodandhearts/        # 434 görsel
│   │           ├── woodandroom2/         # 244 görsel
│   │           ├── woodeneducationaltoy/ # 967 görsel
│   │           └── woodjoycollection/    # 55 görsel
│   │
│   └── mockup-sandbox/           # Bileşen önizleme sunucusu (port 8081)
│
├── lib/                          # Paylaşılan kütüphaneler
│   ├── db/                       # PostgreSQL + Drizzle ORM
│   │   └── src/schema/
│   │       ├── competitor-analyses.ts  # Rakip analiz tablosu (24s cache)
│   │       ├── conversations.ts
│   │       ├── messages.ts
│   │       └── index.ts
│   ├── api-spec/                 # OpenAPI 3.1 spec + Orval config
│   ├── api-client-react/         # Otomatik üretilen React Query hook'ları
│   ├── api-zod/                  # Otomatik üretilen Zod şemaları
│   └── integrations-openai-ai-*/ # OpenAI AI entegrasyonları
│
├── scripts/                      # Yardımcı scriptler
├── replit.md                     # Proje hafızası
└── pnpm-workspace.yaml           # Workspace tanımı
```

### 2.2 Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Runtime | Node.js | 24.13.0 |
| Package Manager | pnpm | 10.26.1 |
| Dil | TypeScript | 5.9.3 |
| Frontend Framework | React + Vite | 7.3.1 |
| Backend Framework | Express | 5.2.1 |
| Veritabanı | PostgreSQL | Replit managed |
| ORM | Drizzle ORM | 0.45.1 |
| Validasyon | Zod (v4) | - |
| API Codegen | Orval | OpenAPI 3.1'den |
| Build Tool | esbuild | 0.27.3 |
| State Management | React Query + Context | - |
| Styling | Tailwind CSS | v4 |
| UI Kit | shadcn/ui | - |
| AI | OpenAI GPT-4o | Responses API |
| Routing | wouter | - |

---

## 3. KİMLİK DOĞRULAMA SİSTEMİ

### Superadmin Giriş
- **Kullanıcı adı:** `superadmin`
- **Şifre:** `superadmin`
- **Depolama:** localStorage key = `pallde_auth_token`
- **Token:** `btoa(Date.now().toString())` — Base64 kodlanmış timestamp
- **Oturum:** Tarayıcı kapansa bile kalıcı (localStorage)
- **Koruma:** App.tsx'te `isAuthenticated()` fonksiyonu ile tüm route'lar korunur
- **Dosya:** `artifacts/pallde-store/src/pages/LoginPage.tsx`

```typescript
const CREDENTIALS = { username: "superadmin", password: "superadmin" };
export const AUTH_KEY = "pallde_auth_token";
```

Giriş yapılmadan hiçbir sayfa görüntülenemez. Giriş sayfasında da dil değiştirme (TR/EN) mevcuttur.

---

## 4. ÜRÜN VERİ YAPISI

### 4.1 Product Interface
```typescript
interface Product {
  id: string;              // Benzersiz tanımlayıcı
  name: string;            // Birincil isim
  name_tr: string;         // Türkçe isim
  name_en: string;         // İngilizce isim
  price: number;           // Üretim maliyeti (USD)
  formattedPrice: string;  // Gösterim fiyatı (örn: "$764")
  category: string;        // Kategori ID'si
  urlPart: string;         // URL slug'ı
  images: string[];        // Görsel dosya yolları dizisi
  description: string;     // Birincil açıklama
  description_tr: string;  // Türkçe açıklama
  description_en: string;  // İngilizce açıklama
  sku: string;             // Stok kodu
  sourceUrl: string;       // Orijinal kaynak URL'si
  tags?: string[];         // Etiketler (opsiyonel)
  etsyUrl?: string;        // Etsy mağaza linki (opsiyonel)
}
```

### 4.2 Category Interface
```typescript
interface Category {
  id: string;              // Benzersiz tanımlayıcı
  name: string;            // Gösterim adı (Türkçe)
  slug: string;            // URL-dostu isim
  parent?: string | null;  // Üst kategori ID'si
}
```

### 4.3 Kategori Hiyerarşisi (11 Marka, 75 Kategori)

| Marka (Üst Kategori) | Emoji | Alt Kategoriler |
|------------------------|-------|-----------------|
| **Pallde** | 🏠 | Arabalı Yatak, Hazeran (Rattan) Serisi |
| **The Little Concept** | 🌿 | Karyola, Gardırop, Şifonyer, Komodin, Oyuncak Düzenleyici, Kitaplık, Masa, Sandalye, Raf |
| **BonChicBaby** | 🌸 | Çalışma Masası, Gardırop, Oyuncak Dolabı, Sedir, Şifonyer, Yatak |
| **CedarWorks** | 🌲 | Outdoor Playhouses, Backyard Furniture, Playroom Furniture, Indoor Playsets, Play Beds |
| **Wood and Hearts** | ❤️ | Playground Sets, Climbing Gyms, Home Gym & Playroom, Toys & Rockers, Accessories |
| **Community Playthings** | 🏫 | Classroom Furniture, Play Equipment, Outdoor, Art & Science, Accessories |
| **Plywood Project** | 🪵 | Furniture, Desks & Workspaces, Storage & Shelving, Seating, Kids Collection |
| **WoodandRoom** | 🛏️ | Height Charts, Climbing & Balance, Beds & Sleeping, Storage & Shelving, Play Furniture, Toys & Accessories |
| **SABOconcept** | 🌈 | Rainbows, Blocks, Ring Stackers, Kitchen Play, Italy Collection, For Little Ones, Special Collections |
| **WoodenEducationalToy** | 🧩 | Lacing & Threading, Sorting & Matching, Stacking Toys, Puzzles, Montessori, Rainbows & Stackers, Building Blocks, Nesting Dolls, Play Kitchen & Food, Educational Toys |
| **WoodjoyCollection** | ✨ | Furniture, Climbing & Balance, Beds |

### 4.4 Ürün İstatistikleri
- **Toplam ürün:** ~1.500
- **Toplam görsel:** 4.022 (hepsi yerel /public/images/)
- **Ürün verisi deposu:** `artifacts/pallde-store/src/data/products.ts` (4 dahili dizi: `_p1`, `_p2`, `_p3`, `_p4`)
- **Görsel formatları:** JPG, JPEG, PNG, WebP

---

## 5. ÜRETİCİ (MANUFACTURER) VERİ YAPISI

### 5.1 Manufacturer Interface
```typescript
interface Manufacturer {
  id: string;                    // Benzersiz tanımlayıcı (kategori ID'si ile eşleşir)
  name: string;                  // Şirket adı
  website: string;               // Web sitesi
  country: string;               // Ülke
  address?: string;              // Fiziksel adres
  phone?: string;                // Telefon
  email?: string;                // E-posta
  whatsapp?: string;             // WhatsApp
  taxId?: string;                // Vergi numarası
  owner?: string;                // Şirket sahibi / CEO
  ownerContact?: string;         // Yetkili kişi iletişim
  founded?: string;              // Kuruluş yılı
  instagram?: string;            // Instagram profil linki
  facebook?: string;             // Facebook sayfa linki
  pinterest?: string;            // Pinterest profil linki
  youtube?: string;              // YouTube kanal linki
  etsy?: string;                 // Etsy mağaza linki
  linkedin?: string;             // LinkedIn profil linki
  notes?: string;                // Dahili notlar
  description?: { tr: string; en: string }; // Çift dilli açıklama
}
```

### 5.2 Üretici Listesi (11 Adet)

| ID | İsim | Ülke | İletişim Alanları |
|----|------|------|-------------------|
| `pallde` | Pallde Kids | Türkiye | website, adres, telefon, whatsapp, email, instagram |
| `tlc` | The Little Concept | Türkiye | website, adres, email, instagram, facebook |
| `bonchicbaby` | Bon Chic Baby | Türkiye | website, adres, telefon, whatsapp, email, instagram, facebook, linkedin |
| `cedarworks` | CedarWorks | ABD | website, adres, telefon, email, instagram, facebook, pinterest, youtube |
| `woodandhearts` | Wood and Hearts | Ukrayna | website, adres, telefon, email, instagram, facebook, pinterest |
| `communityplaythings` | Community Playthings | ABD | website, adres, telefon, email, facebook, pinterest, youtube |
| `plywoodproject` | Plywood Project | Polonya | website, adres, telefon, email |
| `woodandroom` | Wood and Room | Ukrayna | website, adres, email, instagram, etsy |
| `saboconcept` | SABO Concept | Ukrayna | website, adres, telefon, whatsapp, email, instagram, facebook, etsy |
| `woodened` | Wooden Educational Toy | İsrail | website, adres, email, etsy |
| `woodjoycollection` | Woodjoy Collection | Romanya | website, adres, telefon, email, etsy |

---

## 6. FİYATLANDIRMA SİSTEMİ

### 6.1 Çarpan Sistemi
Ürünler veritabanında **maliyet fiyatı (cost)** olarak USD cinsinden saklanır. Gösterim fiyatları çarpanlarla hesaplanır:

| Kademe | Çarpan | Eşik (Sepet Toplamı) | Renk Kodu |
|--------|--------|----------------------|-----------|
| Liste Fiyatı | cost × 6.0 | - | Üstü çizili gri |
| **Satış (Sale)** | cost × 5.0 | < $15.000 | Turuncu (primary) |
| **Toptan (Wholesale)** | cost × 3.0 | ≥ $15.000 | Mavi |
| **Toplu (Bulk)** | cost × 2.5 | ≥ $100.000 | Mor |

### 6.2 Kademe Belirleme Mantığı
```typescript
// CartContext.tsx'te:
1. saleTotal = computeTotal(items, "sale")   // Önce sale fiyatıyla toplam hesapla
2. tier = getTier(saleTotal)                  // Toplama göre kademe belirle
3. cartTotal = computeTotal(items, tier)      // Son kademeyle gerçek toplam hesapla
```

### 6.3 Örnek Hesaplama
Bir ürünün maliyeti $100 ise:
- **Liste:** $600 (üstü çizili gösterilir)
- **Satış:** $500 (standart fiyat)
- **Toptan:** $300 (sepet ≥ $15.000)
- **Toplu:** $250 (sepet ≥ $100.000, "tahmini" etiketi ile)

**Dosya:** `artifacts/pallde-store/src/lib/pricing.ts`

---

## 7. DÖVİZ KURU SİSTEMİ

### 7.1 ExchangeRateBar Bileşeni
- **API:** Frankfurter API (Avrupa Merkez Bankası verileri)
- **Endpoint:** `https://api.frankfurter.app/latest?from=USD&to=TRY`
- **Güncelleme:** Her 5 dakikada bir otomatik yenilenir
- **Konum:** Sayfanın en üstünde, Header'ın üzerinde, koyu gri şerit
- **Görsel:**
  - Arka plan: `bg-gray-900` (koyu gri)
  - Kur metni: **bold beyaz** (örn: `1 USD = 38.4521 TL`)
  - "Döviz Kuru" etiketi: `text-emerald-400` (yeşil)
  - Son güncelleme zamanı + API kaynağı linki

**Dosya:** `artifacts/pallde-store/src/components/ExchangeRateBar.tsx`

---

## 8. ÇİFT DİL (i18n) SİSTEMİ

### 8.1 Mimari
```
LanguageContext.tsx → useLang() hook → { lang, setLang }
i18n/index.ts      → useT() hook   → lang === "en" ? en : tr
i18n/tr.ts          → Türkçe çeviri nesnesi (116 satır)
i18n/en.ts          → İngilizce çeviri nesnesi (115 satır)
```

### 8.2 Dil Kalıcılığı
- **localStorage key:** `"pallde_lang"`
- Tarayıcı kapansa bile tercih korunur

### 8.3 Çevrilen Bölümler
| Bölüm Anahtarı | İçerik |
|-----------------|--------|
| `nav` | Navigasyon linkleri (Katalog, İletişim, Sepet, Geri, Ana Sayfa) |
| `login` | Giriş formu etiketleri, hata mesajları |
| `catalog` | Katalog başlıkları, kategori etiketleri, "Tüm Ürünler", "Kategoriler" |
| `product` | Ürün detay: Açıklama, Sepete Ekle, fiyat kademeleri |
| `cart` | Sepet UI: boş durum, toplam, kademe etiketleri |
| `admin` | Admin/üretici bilgileri (üretim maliyeti, vergi no, sosyal medya...) |
| `pricing` | Kademe etiketleri (Standart, Toptan, Toplu Sipariş) |
| `footer` | Alt bilgi linkleri ve telif hakkı |
| `contact` | İletişim sayfası |
| `notFound` | 404 sayfası |

### 8.4 Dil Değiştirme
Header bileşeninde **TR** / **EN** butonları ile anlık geçiş. Aktif dil turuncu arka planla vurgulanır.

---

## 9. AI RAKİP ANALİZİ SİSTEMİ (Canlı Web Araması Pipeline)

Bu, projenin en karmaşık ve yenilikçi bileşenidir. Herhangi bir ürün için dünya genelinde 3 pazarda (Türkiye, ABD, Avrupa) gerçek rakip ürünleri bulan, doğrulayan ve karşılaştıran bir AI pipeline'ıdır.

### 9.1 API Endpoint
```
POST /api/competitor-analysis
Body: { productName, productDescription, productPrice, productCategory, sku }
```

### 9.2 3 Fazlı Pipeline

#### Faz 1: Bölgesel Sorgu Üretimi (AI)
OpenAI GPT-4o, ürün bilgilerine göre 3 yerelleştirilmiş arama sorgusu üretir:

| Bölge | Dil | Ölçü | Hedef Siteler | Geolocation |
|-------|-----|------|---------------|-------------|
| **TR** | Türkçe | cm | trendyol.com, hepsiburada.com, n11.com, ciceksepeti.com, .com.tr | gl=tr, hl=tr |
| **USA** | İngilizce | inches (cm→inch çeviri) | amazon.com, etsy.com, wayfair.com, target.com, walmart.com | gl=us, hl=en |
| **EU** | İngilizce (British) | cm | amazon.co.uk, wayfair.co.uk, johnlewis.com, argos.co.uk, etsy.com/uk | gl=gb, hl=en |

**Özel özellikler:**
- ABD sorguları cm→inch çevirisi yapar (örn: 90×190 cm → 35½″ × 75″)
- ABD yatak boyutları ABD standartlarına çevrilir (Twin, Full, Queen)
- Türkiye sorguları Türkçe e-ticaret terminolojisi kullanır

#### Faz 2: Canlı Web Araması + Derin Doğrulama

**OpenAI Responses API Entegrasyonu:**
```typescript
// Standard chat completions API DEĞİL, Responses API kullanılır:
POST https://api.openai.com/v1/responses
{
  model: "gpt-4o",
  tools: [{ type: "web_search_preview", search_context_size: "medium" }],
  input: "Search query with site restrictions..."
}
```

**Her bölge için akış:**
1. AI, `web_search_preview` tool'u ile gerçek web araması yapar
2. Dönen yanıttan URL'ler regex ile çıkarılır
3. Arama/kategori sayfaları filtrelenir (yalnızca ürün sayfaları alınır)
4. Hedef: Bölge başına 10 aday URL → 5 doğrulanmış URL

**URL Doğrulama (Deep Verification):**
- **TR + USA:** HTTP GET isteği + HTML body taraması
  - Gerçekçi `BROWSER_HEADERS` ile istek
  - Redirect takibi → final URL kontrolü
  - 16 "ölü sayfa" deseni ile body taraması (404, stok yok, sayfa bulunamadı vb.)
  - Sayfa boyutu < 500 karakter → red
- **EU (GDPR Bypass):** HTTP body kontrolü yapılMAZ
  - EU siteleri GDPR cookie duvarları nedeniyle 403/503 döner
  - Bunun yerine URL pattern doğrulaması:
    - Amazon: `/dp/ASIN` formatı
    - Etsy: `/listing/ID` formatı
    - Trendyol: `-p-ID` formatı
    - Hepsiburada: `-pm-` formatı
  - `isEuDomain()` + `isKnownProductUrlPattern()` fonksiyonları

**EU İki Fazlı Arama:**
1. **Faz 1 (İngiltere):** gl=gb, hl=en — Amazon.co.uk, Wayfair.co.uk, John Lewis, Argos, Etsy UK
2. **Faz 2 (Almanya fallback):** Eğer İngiltere'den < 5 sonuç gelirse:
   - gl=de, hl=de
   - Sorgu otomatik Almanca'ya çevrilir (`generateGermanQuery()`)
   - Amazon.de, Otto.de, kidswoodlove.de aranır

**SSRF Koruması:**
```typescript
const BLOCKED_HOSTS = [
  "localhost", "127.0.0.1", "0.0.0.0",
  "10.*", "172.16-31.*", "192.168.*",
  "google.com", "github.com", "replit.com" ...
];
// Sadece HTTPS protokolü kabul edilir
```

#### Faz 3: Veri Zenginleştirme + Pazar Özeti

**Zenginleştirme:** Doğrulanmış URL'ler GPT-4o'ya gönderilir ve şu veriler çıkarılır:
- Ürün adı, marka
- Yerel fiyat (£, $, ₺, €)
- TRY'ye çevrilmiş fiyat
- Yıldız puanı
- Eşleşme skoru (0-100)

**Pazar Özeti:** Son bir AI çağrısıyla 2-3 cümlelik yönetici özeti üretilir.

### 9.3 Veritabanı Önbellekleme
```typescript
// lib/db/src/schema/competitor-analyses.ts
const competitorAnalysesTable = pgTable("competitor_analyses", {
  id: serial("id").primaryKey(),
  sku: varchar("sku").notNull(),
  productName: text("product_name"),
  competitors: jsonb("competitors"),        // CompetitorRecord[]
  regionalQueries: jsonb("regional_queries"), // { TR, USA, EU }
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow(),
});
```
- **TTL:** 24 saat — aynı SKU için tekrar istek gelirse cache'ten döner
- **Cache key:** SKU

### 9.4 Frontend Bileşeni (CompetitorAnalysis.tsx)

**Yükleme Aşamaları (3 adım):**
1. "AI sorgu üretimi" / "AI query generation"
2. "Canlı web araması" / "Live web search"
3. "Sonuç doğrulama" / "Result validation"

**Sonuç Gösterimi:**
- 3 bölge tab'ı: TR (Türkiye 🇹🇷), USA (ABD 🇺🇸), EU (Avrupa 🇪🇺)
- Her tab'da kullanılan arama sorgusu gösterilir (genişletilebilir panel)
- Rakip kartları:
  - Eşleşme skoru (yeşil/turuncu/kırmızı renk kodlu)
  - Yıldız puanı
  - Yerel fiyat + TRY fiyatı
  - **"Doğrulanmış Link"** yeşil butonu (gerçek e-ticaret sitesine yönlendirir)
- Alt bilgide: toplam rakip sayısı + bölge bazında dağılım

### 9.5 Önemli Sabitler
```typescript
const TARGET_PER_REGION = 5;          // Bölge başına hedef sonuç
const SEARCH_URLS_PER_REGION = 10;    // Aday URL sayısı
const VERIFY_TIMEOUT = 12000;         // URL doğrulama timeout (ms)
const VERIFY_BATCH_SIZE = 3;          // Paralel doğrulama sayısı
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat cache
```

### 9.6 Bölge Hedef Siteleri
```typescript
const REGION_SITES = {
  TR: ["trendyol.com", "hepsiburada.com", "n11.com", "ciceksepeti.com", ".com.tr"],
  USA: ["amazon.com", "etsy.com", "wayfair.com", "target.com", "walmart.com", "potterybarnkids.com"],
  EU_GB: ["amazon.co.uk", "etsy.com/uk", "wayfair.co.uk", "johnlewis.com", "argos.co.uk", "vertbaudet.co.uk"],
  EU_DE: ["amazon.de", "otto.de", "kidswoodlove.de"]  // Fallback
};
```

---

## 10. FRONTEND BİLEŞENLERİ DETAY

### 10.1 Ana Sayfa (HomePage.tsx)

**Layout:**
- **Desktop (lg+):** Sol tarafta sabit 256px CategorySidebar + Sağda ürün grid'i
- **Mobil/Tablet:** Sidebar gizli, üstte kategori kartları grid'i

**Kategori Navigasyonu:**
- "Tüm Ürünler" butonu (toplam ürün sayısı badge'i ile)
- Marka kartları (emoji ikon + ürün sayısı)
- Tıklayınca alt kategoriler genişler (chevron ile)
- Aktif kategori turuncu vurgu

**Ürün Grid:**
- "Tüm Ürünler" modunda: marka bazında gruplanmış, alt kategori başlıklı
- Filtrelenmiş modda: düz grid
- Responsive: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`

### 10.2 CategorySidebar (CategorySidebar.tsx)

- `hidden lg:block` — yalnızca masaüstünde görünür
- `sticky top-28` — kaydırırken sabit kalır
- `max-h-[calc(100vh-8rem)]` — ekran yüksekliğine sığar
- `overflow-y-auto` + ince scrollbar (özel CSS)
- Kategori ağacı: üst kategori → alt kategoriler (sol kenarda çizgi ile bağlantılı)

### 10.3 Ürün Detay Sayfası (ProductDetailPage.tsx)

**Sayfa Açılış:** `useEffect` ile sayfanın en üstüne scroll (instant)

**Layout:** `grid-cols-1 lg:grid-cols-5` — Görsel (2/5) + Bilgi (3/5)

**Katlanabilir Section Bileşeni:**
```typescript
function Section({ title, icon, defaultOpen, variant, children }) {
  // variant: "default" | "admin" | "manufacturer"
  // Tıkla → aç/kapa
}
```

**Bölümler (yukarıdan aşağıya):**
1. Breadcrumb navigasyon
2. Geri butonu
3. **Görsel galerisi** (ana görsel + küçük resimler)
4. **Ürün bilgileri** (isim, fiyat, kademe badge'i)
5. **Sepete ekle** (miktar seçici + toplam fiyat)
6. **Kaynak link** (orijinal mağaza)
7. **Açıklama** (varsayılan açık, katlanabilir)
8. **Fiyat Kademeleri** (varsayılan kapalı, katlanabilir)
9. **🔒 Admin Bilgisi** (sarı panel, kapalı) — maliyet, çarpanlar, SKU, kaynak URL
10. **🏭 Üretici Bilgileri** (mavi panel, kapalı) — şirket, iletişim, sosyal medya
11. **Rakip Analizi** (CompetitorAnalysis bileşeni)
12. **Benzer Ürünler** (aynı kategoriden 4 ürün)

### 10.4 ScrollToTop (ScrollToTop.tsx)
- 400px aşağı kaydırınca görünür
- Sağ alt köşede sabit (fixed)
- Turuncu daire, yukarı ok ikonu
- Hover'da hafif büyüme efekti
- `window.scrollTo({ top: 0, behavior: "smooth" })`

### 10.5 CartDrawer (CartDrawer.tsx)
- Sağdan açılan çekmece (drawer)
- Ürün listesi + miktar değiştirme
- Dinamik kademe gösterimi (sepet toplamına göre)
- Kademe ilerleme çubuğu
- Toplam fiyat + tahmini uyarısı (bulk kademe için)

### 10.6 Header (Header.tsx)
- Logo + navigasyon linkleri (Katalog, İletişim)
- Dil değiştirici (TR/EN butonları)
- Sepet ikonu (ürün sayısı badge'i)
- Responsive hamburger menü (mobil)

### 10.7 ExchangeRateBar (ExchangeRateBar.tsx)
- Sayfanın en üstündeki koyu gri şerit
- Canlı USD/TRY kuru
- 5 dakikada bir yenilenir
- Kaynak linki (Frankfurter API)

---

## 11. VERİTABANI ŞEMASI

### PostgreSQL + Drizzle ORM

**Tablolar:**
1. **competitor_analyses** — Rakip analiz sonuçları cache'i
   - `id`, `sku`, `productName`, `competitors` (jsonb), `regionalQueries` (jsonb), `summary`, `createdAt`
2. **conversations** — Konuşma kayıtları
3. **messages** — Mesaj kayıtları

**Competitor Record (jsonb):**
```typescript
interface CompetitorRecord {
  name: string;
  brand: string;
  productUrl: string;
  priceLocal: string;
  priceTRY: string;
  currency: string;
  country: string;
  region: "TR" | "USA" | "EU";
  rating: number;
  reviewCount: number;
  matchScore: number;
  urlVerified: boolean;
  verificationMethod: string;
}
```

**Regional Queries (jsonb):**
```typescript
interface RegionalQueries {
  TR: { query: string; gl: string; hl: string };
  USA: { query: string; gl: string; hl: string };
  EU: { query: string; gl: string; hl: string };
}
```

---

## 12. API SUNUCUSU

### Express 5 API (port 8080)

**Route'lar:**
| Method | Path | İşlev |
|--------|------|-------|
| GET | `/api/health` | Health check |
| GET | `/api/competitor-analysis/:sku` | Cache'ten rakip analizi getir |
| POST | `/api/competitor-analysis` | Yeni rakip analizi başlat |

**Vite Proxy Konfigürasyonu:**
```typescript
// pallde-store/vite.config.ts
server: {
  proxy: {
    '/pallde-store/api/': {
      target: 'http://localhost:8080',
      rewrite: (path) => path.replace(/^\/pallde-store/, ''),
    }
  }
}
```

**OpenAI Entegrasyonu:**
- Replit AI Integrations proxy üzerinden
- Env vars: `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY`
- Model: `gpt-4o`

---

## 13. STYLING VE UI

### Tailwind CSS v4 + shadcn/ui

**Renk Paleti:**
- **Primary:** Turuncu/amber tonları (HSL değişkenleri ile)
- **Background:** Bej/krem (`hsl(var(--background))`)
- **Admin paneli:** Sarı (`yellow-50`, `yellow-300` border)
- **Üretici paneli:** Mavi (`blue-50`, `blue-300` border)
- **Kademe renkleri:** Turuncu (sale), Mavi (wholesale), Mor (bulk)

**Özel CSS:**
- `.scrollbar-thin` — İnce scrollbar (4px, border renkli)
- Responsive breakpoint'ler: `sm`, `lg`, `xl`

---

## 14. WORKFLOW'LAR (Replit)

| İsim | Komut | Port |
|------|-------|------|
| `pallde-store: web` | `pnpm --filter @workspace/pallde-store run dev` | Dinamik (Vite) |
| `api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | 8080 |
| `mockup-sandbox: Component Preview Server` | `pnpm --filter @workspace/mockup-sandbox run dev` | 8081 |

---

## 15. DOKUNULMAMASI GEREKEN DOSYALAR

Kullanıcının açık talebi ile bu dosyalar/klasörler değiştirilmemelidir:
- `artifacts/pallde-store/src/data/products.ts`
- `artifacts/pallde-store/src/data/manufacturers.ts`
- `artifacts/pallde-store/public/images/`
- `lib/api-zod/`
- `lib/api-client-react/`

---

## 16. GELİŞTİRME NOTLARI VE ÖNEMLİ KARARLAR

### Neden Responses API?
Başlangıçta standart chat completions API kullanıldığında AI "hallucinate" edip sahte URL'ler üretiyordu. OpenAI Responses API'nin `web_search_preview` tool'u ile **gerçek web araması** yapılabiliyor ve dönen URL'ler gerçek.

### Neden GDPR Bypass?
Avrupa'daki e-ticaret siteleri (amazon.co.uk, amazon.de vb.) sunucu tarafından yapılan HTTP isteklerine GDPR cookie consent duvarı nedeniyle 403 veya 503 hatası döndürüyor. Bu yüzden EU URL'leri için HTTP body kontrolü atlanıp sadece URL yapısı doğrulanıyor.

### Neden İki Fazlı EU Arama?
İngiltere pazarı genellikle yeterli sonuç verir, ancak niş ürünlerde yetersiz kalabilir. Bu durumda Almanya pazarına fallback yapılır ve sorgu otomatik olarak Almanca'ya çevrilir.

### Neden Statik Ürün Verisi?
~1.500 ürün ve 4.022 görsel doğrudan kodda ve yerel dosyalarda tutularak dış bağımlılık ortadan kaldırılmıştır. Harici API veya CDN gerektirmez.

### Ölçü Birimi Formatı
Tüm ölçüler `90×160 cm (35½″ × 63″)` formatında gösterilir. Unicode ″ (U+2033) karakteri kullanılır.

---

## 17. PROJE KRONOLOJİSİ (Yapılan İşler)

1. **Monorepo kurulumu** — pnpm workspace, TypeScript, Vite, Express
2. **Ürün veri toplama** — 11 siteden ~1.500 ürün scrape/derleme
3. **4.022 görsel indirme** — Tüm görseller yerel depolama
4. **Kategori hiyerarşisi** — 11 marka, 75 alt kategori
5. **Çift dil sistemi** — TR/EN, localStorage kalıcılığı
6. **Fiyatlandırma motoru** — Maliyet bazlı 4 kademe (×6, ×5, ×3, ×2.5)
7. **Sepet sistemi** — Dinamik kademe geçişi, çekmece UI
8. **Döviz kuru çubuğu** — Frankfurter API, 5dk yenileme
9. **Üretici bilgi kartları** — 11 üretici, tam iletişim
10. **Superadmin kimlik doğrulama** — localStorage tabanlı
11. **AI rakip analizi v1** — Chat completions API (sorunlu, hallucinate)
12. **AI rakip analizi v2** — Responses API + web_search_preview (çalışıyor)
13. **Deep URL verification** — 16 ölü sayfa deseni, SSRF koruması
14. **EU GDPR bypass** — URL pattern doğrulaması
15. **EU iki fazlı arama** — GB öncelikli, DE fallback
16. **Detaylı hata günlüğü** — Her API çağrısı loglanır
17. **Veritabanı cache** — 24 saat TTL, SKU bazlı
18. **Sol kategori sidebar** — Sabit, kaydırılabilir, hiyerarşik
19. **Yukarı çık butonu** — Scroll-to-top, animasyonlu
20. **Kompakt ürün detay sayfası** — Katlanabilir bölümler, sayfa üstü scroll

---

## 18. DOSYA BOYUTLARI VE İSTATİSTİKLER

| Metrik | Değer |
|--------|-------|
| Toplam ürün | ~1.500 |
| Toplam görsel | 4.022 |
| Toplam kategori | 75 (11 üst + 64 alt) |
| Toplam üretici | 11 |
| Desteklenen diller | 2 (TR, EN) |
| Fiyat kademeleri | 4 (liste, satış, toptan, toplu) |
| Rakip analizi bölgeleri | 3 (TR, USA, EU) |
| Bölge başına hedef sonuç | 5 |
| Cache TTL | 24 saat |
| Döviz kuru yenileme | 5 dakika |
| AI modeli | GPT-4o |
| Veritabanı | PostgreSQL (Replit managed) |
| Node.js | v24.13.0 |
| TypeScript | v5.9.3 |

---

*Bu döküman, Pallde Store projesinin A'dan Z'ye tüm teknik detaylarını, iş mantığını, veri yapılarını ve mimari kararlarını kapsamaktadır. Herhangi bir AI asistanın (Claude, Gemini, GPT vb.) projeyi tam olarak anlaması ve üzerinde çalışabilmesi için yeterli bilgiyi içermektedir.*
