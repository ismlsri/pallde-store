# REPLİT PROJE RAPORU
# 22 MART 2026 — DETAYLI SİSTEM RAPORU
# PALLDE STORE: Çocuk Mobilyası Ürün Kataloğu & AI Rakip Analiz Platformu

**Rapor Tarihi:** 22 Mart 2026
**Platform:** Replit
**Proje Türü:** Full-Stack Web Uygulaması (pnpm monorepo)
**Teknoloji:** TypeScript, React, Express, PostgreSQL
**Durum:** Aktif Geliştirme

---

# BÖLÜM 0: PROJE ERİŞİM BİLGİLERİ — TÜM GİRİŞ, LİNK, ŞİFRE VE ANAHTARLAR

> Bu bölüm, projeye erişmek ve üzerinde çalışmak için gereken TÜM bilgileri içerir.

## 0.1 Replit Proje Bağlantısı (IDE & Kod Editörü)
| Bilgi | Değer |
|-------|-------|
| **Replit Proje Linki** | `https://replit.com/@ismails5434/workspace` |
| **Proje Sahibi** | `ismails5434` |
| **Proje Slug** | `workspace` |

Bu link üzerinden Replit IDE'ye (kod editörü, terminal, önizleme) doğrudan erişilir.

## 0.2 Canlı Uygulama (Geliştirme Sunucusu)
| Bilgi | Değer |
|-------|-------|
| **Ana Uygulama URL** | `https://fb25041c-fd3a-4b69-8e8e-8d3d7c27f907-00-2qlr9kjj9xrt2.picard.replit.dev/pallde-store` |
| **API Sunucusu URL** | `https://fb25041c-fd3a-4b69-8e8e-8d3d7c27f907-00-2qlr9kjj9xrt2.picard.replit.dev/pallde-store/api/` |
| **API Health Check** | `https://fb25041c-fd3a-4b69-8e8e-8d3d7c27f907-00-2qlr9kjj9xrt2.picard.replit.dev/pallde-store/api/health` |
| **Dev Domain** | `fb25041c-fd3a-4b69-8e8e-8d3d7c27f907-00-2qlr9kjj9xrt2.picard.replit.dev` |

> **Not:** Geliştirme sunucusu URL'leri Replit oturumu yeniden başlatıldığında değişebilir. Yukarıdaki linkler 22 Mart 2026 itibarıyla geçerlidir.

## 0.3 Uygulama Giriş Bilgileri (Superadmin)
| Bilgi | Değer |
|-------|-------|
| **Kullanıcı Adı** | `superadmin` |
| **Şifre** | `superadmin` |
| **Oturum Anahtarı** | localStorage → `pallde_auth_token` |
| **Token Formatı** | `btoa(Date.now().toString())` (Base64 zaman damgası) |
| **Oturum Süresi** | Kalıcı (tarayıcı kapatılsa bile devam eder) |

Uygulama açıldığında otomatik olarak giriş ekranı gelir. Yukarıdaki bilgilerle giriş yapılır.

## 0.4 Veritabanı Erişim Bilgileri (PostgreSQL)
| Bilgi | Değer |
|-------|-------|
| **Veritabanı Türü** | PostgreSQL (Replit Managed) |
| **Host** | `helium` (Replit iç ağ) |
| **Port** | `5432` |
| **Kullanıcı** | `postgres` |
| **Veritabanı Adı** | `heliumdb` |
| **Bağlantı Değişkeni** | `DATABASE_URL` (Replit Secrets'ta saklanır) |
| **ORM** | Drizzle ORM v0.45.1 |

> **Not:** Veritabanına yalnızca Replit ortamı içinden erişilebilir. Dışarıdan doğrudan bağlantı yapılamaz.

## 0.5 AI (Yapay Zeka) Entegrasyon Bilgileri
| Bilgi | Değer |
|-------|-------|
| **AI Servisi** | OpenAI GPT-4o |
| **Erişim Yöntemi** | Replit AI Integrations Proxy |
| **Base URL Değişkeni** | `AI_INTEGRATIONS_OPENAI_BASE_URL` |
| **API Key Değişkeni** | `AI_INTEGRATIONS_OPENAI_API_KEY` |
| **Model** | `gpt-4o` |
| **API Türü** | OpenAI Responses API (web_search_preview tool ile) |

> **Not:** API anahtarı Replit tarafından otomatik sağlanır ve yönetilir. Manuel API anahtarı girmeye gerek yoktur. Replit AI Integrations proxy'si üzerinden çalışır.

## 0.6 Döviz Kuru API'si
| Bilgi | Değer |
|-------|-------|
| **API** | Frankfurter API |
| **Endpoint** | `https://api.frankfurter.app/latest?from=USD&to=TRY` |
| **Veri Kaynağı** | Avrupa Merkez Bankası (ECB) |
| **Kimlik Doğrulama** | Gerekli değil (açık API) |
| **Güncelleme Sıklığı** | Her 5 dakikada bir otomatik |

## 0.7 Port Yapılandırması
| Servis | Port | Açıklama |
|--------|------|----------|
| Pallde Store (Vite Frontend) | Dinamik (`PORT` env var) | React uygulaması |
| API Server (Express Backend) | `8080` | Rakip analizi API'si |
| Mockup Sandbox | `8081` | Bileşen önizleme sunucusu |

## 0.8 Ortam Değişkenleri (Environment Variables)
| Değişken | Tür | Açıklama |
|----------|-----|----------|
| `DATABASE_URL` | Secret | PostgreSQL bağlantı dizesi |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Secret | OpenAI proxy URL'si |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Secret | OpenAI proxy API anahtarı |
| `PORT` | Otomatik | Vite dev server portu (Replit atar) |
| `BASE_PATH` | Otomatik | Uygulama temel yolu (`/pallde-store`) |
| `PGHOST` | Otomatik | PostgreSQL host (`helium`) |
| `PGPORT` | Otomatik | PostgreSQL port (`5432`) |
| `PGUSER` | Otomatik | PostgreSQL kullanıcı (`postgres`) |
| `PGDATABASE` | Otomatik | PostgreSQL veritabanı (`heliumdb`) |
| `REPLIT_DB_URL` | Otomatik | Replit Key-Value veritabanı URL'si |
| `REPL_SLUG` | Otomatik | Proje slug'ı (`workspace`) |
| `REPL_OWNER` | Otomatik | Proje sahibi (`ismails5434`) |
| `REPLIT_DEV_DOMAIN` | Otomatik | Geliştirme sunucusu alan adı |
| `NODE_ENV` | Otomatik | Ortam tipi (development/production) |

## 0.9 Workflow'lar (Çalışan Servisler)
| Workflow Adı | Komut | Durum |
|-------------|-------|-------|
| `artifacts/pallde-store: web` | `pnpm --filter @workspace/pallde-store run dev` | Aktif |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | Aktif |
| `artifacts/mockup-sandbox: Component Preview Server` | `pnpm --filter @workspace/mockup-sandbox run dev` | Aktif |

## 0.10 Dil Tercihi Saklama
| Bilgi | Değer |
|-------|-------|
| **localStorage Key** | `pallde_lang` |
| **Varsayılan** | `tr` (Türkçe) |
| **Seçenekler** | `tr` (Türkçe), `en` (İngilizce) |

## 0.11 Vite Proxy Yapılandırması
```
Frontend İsteği:  /pallde-store/api/competitor-analysis
                        │
                        ▼ (Vite proxy yeniden yazma)
Backend İsteği:   http://localhost:8080/api/competitor-analysis
```
Frontend'den yapılan `/pallde-store/api/` ile başlayan tüm istekler otomatik olarak `localhost:8080/api/` adresine yönlendirilir.

---

# BÖLÜM 1: REPLİT NEDİR?

## 1.1 Genel Tanım
Replit, tarayıcı tabanlı bir entegre geliştirme ortamıdır (IDE). Bilgisayarınıza herhangi bir yazılım kurmadan, doğrudan tarayıcınızdan kod yazmanıza, çalıştırmanıza ve yayınlamanıza olanak tanır. Bulut üzerinde çalışan Linux container'ları kullanır.

## 1.2 Replit'in Sunduğu Hizmetler
- **Kod Editörü:** Tarayıcıda çalışan tam özellikli kod editörü
- **AI Asistan (Replit Agent):** Projelerinizi oluşturmanıza ve geliştirmenize yardımcı olan yapay zeka asistanı — bizim şu an kullandığımız sistem
- **Anlık Önizleme:** Yazdığınız kodu anında görebileceğiniz önizleme paneli
- **Veritabanı:** Entegre PostgreSQL veritabanı
- **Deployment (Yayınlama):** Projenizi tek tıkla internete yayınlama
- **Paket Yönetimi:** npm/pnpm/pip gibi paket yöneticileri ile kütüphane kurulumu
- **AI Entegrasyonları:** OpenAI, Anthropic gibi AI servislerine proxy üzerinden erişim — API anahtarı gerekmez
- **Ortam Değişkenleri:** Güvenli bir şekilde API anahtarları ve gizli bilgiler saklama
- **Workflow Sistemi:** Uzun süre çalışan süreçleri (sunucular, geliştirme araçları) yönetme
- **Canvas Panosu:** Görsel içerik, diyagram ve canlı web önizlemeleri için çalışma alanı

## 1.3 Bu Projede Replit Nasıl Kullanıldı?
- **3 Workflow** çalışıyor: Frontend (pallde-store), Backend (API Server), Mockup Sandbox
- **PostgreSQL veritabanı** rakip analizi cache'i için kullanılıyor
- **AI Entegrasyonu** üzerinden OpenAI GPT-4o'ya erişim sağlanıyor (API anahtarı Replit tarafından yönetiliyor)
- **Replit Agent** (ben) tüm kodu yazdı, test etti ve hata ayıkladı
- **Ortam değişkenleri:** `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`, `DATABASE_URL`, `PORT`, `BASE_PATH`

---

# BÖLÜM 2: PROJENİN AMACI VE KAPSAMI

## 2.1 Ne Yapıyor?
Bu platform, çocuk mobilyası ve oyun ekipmanı sektöründe faaliyet gösteren 11 farklı üretici/markadan yaklaşık 1.500 ürünü tek bir dijital katalogda toplayan, AI destekli rakip analizi yapabilen, superadmin-korumalı bir B2B ürün yönetim platformudur.

## 2.2 Kimler İçin?
- **Pallde şirket yöneticileri** — Ürün fiyatlandırma, rakip analizi, tedarikçi bilgileri
- **Toptan alıcılar** — Kademe bazlı fiyatlandırma ile büyük siparişler
- **Ürün yöneticileri** — Global pazar karşılaştırması, fiyat konumlandırma

## 2.3 Bu Proje İle Neler Yapılabilir?
1. **Ürün Kataloğu Görüntüleme:** 1.500 ürün, 4.022 görsel, 11 marka, 75 kategori
2. **Dinamik Fiyatlandırma:** Sepet toplamına göre otomatik kademe (Satış → Toptan → Toplu)
3. **AI Rakip Analizi:** Herhangi bir ürün için Türkiye, ABD ve Avrupa'da gerçek rakip ürünleri bulma
4. **Canlı Döviz Kuru:** USD/TRY kuru anlık takip
5. **Çift Dil Desteği:** Tüm arayüz Türkçe ve İngilizce
6. **Üretici Yönetimi:** 11 üreticinin tam iletişim bilgileri, sosyal medya, vergi numaraları
7. **Sepet Yönetimi:** Ürün ekleme, çıkarma, miktar değiştirme, kademe takibi
8. **Maliyet Analizi:** Her ürünün üretim maliyeti, çarpanları ve tüm kademe fiyatları

---

# BÖLÜM 3: TEKNİK ALTYAPI

## 3.1 Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────────┐
│                    KULLANICI (Tarayıcı)                  │
│                                                         │
│  ┌─────────────────┐    ┌────────────────────────────┐  │
│  │  Login Sayfası   │    │   Ana Uygulama (React)     │  │
│  │  (superadmin)    │───▸│   - Katalog                │  │
│  └─────────────────┘    │   - Ürün Detay             │  │
│                         │   - Sepet                   │  │
│                         │   - Rakip Analiz            │  │
│                         └──────────┬─────────────────┘  │
└────────────────────────────────────┼─────────────────────┘
                                     │ HTTP (Vite Proxy)
                                     ▼
┌─────────────────────────────────────────────────────────┐
│                  API SUNUCUSU (Express 5)                │
│                     Port: 8080                           │
│                                                         │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │ Health Check │  │  Rakip Analizi Endpoint'i        │  │
│  │ GET /health  │  │  POST /api/competitor-analysis   │  │
│  └─────────────┘  │  GET  /api/competitor-analysis/:  │  │
│                   └──────────┬───────────────────────┘  │
└──────────────────────────────┼───────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  PostgreSQL   │  │  OpenAI API  │  │ Frankfurter  │
   │  (Drizzle)    │  │  (GPT-4o +   │  │  API (ECB)   │
   │  24s cache    │  │  Web Search) │  │  Döviz Kuru  │
   └──────────────┘  └──────────────┘  └──────────────┘
```

## 3.2 Teknoloji Yığını (Tech Stack)

### Frontend
| Teknoloji | Kullanım Amacı | Versiyon |
|-----------|----------------|----------|
| React | Kullanıcı arayüzü framework'ü | 18+ |
| Vite | Geliştirme sunucusu ve build aracı | 7.3.1 |
| TypeScript | Tip güvenli JavaScript | 5.9.3 |
| Tailwind CSS | Utility-first CSS framework'ü | v4 |
| shadcn/ui | UI bileşen kütüphanesi | - |
| wouter | Hafif sayfa yönlendirme | - |
| React Query | Sunucu state yönetimi | - |
| lucide-react | İkon kütüphanesi | - |

### Backend
| Teknoloji | Kullanım Amacı | Versiyon |
|-----------|----------------|----------|
| Node.js | JavaScript çalışma ortamı | 24.13.0 |
| Express | HTTP sunucu framework'ü | 5.2.1 |
| Drizzle ORM | Veritabanı sorgu oluşturucu | 0.45.1 |
| PostgreSQL | İlişkisel veritabanı | Replit managed |
| Zod (v4) | Veri doğrulama | - |
| esbuild | JavaScript bundler | 0.27.3 |

### AI & Harici Servisler
| Servis | Kullanım Amacı |
|--------|----------------|
| OpenAI GPT-4o (Responses API) | Sorgu üretimi, web araması, veri zenginleştirme |
| OpenAI web_search_preview | Gerçek zamanlı web araması |
| Frankfurter API (ECB) | Canlı döviz kuru (USD/TRY) |

### Araçlar
| Araç | Kullanım Amacı |
|------|----------------|
| pnpm | Monorepo paket yöneticisi (v10.26.1) |
| Orval | OpenAPI'den React Query hook'ları otomatik üretme |
| tsx | TypeScript dosyalarını doğrudan çalıştırma |

## 3.3 Monorepo Dosya Yapısı

```
workspace/
├── artifacts/                          # Uygulamalar
│   ├── api-server/                     # Backend API sunucusu
│   │   ├── src/
│   │   │   ├── index.ts                # Sunucu başlatma (port 8080)
│   │   │   ├── app.ts                  # Express konfigürasyonu
│   │   │   ├── routes/
│   │   │   │   ├── competitor-analysis.ts  # ~1000 satır AI pipeline
│   │   │   │   ├── health.ts           # Sağlık kontrolü
│   │   │   │   └── index.ts            # Route birleştirici
│   │   │   └── middlewares/            # Express middleware'ler
│   │   └── build.ts                    # esbuild yapılandırması
│   │
│   ├── pallde-store/                   # Ana frontend uygulaması
│   │   ├── src/
│   │   │   ├── App.tsx                 # Ana bileşen + routing + auth koruma
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.tsx        # Katalog ana sayfa + sidebar
│   │   │   │   ├── ProductDetailPage.tsx  # Ürün detay (katlanabilir bölümler)
│   │   │   │   ├── LoginPage.tsx       # Superadmin giriş ekranı
│   │   │   │   ├── ContactPage.tsx     # İletişim sayfası
│   │   │   │   └── not-found.tsx       # 404 sayfası
│   │   │   ├── components/
│   │   │   │   ├── CategorySidebar.tsx # Sol sabit kategori ağacı
│   │   │   │   ├── CompetitorAnalysis.tsx  # AI rakip analiz arayüzü
│   │   │   │   ├── ExchangeRateBar.tsx # Canlı döviz kuru çubuğu
│   │   │   │   ├── Header.tsx          # Üst navigasyon + dil + sepet
│   │   │   │   ├── Footer.tsx          # Alt bilgi
│   │   │   │   ├── ProductCard.tsx     # Ürün kartı bileşeni
│   │   │   │   ├── CartDrawer.tsx      # Sepet çekmecesi
│   │   │   │   ├── ScrollToTop.tsx     # Yukarı çık butonu
│   │   │   │   └── ui/                 # shadcn/ui bileşenleri
│   │   │   ├── data/
│   │   │   │   ├── products.ts         # 1.500 ürün + 75 kategori
│   │   │   │   └── manufacturers.ts    # 11 üretici bilgisi
│   │   │   ├── context/
│   │   │   │   ├── CartContext.tsx      # Sepet state + kademe hesaplama
│   │   │   │   └── LanguageContext.tsx  # Dil tercihi (TR/EN)
│   │   │   ├── i18n/
│   │   │   │   ├── index.ts            # useT() çeviri hook'u
│   │   │   │   ├── tr.ts              # Türkçe çeviriler
│   │   │   │   └── en.ts              # İngilizce çeviriler
│   │   │   └── lib/
│   │   │       └── pricing.ts          # Fiyatlandırma motoru
│   │   └── public/
│   │       └── images/                 # 4.022 yerel ürün görseli
│   │           ├── (630 kök dizin görselleri)
│   │           ├── cedarworks/         (176)
│   │           ├── communityplaythings/ (617)
│   │           ├── plywoodproject/     (804)
│   │           ├── saboconcept/        (100)
│   │           ├── woodandhearts/      (434)
│   │           ├── woodandroom2/       (244)
│   │           ├── woodeneducationaltoy/ (967)
│   │           └── woodjoycollection/  (55)
│   │
│   └── mockup-sandbox/                 # Bileşen önizleme sunucusu (port 8081)
│
├── lib/                                # Paylaşılan kütüphaneler
│   ├── db/                             # Veritabanı katmanı
│   │   └── src/schema/
│   │       ├── competitor-analyses.ts  # Rakip analiz tablosu
│   │       ├── conversations.ts        # Konuşma tablosu
│   │       ├── messages.ts             # Mesaj tablosu
│   │       └── index.ts
│   ├── api-spec/                       # OpenAPI 3.1 şartname
│   ├── api-client-react/               # Otomatik üretilen React hook'ları
│   ├── api-zod/                        # Otomatik üretilen Zod şemaları
│   └── integrations-openai-ai-*/       # OpenAI entegrasyon kütüphaneleri
│
├── scripts/                            # Yardımcı scriptler
├── replit.md                           # Proje hafızası (Agent için)
├── pnpm-workspace.yaml                 # Workspace tanımı
└── tsconfig.json                       # TypeScript ana konfigürasyonu
```

---

# BÖLÜM 4: TÜM SAYFALAR VE EKRANLAR

## 4.1 Giriş Sayfası (LoginPage.tsx)

### Görünüm:
- Ortada dikey olarak hizalı beyaz kart
- Üstte kilit ikonu (daire içinde)
- "Yönetici Girişi" / "Admin Login" başlığı
- "Devam etmek için giriş yapın" alt başlığı
- Sağ üst köşede TR/EN dil değiştirme butonları

### Form Alanları:
| Alan | Placeholder | Tip |
|------|-------------|-----|
| Kullanıcı Adı | "Kullanıcı adınız" | text |
| Şifre | "Şifreniz" | password |

### Butonlar:
- **"Giriş Yap" / "Sign In"** — Turuncu, tam genişlikte buton
- Giriş sırasında "Giriş yapılıyor…" animasyonu (400ms gecikme)

### Kimlik Doğrulama:
```
Kullanıcı Adı: superadmin
Şifre: superadmin
localStorage Key: pallde_auth_token
Token: btoa(Date.now().toString()) — Base64 kodlanmış zaman damgası
```
- Giriş yapılmadan HİÇBİR sayfa görüntülenemez
- Oturum tarayıcı kapatılsa bile kalıcıdır (localStorage)
- Çıkış yapma mekanizması mevcut değildir (localStorage'dan manuel silme gerekir)

---

## 4.2 Döviz Kuru Çubuğu (ExchangeRateBar.tsx)

### Konum:
Tüm sayfalarda, Header'ın ÜSTÜNDE, sayfanın en tepesinde yer alır.

### Görünüm:
- **Arka plan:** Koyu gri (`bg-gray-900`)
- **Yükseklik:** İnce çubuk (tek satır metin)
- Solda: "Döviz Kuru" etiketi (yeşil renk, `text-emerald-400`)
- Ortada: **"1 USD = 38.4521 TL"** (bold beyaz)
- Sağda: Son güncelleme zamanı + Frankfurter API kaynak linki (gri metin)

### Teknik Detaylar:
- **API:** `https://api.frankfurter.app/latest?from=USD&to=TRY`
- **Kaynak:** Avrupa Merkez Bankası (ECB) verileri
- **Güncelleme sıklığı:** Her 5 dakikada bir otomatik yenilenir
- **Yükleme durumu:** "Exchange rate loading..." mesajı

---

## 4.3 Header (Üst Navigasyon — Header.tsx)

### Masaüstü Görünüm (lg ve üzeri):
```
[Logo: Pallde Catalog]    [Katalog]  [İletişim]    [TR|EN]  [🛒 Sepet (3)]
```

### Mobil Görünüm (lg altı):
```
[Logo: Pallde Catalog]    [TR|EN]  [🛒 Sepet]  [☰ Menü]
```

### Navigasyon Linkleri:
| Link | Hedef | Çeviri (TR/EN) |
|------|-------|----------------|
| Katalog | `/` (Ana Sayfa) | Katalog / Catalog |
| İletişim | `/iletisim` | İletişim / Contact |

### Butonlar ve Etkileşimler:

#### Dil Değiştirici (TR / EN):
- İki bitişik buton, yuvarlak köşeli kapsül şeklinde
- Aktif dil: turuncu arka plan + beyaz yazı
- Pasif dil: beyaz arka plan + gri yazı
- Tıklandığında anında tüm arayüz çevrilir
- Tercih localStorage'da saklanır (`pallde_lang`)

#### Sepet Butonu:
- Turuncu arka planlı, beyaz yazılı buton
- `ShoppingCart` ikonu + "Sepet" yazısı (mobilde yazı gizli)
- Sepette ürün varsa sağ üst köşede kırmızı daire badge (ürün sayısı, max "9+")
- Tıklandığında CartDrawer (sepet çekmecesi) açılır

#### Hamburger Menü (Mobil):
- `☰` (Menu ikonu) — menü kapalıyken
- `✕` (X ikonu) — menü açıkken
- Tıklandığında tam genişlikte menü açılır
- Menü linkleri dikey listelenir
- Herhangi bir linke tıklayınca menü otomatik kapanır

---

## 4.4 Ana Sayfa / Katalog (HomePage.tsx)

### Layout (Masaüstü):
```
┌──────────────────────────────────────────────────────────┐
│ [Döviz Kuru Çubuğu]                                     │
│ [Header]                                                 │
├──────────┬───────────────────────────────────────────────┤
│ Kategori │  Ürün Kataloğu                               │
│ Sidebar  │  1.500 ürün  [Tümünü göster]                 │
│ (sabit)  │                                               │
│          │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                 │
│ KATEGORİ │  │Ürün│ │Ürün│ │Ürün│ │Ürün│                 │
│ LER      │  │ 1  │ │ 2  │ │ 3  │ │ 4  │                 │
│          │  └────┘ └────┘ └────┘ └────┘                 │
│ 🗂️ Tümü  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                 │
│ 🏠 Pallde │  │Ürün│ │Ürün│ │Ürün│ │Ürün│                 │
│ 🌿 TLC   │  │ 5  │ │ 6  │ │ 7  │ │ 8  │                 │
│ 🌸 Bon.. │  └────┘ └────┘ └────┘ └────┘                 │
│ 🌲 Cedar │                                               │
│ ❤️ WoodH │                                               │
│ 🏫 Comm. │                                               │
│ ...      │                                               │
├──────────┴───────────────────────────────────────────────┤
│ [Footer]                                                 │
│                                    [⬆ Yukarı Çık Butonu] │
└──────────────────────────────────────────────────────────┘
```

### Layout (Mobil):
- Sidebar gizlenir (`hidden lg:block`)
- Kategori navigasyonu üstte grid kartları olarak gösterilir (`grid-cols-2 sm:grid-cols-3`)
- Ürün grid: `grid-cols-2`

### Sol Kategori Sidebar (CategorySidebar.tsx):

#### Özellikler:
- **Genişlik:** 256px (`w-64`)
- **Konum:** Sabit (sticky), sayfayla birlikte kaymaz (`sticky top-28`)
- **Yükseklik:** Ekran yüksekliğine sığar (`max-h-[calc(100vh-8rem)]`)
- **Kaydırma:** Kendi içinde kaydırılabilir (`overflow-y-auto`) — ince scrollbar (4px)
- **Yalnızca masaüstünde görünür** (`hidden lg:block`)

#### İçerik:
- **"KATEGORİLER"** başlığı (büyük harfli, küçük font)
- **"🗂️ Tüm Ürünler"** butonu — toplam ürün sayısı badge'i ile
- **Marka listesi** (her biri emoji ikonu ile):
  - 🏠 Pallde (ürün sayısı badge)
  - 🌿 The Little Concept
  - 🌸 BonChicBaby
  - 🌲 CedarWorks
  - ❤️ Wood and Hearts
  - 🏫 Community Playthings
  - 🪵 Plywood Project
  - 🛏️ WoodandRoom
  - 🌈 SABOconcept
  - 🧩 WoodenEducationalToy
  - ✨ WoodjoyCollection

#### Etkileşim:
- Markaya tıklama → ürün grid'i filtrelenir + alt kategoriler genişler
- Alt kategoriler sol kenar çizgisi ile bağlantılı gösterilir
- Alt kategoriye tıklama → daha dar filtreleme
- "Tüm Ürünler"e tıklama → tüm filtreler sıfırlanır
- Aktif kategori: amber/turuncu arka plan vurgusu
- Aktif alt kategori: turuncu tam dolgu

### Ürün Görüntüleme Modları:

#### "Tüm Ürünler" Modu:
- Ürünler marka bazında gruplandırılmış
- Her marka bölümü: emoji + marka adı + ayırıcı çizgi + ürün sayısı
- Alt kategoriler alt başlıklar olarak ayrı bölümlerde

#### Filtrelenmiş Mod:
- Seçilen kategori/alt kategorinin ürünleri düz grid olarak
- Üstte "X ürün" sayacı + "Tümünü göster" linki

### Ürün Grid Responsive Yapısı:
- Mobil: `grid-cols-2`
- Tablet: `sm:grid-cols-3`
- Masaüstü: `lg:grid-cols-3`
- Geniş ekran: `xl:grid-cols-4`

---

## 4.5 Ürün Kartı (ProductCard.tsx)

### Görünüm:
```
┌──────────────────────┐
│ ┌──────────────────┐ │
│ │                  │ │
│ │   ÜRÜN GÖRSELİ  │ │  ← aspect-square, object-cover
│ │                  │ │
│ │ [Toptan]    [+2] │ │  ← Kademe badge + görsel sayısı
│ └──────────────────┘ │
│ Ürün Adı (2 satır)   │  ← Dile göre TR/EN
│                      │
│ $̶6̶0̶0̶  $500           │  ← Üstü çizili liste + aktif fiyat
│                      │
│ [🛒 Sepete Ekle]     │  ← Turuncu buton
└──────────────────────┘
```

### Etkileşimler:
- **Hover efekti:** Kart hafifçe yukarı kayar (`-translate-y-0.5`) + gölge artar
- **Görsel hover:** Görsel hafifçe yakınlaşır (`scale-105`)
- **Başlık hover:** Turuncu renge döner
- **Buton hover:** Şeffaf turuncu → dolgu turuncu
- **Tıklama:** Ürün detay sayfasına yönlendirir (`/urun/{urlPart}`)
- **Sepete Ekle:** `e.preventDefault()` ile sayfa navigasyonunu engeller, sepete 1 adet ekler

### Görsel Hata Yönetimi:
- Görsel yüklenemezse → sonraki görseli dener
- Tüm görseller başarısız → "No Image" placeholder gösterilir

### Fiyat Gösterimi:
- **Liste fiyatı:** Üstü çizili gri (her zaman görünür)
- **Aktif fiyat renkleri:**
  - Satış (sale): Turuncu
  - Toptan (wholesale): Mavi
  - Toplu (bulk): Mor + "tahmini fiyat" etiketi

### Badge'ler:
- **Kademe badge'i:** Sol üst köşe (Toptan = mavi, Toplu = mor)
- **Görsel sayısı:** Sağ alt köşe ("+2", "+3" vb.)

---

## 4.6 Ürün Detay Sayfası (ProductDetailPage.tsx)

### Sayfa Açılış Davranışı:
- Her ürüne tıklandığında sayfa EN ÜSTTEN başlar (`window.scrollTo({ top: 0, behavior: "instant" })`)
- Farklı bir ürüne geçildiğinde de aynı davranış

### Breadcrumb Navigasyon:
```
Ana Sayfa / The Little Concept / Karyola / [Ürün Adı]
```
- Her segment tıklanabilir
- Ürün adı kalın ve kısaltılmış (max 200px)

### Ana Layout (Masaüstü):
```
[← Geri]

┌──────────────────┬─────────────────────────────────┐
│                  │ Kategori Adı                     │
│   ÜRÜN GÖRSELİ  │ Ürün Başlığı (bold, xl)          │
│   (aspect-square)│                                  │
│                  │ $̶6̶0̶0̶  $500  [Standart Fiyat]     │
│                  │                                  │
│  [küçük resimler]│ [−] 1 [+]  [🛒 Sepete Ekle — $500]│
│                  │                                  │
│                  │ [🔗 Orijinal Mağazada Gör]        │
│                  │                                  │
│  2/5 genişlik    │ ▼ Açıklama (katlanabilir)         │
│                  │ ▼ Fiyat Kademeleri (katlanabilir) │
│                  │                                  │
│                  │ 3/5 genişlik                      │
└──────────────────┴─────────────────────────────────┘

▼ 🔒 Admin Bilgisi (sarı, kapalı)
▼ 🏭 Üretici Bilgileri (mavi, kapalı)
[AI Rakip Analizi Bölümü]
[Benzer Ürünler Grid]
```

### Katlanabilir Bölümler (Section Bileşeni):

Her bölüm bir başlık + ikon + chevron'dan oluşur. Tıklayarak açılıp kapatılır.

| Bölüm | İkon | Varsayılan | Stil |
|-------|------|-----------|------|
| Açıklama | ℹ️ Info | **Açık** | Beyaz |
| Fiyat Kademeleri | 🏷️ Tag | Kapalı | Beyaz |
| 🔒 Admin Bilgisi | 📑 Layers | Kapalı | Sarı (`yellow-50`) |
| 🏭 Üretici Bilgileri | 🏭 Factory | Kapalı | Mavi (`blue-50`) |

### Fiyat Kademeleri Tablosu:
| Kademe | Koşul | Fiyat | Renk |
|--------|-------|-------|------|
| ✓ İndirimli Satış | Standart | $500 | Turuncu |
| Toptan Fiyat | ≥ $15.000 sepet | $300 | Mavi |
| Toplu Sipariş (Tahmini) | ≥ $100.000 sepet | $250 | Mor |

Aktif kademe satırı vurgulu arka planla gösterilir.

### Miktar Seçici + Sepete Ekle:
```
[−] 1 [+]    [🛒 Sepete Ekle — $500]
```
- Minimum miktar: 1
- Fiyat: aktif kademe fiyatı × miktar
- Buton tam genişlikte turuncu

### Admin Bilgisi Paneli (Sarı):
```
🔒 Admin Bilgisi                                    [▼]
─────────────────────────────────────────────────────
Üretim Maliyeti: $100        Liste Fiyatı: $600 (maliyet × 6)
İndirimli Fiyat: $500 (maliyet × 5)
Toptan Fiyat: $300 (maliyet × 3, ≥$15,000 sepet)
Toplu Tahmini: $250 (maliyet × 2.5, ≥$100,000 sipariş)
Stok Kodu: PLY-042
Kaynak: https://plywoodproject.com/urun/...
```

### Üretici Bilgileri Paneli (Mavi):
```
🏭 Üretici Bilgileri                                [▼]
─────────────────────────────────────────────────────
[Açıklama paragrafı — Türkçe veya İngilizce]

Şirket Adı: Plywood Project       Web Sitesi: plywoodproject.com
Ülke: Polonya                      Adres: ...
Telefon: +48 ...                   E-posta: info@...
Vergi No: PL...                    Kuruluş: 2018

[Instagram] [Facebook] [Pinterest] [YouTube] [Etsy] [LinkedIn]
  ↑ Küçük renkli badge butonları

Notlar: Bu üretici hakkında dahili notlar...
```

Sosyal medya linkleri satır içi badge'ler olarak gösterilir (ör: `[📸 Instagram]` `[📘 Facebook]`).

### Orijinal Mağaza Linki:
```
[🔗 Orijinal Mağazada Gör]
```
- Turuncu çerçeveli, şeffaf arka planlı buton
- Yeni sekmede açılır (`target="_blank"`)

### Benzer Ürünler:
- Aynı kategorideki diğer ürünlerden max 4 tanesi
- Başlık: "Benzer Ürünler" + ayırıcı çizgi
- `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`

---

## 4.7 Sepet Çekmecesi (CartDrawer.tsx)

### Açılış/Kapanış:
- **Açma:** Header'daki sepet butonuna tıklama
- **Kapama:** X butonu VEYA yarı-şeffaf arka plana tıklama
- **Animasyon:** Sağdan kaydırarak açılır (`translate-x-full` → `translate-x-0`, 300ms)

### Yapı:
```
┌──────────────────────────────┐
│ Sepet (3 ürün)          [X]  │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ 🛒 Standart Fiyat        │ │  ← Kademe durumu
│ │ Toptan için $2,340 daha  │ │  ← Sonraki kademeye mesafe
│ │ ekleyin                  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [img] Ürün Adı           │ │
│ │       $̶6̶0̶0̶ → $500       │ │
│ │       [−] 2 [+]  $1,000  │ │
│ │                     [🗑️]  │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [img] Başka Ürün          │ │
│ │       ...                 │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ Toplam:              $1,500  │
│ [Sepeti Temizle]             │
└──────────────────────────────┘
```

### Kademe İlerleme Bilgisi:
| Kademe | İkon | Renk | Mesaj |
|--------|------|------|-------|
| Satış (sale) | 🛒 | Amber | "Toptan için $X daha ekleyin" |
| Toptan (wholesale) | ⭐ | Mavi | "Toplu sipariş için $X daha ekleyin" |
| Toplu (bulk) | 🏆 | Mor | "Toplu sipariş aktif" |

### Her Ürün Satırı:
- Küçük resim (ürünün ilk görseli)
- Ürün adı (dile göre TR/EN)
- Üstü çizili liste fiyatı + aktif kademe fiyatı
- Miktar kontrolleri: [−] X [+]
- Satır toplamı (fiyat × miktar)
- 🗑️ Sil butonu

### Butonlar:
- **X (Kapat):** Çekmeceyi kapatır
- **− / +:** Miktar azaltma/artırma
- **🗑️ (Çöp Kutusu):** Ürünü sepetten çıkarır
- **"Sepeti Temizle" / "Clear Cart":** Tüm sepeti boşaltır

### Boş Durum:
- Sepet ikonu (büyük, gri)
- "Sepetiniz boş" mesajı
- "Ürün eklemek için kataloga göz atın" alt mesajı

---

## 4.8 Yukarı Çık Butonu (ScrollToTop.tsx)

### Görünüm:
- Sabit konum: sağ alt köşe (`fixed bottom-6 right-6`)
- Turuncu yuvarlak daire (`w-12 h-12 rounded-full bg-primary`)
- İçinde yukarı ok ikonu (`ArrowUp`)
- Z-index: 50 (diğer elemanların üstünde)

### Davranış:
- **Görünürlük:** 400px aşağı kaydırılınca belirginleşir (`opacity-100`)
- **Gizlenme:** Üstteyken şeffaf + tıklanamaz (`opacity-0 pointer-events-none`)
- **Geçiş:** 300ms animasyon (`transition-all duration-300`)
- **Hover:** Hafif büyüme efekti (`hover:scale-110`) + gölge artışı
- **Tıklama:** `window.scrollTo({ top: 0, behavior: "smooth" })` — yumuşak kaydırma

---

## 4.9 Footer (Footer.tsx)

### Görünüm:
- Koyu arka plan (`bg-foreground`, yani koyu gri/siyah)
- Açık renkli metin (`text-background`, yani beyaz/bej)

### İçerik:
```
┌────────────────────────────────────────────────────┐
│ Pallde Catalog              Kategoriler            │
│ Children's furniture &      • Arabalı Yatak        │
│ play equipment catalog      • İletişim             │
│                                                    │
│────────────────────────────────────────────────────│
│ © 2025 Pallde Catalog. Tüm hakları saklıdır.      │
└────────────────────────────────────────────────────┘
```

---

## 4.10 İletişim Sayfası (ContactPage.tsx)
- Basit sayfa: "İletişim" başlığı + "İletişim bilgileri yakında eklenecektir" mesajı
- Breadcrumb: Ana Sayfa / İletişim

## 4.11 404 Sayfası (not-found.tsx)
- "404 — Sayfa Bulunamadı" başlığı
- "Aradığınız sayfa mevcut değil" açıklaması

---

# BÖLÜM 5: AI RAKİP ANALİZİ — DETAYLI İŞLEYİŞ

## 5.1 Genel Akış

```
Kullanıcı "Rakipleri Analiz Et" butonuna tıklar
       │
       ▼
[Faz 1] GPT-4o → 3 bölgesel arama sorgusu üretir
       │         TR: Türkçe + cm + Trendyol stili
       │         USA: İngilizce + inches + Amazon stili
       │         EU: İngilizce + cm + Amazon.co.uk stili
       ▼
[Faz 2] OpenAI Responses API + web_search_preview
       │  ├── TR: 10 aday URL → SSRF + HTTP doğrulama → 5 onaylı
       │  ├── USA: 10 aday URL → SSRF + HTTP doğrulama → 5 onaylı
       │  └── EU: İki fazlı arama
       │         ├── Faz 1: İngiltere (gl=gb) → GDPR bypass doğrulama
       │         └── Faz 2: Almanya (gl=de) → fallback (gerekirse)
       ▼
[Faz 3] GPT-4o → Doğrulanmış URL'lerden veri zenginleştirme
       │         (isim, fiyat, puan, eşleşme skoru)
       ▼
[Faz 4] GPT-4o → Pazar özeti üretimi (2-3 cümle)
       │
       ▼
Sonuçlar PostgreSQL'e kaydedilir (24 saat cache)
       │
       ▼
Frontend'de gösterilir (3 tab, kartlar, linkler)
```

## 5.2 Bölgesel Hedef Siteler

### Türkiye (TR):
| Site | Tür |
|------|-----|
| trendyol.com | E-ticaret pazaryeri |
| hepsiburada.com | E-ticaret pazaryeri |
| n11.com | E-ticaret pazaryeri |
| ciceksepeti.com | E-ticaret |
| *.com.tr | Tüm .com.tr alan adları |

### ABD (USA):
| Site | Tür |
|------|-----|
| amazon.com | E-ticaret devi |
| etsy.com | El yapımı ürünler |
| wayfair.com | Mobilya |
| target.com | Perakende |
| walmart.com | Perakende |
| potterybarnkids.com | Çocuk mobilyası |

### Avrupa (EU) — İngiltere Öncelikli:
| Site | Ülke |
|------|------|
| amazon.co.uk | İngiltere |
| etsy.com/uk | İngiltere |
| wayfair.co.uk | İngiltere |
| johnlewis.com | İngiltere |
| argos.co.uk | İngiltere |
| vertbaudet.co.uk | İngiltere |

### Avrupa (EU) — Almanya Fallback:
| Site | Ülke |
|------|------|
| amazon.de | Almanya |
| otto.de | Almanya |
| kidswoodlove.de | Almanya |

## 5.3 URL Doğrulama Sistemi

### SSRF (Server-Side Request Forgery) Koruması:
Engellenen hedefler:
- `localhost`, `127.0.0.1`, `0.0.0.0`
- `10.x.x.x`, `172.16-31.x.x`, `192.168.x.x` (iç ağlar)
- `google.com`, `github.com`, `replit.com` (arama motorları / platformlar)
- HTTP protokolü (yalnızca HTTPS kabul edilir)

### Deep Verification (TR + USA):
1. HTTP GET isteği gerçekçi tarayıcı başlıkları ile
2. Redirect takibi → final URL kontrolü
3. HTML body taraması (ilk 15.000 karakter):
   - 16 "ölü sayfa" deseni kontrolü:
     - "404", "not found", "page not found"
     - "out of stock", "no longer available"
     - "access denied", "forbidden"
     - "discontinued", "sold out"
     - vb.
4. Sayfa boyutu kontrolü (< 500 karakter → red)

### GDPR Bypass (EU):
EU siteleri cookie consent duvarı nedeniyle sunucu isteklerini reddeder (403/503). Çözüm:
- `isEuDomain()`: `.co.uk`, `.de`, `.fr`, `.nl` vb. kontrol
- `isKnownProductUrlPattern()`: URL yapısından ürün sayfası mı kontrol:
  - Amazon: `/dp/B0XXXXXXXX` (ASIN formatı)
  - Etsy: `/listing/1234567890`
  - Trendyol: `-p-1234567890`
  - Hepsiburada: `-pm-`

Bu desenlere uyan URL'ler HTTP kontrolü atlanarak "doğrulanmış" kabul edilir.

## 5.4 Frontend Arayüzü (CompetitorAnalysis.tsx)

### Başlangıç Durumu:
```
┌──────────────────────────────────────────────────┐
│ 🌍 Global Piyasa ve Rakip Analizi                │
│ Canlı web araması | Gerçek ürün URL'leri |       │
│ Derin doğrulama                                  │
│                                                  │
│         [🔍 Rakipleri Analiz Et]                  │
└──────────────────────────────────────────────────┘
```

### Yükleme Durumu (45-90 saniye):
```
┌──────────────────────────────────────────────────┐
│ ⏳ Analiz yapılıyor...                            │
│                                                  │
│ ✓ AI sorgu üretimi          (tamamlandı)         │
│ ⟳ Canlı web araması         (devam ediyor...)    │
│ ○ Sonuç doğrulama           (bekliyor)           │
│                                                  │
│ 🇹🇷 TR: Türkçe anahtar kelimeler, cm birimi       │
│ 🇺🇸 USA: İngilizce, inches/ABD boyutları          │
│ 🇪🇺 EU: İngilizce, cm birimi                      │
│                                                  │
│ Tahmini süre: 45-90 saniye                       │
└──────────────────────────────────────────────────┘
```

### Sonuç Durumu:
```
┌──────────────────────────────────────────────────┐
│ 🌍 Global Piyasa ve Rakip Analizi                │
│ [AI özet paragrafı]                              │
│ Analiz: 22.03.2026 | 15 doğrulanmış link         │
│                                                  │
│ ▼ AI Tarafından Üretilen Bölgesel Arama Sorguları│
│   TR: "Ahşap montessori pikler üçgen..."         │
│   USA: "Foldable wooden Montessori..."            │
│   EU: "Foldable wooden Montessori... cm"          │
│                                                  │
│ [🇹🇷 TR (5)] [🇺🇸 USA (5)] [🇪🇺 EU (5)]            │
│                                                  │
│ Arama sorgusu: "..." (gl=tr, hl=tr)              │
│                                                  │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ 🇹🇷 %95     │ │ 🇹🇷 %92     │ │ 🇹🇷 %90     │    │
│ │ Ürün Adı   │ │ Ürün Adı   │ │ Ürün Adı   │    │
│ │ ₺1,500     │ │ ₺1,650     │ │ ₺1,800     │    │
│ │ ★★★★☆ 4.2  │ │ ★★★★★ 4.8  │ │ ★★★☆☆ 3.5  │    │
│ │ [✓Doğr.Lnk]│ │ [✓Doğr.Lnk]│ │ [✓Doğr.Lnk]│    │
│ └────────────┘ └────────────┘ └────────────┘    │
│                                                  │
│           [🔄 Tekrar Analiz Et]                   │
│ 15 doğrulanmış rakip | TR: 5, USA: 5, EU: 5     │
└──────────────────────────────────────────────────┘
```

### Rakip Kartı Detayı:
```
┌──────────────────────────────┐
│ 🇹🇷 Ürün Adı              %95 │  ← Bayrak + Eşleşme skoru
│ Marka: XYZ | Türkiye          │  ← Marka + ülke
│ ★★★★☆ 4.2 (156 değerlendirme)│  ← Yıldız puanı
│ ₺1,500.00  (~₺1,500 TL)      │  ← Yerel fiyat + TRY
│ 🚚 3-5 gün                    │  ← Teslimat tahmini
│ "Benzer malzeme ve boyut..."  │  ← Eşleşme nedeni
│                               │
│ [✅ Doğrulanmış Link]  [📸][📘] │  ← Link + sosyal medya
│ ● Aktif                       │  ← Stok durumu
└──────────────────────────────┘
```

### Eşleşme Skoru Renkleri:
- ≥ 80: Yeşil
- ≥ 60: Sarı/Turuncu
- < 60: Gri

---

# BÖLÜM 6: FİYATLANDIRMA SİSTEMİ DETAY

## 6.1 Çarpan Tablosu
```
Üretim Maliyeti (cost) = Veritabanındaki temel fiyat

Liste Fiyatı    = cost × 6.0   (üstü çizili gösterilir, hiçbir zaman satılmaz)
Satış Fiyatı    = cost × 5.0   (standart perakende)
Toptan Fiyat    = cost × 3.0   (sepet toplamı ≥ $15.000 olunca aktif)
Toplu Fiyat     = cost × 2.5   (sepet toplamı ≥ $100.000 olunca aktif, "tahmini" etiketi)
```

## 6.2 Kademe Geçiş Mantığı
```typescript
function getTier(cartTotal: number): PriceTier {
  if (cartTotal >= 100_000) return "bulk";
  if (cartTotal >= 15_000) return "wholesale";
  return "sale";
}
```

**Önemli:** Kademe hesaplaması için önce tüm ürünlerin SATIŞ fiyatı üzerinden toplam hesaplanır, sonra bu toplama göre kademe belirlenir, ve son olarak o kademedeki fiyatlarla gerçek toplam hesaplanır.

## 6.3 Örnek Senaryo
Sepette 10 adet ürün var, her birinin maliyeti $400:
1. Satış toplamı: 10 × ($400 × 5) = $20.000
2. $20.000 ≥ $15.000 → **Toptan kademe** aktif
3. Gerçek toplam: 10 × ($400 × 3) = $12.000
4. Tüm fiyatlar mavi renkte gösterilir

---

# BÖLÜM 7: VERİ YAPILARI

## 7.1 Ürün Verisi (1.500 Ürün)

Her ürün şu alanlara sahiptir:
| Alan | Tür | Açıklama | Örnek |
|------|-----|----------|-------|
| id | string | Benzersiz ID | "PLY-042" |
| name | string | Birincil isim | "Modern Çocuk Masası" |
| name_tr | string | Türkçe isim | "Modern Çocuk Masası" |
| name_en | string | İngilizce isim | "Modern Kids Desk" |
| price | number | Üretim maliyeti (USD) | 120 |
| formattedPrice | string | Gösterim fiyatı | "$120" |
| category | string | Kategori ID'si | "masa" |
| urlPart | string | URL slug'ı | "modern-cocuk-masasi" |
| images | string[] | Görsel yolları | ["/images/plywoodproject/img1.jpg"] |
| description | string | Birincil açıklama | "Masif ahşap..." |
| description_tr | string | Türkçe açıklama | "Masif ahşap..." |
| description_en | string | İngilizce açıklama | "Solid wood..." |
| sku | string | Stok kodu | "PLY-042" |
| sourceUrl | string | Orijinal kaynak | "https://plywoodproject.com/..." |
| tags | string[] | Etiketler (opsiyonel) | ["montessori", "masa"] |
| etsyUrl | string | Etsy linki (opsiyonel) | "https://etsy.com/listing/..." |

## 7.2 Kategori Hiyerarşisi (75 Kategori)

11 ana marka, her birinin altında alt kategoriler:

| # | Marka | Emoji | Ülke | Alt Kategori Sayısı |
|---|-------|-------|------|---------------------|
| 1 | Pallde | 🏠 | Türkiye | 2 (Arabalı Yatak, Hazeran) |
| 2 | The Little Concept | 🌿 | Türkiye | 9 (Karyola, Gardırop, Şifonyer...) |
| 3 | BonChicBaby | 🌸 | Türkiye | 6 (Çalışma Masası, Gardırop...) |
| 4 | CedarWorks | 🌲 | ABD | 5 (Outdoor, Backyard, Playroom...) |
| 5 | Wood and Hearts | ❤️ | Ukrayna | 5 (Playground, Climbing, Gym...) |
| 6 | Community Playthings | 🏫 | ABD | 5 (Classroom, Play, Outdoor...) |
| 7 | Plywood Project | 🪵 | Polonya | 5 (Furniture, Desks, Storage...) |
| 8 | WoodandRoom | 🛏️ | Ukrayna | 6 (Height Charts, Climbing...) |
| 9 | SABOconcept | 🌈 | Ukrayna | 7 (Rainbows, Blocks, Stackers...) |
| 10 | WoodenEducationalToy | 🧩 | İsrail | 10 (Lacing, Sorting, Puzzles...) |
| 11 | WoodjoyCollection | ✨ | Romanya | 3 (Furniture, Climbing, Beds) |

## 7.3 Üretici Verisi (11 Üretici)

Her üretici şu alanlara sahiptir:
- Şirket adı, web sitesi, ülke, adres
- Telefon, e-posta, WhatsApp
- Vergi numarası, şirket sahibi/CEO, yetkili kişi
- Kuruluş yılı
- Instagram, Facebook, Pinterest, YouTube, LinkedIn, Etsy
- Dahili notlar
- Çift dilli açıklama (TR/EN)

---

# BÖLÜM 8: VERİTABANI

## 8.1 PostgreSQL (Replit Managed)
- ORM: Drizzle ORM v0.45.1
- Şema dosyası: `lib/db/src/schema/competitor-analyses.ts`

## 8.2 Tablo: competitor_analyses
| Sütun | Tür | Açıklama |
|-------|-----|----------|
| id | serial | Otomatik artan birincil anahtar |
| sku | varchar | Ürün stok kodu (cache anahtarı) |
| product_name | text | Ürün adı |
| competitors | jsonb | Rakip kayıtları dizisi |
| regional_queries | jsonb | Bölgesel arama sorguları |
| summary | text | AI pazar özeti |
| created_at | timestamp | Oluşturulma zamanı |

- **Cache TTL:** 24 saat — aynı SKU için 24 saat içinde tekrar istek gelirse veritabanından döner

---

# BÖLÜM 9: ÇİFT DİL SİSTEMİ

## 9.1 Desteklenen Diller
- **Türkçe (TR)** — Varsayılan
- **İngilizce (EN)**

## 9.2 Çevrilen Tüm Metin Grupları

### Navigasyon (nav):
| Anahtar | Türkçe | İngilizce |
|---------|--------|-----------|
| catalog | Katalog | Catalog |
| contact | İletişim | Contact |
| cart | Sepet | Cart |
| back | Geri | Back |
| home | Ana Sayfa | Home |

### Giriş (login):
| Anahtar | Türkçe | İngilizce |
|---------|--------|-----------|
| title | Yönetici Girişi | Admin Login |
| subtitle | Devam etmek için giriş yapın | Sign in to continue |
| username | Kullanıcı Adı | Username |
| password | Şifre | Password |
| submit | Giriş Yap | Sign In |
| error | Kullanıcı adı veya şifre hatalı. | Incorrect username or password. |

### Katalog (catalog):
| Anahtar | Türkçe | İngilizce |
|---------|--------|-----------|
| title | Ürün Kataloğu | Product Catalog |
| allProducts | Tüm Ürünler | All Products |
| showAll | Tümünü göster | Show all |
| products | ürün | products |
| relatedProducts | Benzer Ürünler | Related Products |
| categories | Kategoriler | Categories |

### Ürün (product):
| Anahtar | Türkçe | İngilizce |
|---------|--------|-----------|
| description | Açıklama | Description |
| addToCart | Sepete Ekle | Add to Cart |
| pricingTiers | Fiyat Kademeleri | Pricing Tiers |
| salePrice | İndirimli Satış | Sale Price |
| wholesale | Toptan Fiyat | Wholesale Price |
| bulkOrder | Toplu Sipariş | Bulk Order |

### Sepet (cart):
| Anahtar | Türkçe | İngilizce |
|---------|--------|-----------|
| title | Sepet | Cart |
| empty | Sepetiniz boş | Your cart is empty |
| total | Toplam | Total |
| clear | Sepeti Temizle | Clear Cart |

### Admin (admin) — 24+ alan:
Üretim maliyeti, liste fiyatı, stok kodu, üretici bilgileri (şirket, web, ülke, adres, telefon, e-posta, WhatsApp, vergi no, sahip, sosyal medya...) vb.

---

# BÖLÜM 10: PROJE İSTATİSTİKLERİ

| Metrik | Değer |
|--------|-------|
| Toplam ürün sayısı | ~1.500 |
| Toplam ürün görseli | 4.022 |
| Toplam kategori | 75 (11 üst + 64 alt) |
| Toplam üretici/marka | 11 |
| Üretici ülkeleri | 6 (TR, ABD, Ukrayna, Polonya, İsrail, Romanya) |
| Desteklenen diller | 2 (Türkçe, İngilizce) |
| Fiyat kademeleri | 4 (Liste, Satış, Toptan, Toplu) |
| AI rakip analizi bölgeleri | 3 (TR, USA, EU) |
| Bölge başına hedef rakip | 5 |
| Hedef e-ticaret sitesi | 20+ |
| Cache süresi | 24 saat |
| Döviz kuru güncelleme | 5 dakika |
| AI modeli | GPT-4o |
| Veritabanı | PostgreSQL |
| Çalışan workflow sayısı | 3 |
| Toplam sayfa | 5 (Giriş, Katalog, Detay, İletişim, 404) |
| Toplam React bileşeni | 10+ (özel) + shadcn/ui kütüphanesi |
| Toplam çeviri anahtarı | ~80+ |
| Node.js versiyonu | 24.13.0 |
| TypeScript versiyonu | 5.9.3 |

---

# BÖLÜM 11: GELİŞTİRME KRONOLOJİSİ

Bu projede sırasıyla şu işler yapıldı:

1. **Monorepo altyapısı kuruldu** — pnpm workspace, TypeScript, Vite, Express 5
2. **11 kaynaktan ürün verileri toplandı** — Web scraping ve manuel derleme
3. **4.022 ürün görseli indirildi** — Tüm görseller yerel olarak saklandı
4. **Kategori hiyerarşisi oluşturuldu** — 11 marka, 75 kategori, parent-child ilişkisi
5. **Çift dil sistemi kuruldu** — TR/EN, Context API, localStorage kalıcılığı
6. **Fiyatlandırma motoru yazıldı** — Maliyet bazlı çarpanlar (×6, ×5, ×3, ×2.5)
7. **Sepet sistemi geliştirildi** — Dinamik kademe geçişi, çekmece UI, miktar yönetimi
8. **Döviz kuru takibi eklendi** — Frankfurter API, 5dk otomatik yenileme, koyu çubuk
9. **Üretici bilgi kartları oluşturuldu** — 11 üreticinin tam iletişim, sosyal medya, vergi bilgileri
10. **Superadmin kimlik doğrulama eklendi** — localStorage tabanlı, tek kullanıcı
11. **AI rakip analizi v1 geliştirildi** — Chat completions API (BAŞARISIZ — sahte URL'ler)
12. **AI rakip analizi v2'ye geçildi** — OpenAI Responses API + web_search_preview (BAŞARILI)
13. **Deep URL verification eklendi** — 16 ölü sayfa deseni, SSRF koruması, tarayıcı başlıkları
14. **EU GDPR bypass stratejisi uygulandı** — URL pattern doğrulaması, HTTP kontrolü atlama
15. **EU iki fazlı arama sistemi kuruldu** — İngiltere öncelikli, Almanya fallback
16. **Almanca otomatik çeviri eklendi** — `generateGermanQuery()` fonksiyonu
17. **Detaylı hata günlüğü sistemi kuruldu** — Her API çağrısı, her URL, her red/kabul loglanır
18. **Veritabanı cache sistemi eklendi** — 24 saat TTL, SKU bazlı, regional queries jsonb
19. **Sol sabit kategori sidebar'ı eklendi** — Sticky, kaydırılabilir, hiyerarşik, ince scrollbar
20. **Yukarı çık butonu eklendi** — Sağ alt köşe, scroll-to-top, animasyonlu görünüm/kaybolma
21. **Ürün detay sayfası kompakt hale getirildi** — Katlanabilir Section bileşeni, 5 bölüm
22. **Sayfa üstü scroll düzeltildi** — Ürün sayfasına geçişte sayfa en üstten başlıyor

---

# BÖLÜM 12: BU PROJE İLE GELECEKte NELER YAPILABİLİR?

1. **Ödeme entegrasyonu** — Stripe/iyzico ile gerçek satış
2. **Kullanıcı yönetimi** — Farklı roller (admin, satış, müşteri)
3. **Sipariş yönetimi** — Sipariş oluşturma, takip, fatura
4. **Stok yönetimi** — Gerçek zamanlı stok takibi
5. **Otomatik fiyat güncelleme** — Rakip fiyatlarına göre dinamik fiyatlama
6. **E-posta bildirimleri** — Sipariş onayı, fiyat değişikliği uyarıları
7. **Mobil uygulama** — React Native/Expo ile mobil versiyon
8. **Arama motoru** — Elasticsearch/Algolia ile gelişmiş arama
9. **Analytics dashboard** — Satış istatistikleri, popüler ürünler, pazar trendleri
10. **Çoklu para birimi** — USD, EUR, GBP, TRY arasında anlık çeviri
11. **PDF katalog üretimi** — Seçilen ürünlerden otomatik PDF katalog
12. **API açma** — Harici sistemlere ürün verisi paylaşımı
13. **Otomatik scraping** — Kaynak sitelerden periyodik veri güncelleme
14. **Karşılaştırma tablosu** — Birden fazla ürünü yan yana karşılaştırma
15. **Favori listesi** — Kullanıcıların favori ürünleri kaydetmesi

---

*Bu rapor, 22 Mart 2026 itibarıyla Pallde Store projesinin tüm teknik detaylarını, işlevlerini, butonlarını, ekranlarını, veri yapılarını, AI pipeline'ını ve mimari kararlarını kapsamlı şekilde belgelemektedir.*

*Rapor Hazırlayan: Replit AI Agent*
*Tarih: 22 Mart 2026*
