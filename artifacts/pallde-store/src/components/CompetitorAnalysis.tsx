import { useState, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import {
  Search, Globe, ExternalLink, Loader2, TrendingUp,
  MapPin, Truck, BarChart3, Star, CheckCircle2, AlertCircle,
  RefreshCw, ShieldCheck, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react";

interface RegionalQuery {
  region: "TR" | "USA" | "EU";
  query: string;
  gl: string;
  hl: string;
  measurementUnit: "cm" | "inches";
  reasoning: string;
}

interface RegionalQueries {
  TR: RegionalQuery;
  USA: RegionalQuery;
  EU: RegionalQuery;
}

interface CompetitorProduct {
  name: string;
  brand: string;
  region: "TR" | "USA" | "EU";
  country: string;
  priceLocal: string;
  priceTRY: string;
  currency: string;
  productUrl: string;
  deliveryEstimate: string;
  socialMedia: { platform: string; url: string }[];
  matchScore: number;
  matchReason: string;
  rating: number;
  reviewCount: number;
  stockStatus: "in_stock" | "low_stock" | "unknown";
  urlVerified: boolean;
  lastChecked: string;
}

interface AnalysisResult {
  productSummary: string;
  regionalQueries?: RegionalQueries;
  competitors: CompetitorProduct[];
  analysisDate: string;
  fromCache: boolean;
}

interface Props {
  productName: string;
  productDescription: string;
  productImage: string;
  productPrice: number;
  productCategory: string;
  sku: string;
}

const FLAG: Record<string, string> = { TR: "\u{1F1F9}\u{1F1F7}", USA: "\u{1F1FA}\u{1F1F8}", EU: "\u{1F1EA}\u{1F1FA}" };
const REGION_LABEL_TR: Record<string, string> = { TR: "Türkiye", USA: "Amerika (USA)", EU: "Avrupa (EU)" };
const REGION_LABEL_EN: Record<string, string> = { TR: "Turkey", USA: "United States", EU: "Europe" };

const TAB_COLORS: Record<string, { active: string; inactive: string; border: string }> = {
  TR: { active: "bg-red-600 text-white", inactive: "bg-white text-red-700 hover:bg-red-50", border: "border-red-600" },
  USA: { active: "bg-blue-600 text-white", inactive: "bg-white text-blue-700 hover:bg-blue-50", border: "border-blue-600" },
  EU: { active: "bg-amber-600 text-white", inactive: "bg-white text-amber-700 hover:bg-amber-50", border: "border-amber-600" },
};

const CARD_BORDER: Record<string, string> = {
  TR: "border-l-red-500",
  USA: "border-l-blue-500",
  EU: "border-l-amber-500",
};

const QUERY_BG: Record<string, string> = {
  TR: "bg-red-50 border-red-200",
  USA: "bg-blue-50 border-blue-200",
  EU: "bg-amber-50 border-amber-200",
};

const QUERY_ICON_COLOR: Record<string, string> = {
  TR: "text-red-500",
  USA: "text-blue-500",
  EU: "text-amber-500",
};

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < full ? "text-yellow-400 fill-yellow-400" : i === full && half ? "text-yellow-400 fill-yellow-400/50" : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

function StockBadge({ status, verified, lang }: { status: string; verified: boolean; lang: string }) {
  if (status === "in_stock" && verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-300">
        <CheckCircle2 className="w-3 h-3" />
        {lang === "en" ? "Active" : "Aktif Satışta"}
      </span>
    );
  }
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-300">
        <AlertCircle className="w-3 h-3" />
        {lang === "en" ? "Unverified" : "Doğrulanmadı"}
      </span>
    );
  }
  return null;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-800 border-green-300"
    : score >= 60 ? "bg-yellow-100 text-yellow-800 border-yellow-300"
    : "bg-gray-100 text-gray-700 border-gray-300";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      <BarChart3 className="w-3 h-3" />
      %{score}
    </span>
  );
}

function RegionalQueryCard({ query, lang }: { query: RegionalQuery; lang: string }) {
  return (
    <div className={`rounded-lg border p-3 ${QUERY_BG[query.region]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">{FLAG[query.region]}</span>
        <span className="font-bold text-xs text-gray-700">{query.region}</span>
        <span className="text-[10px] text-gray-400 font-mono">gl={query.gl} hl={query.hl}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${query.measurementUnit === "inches" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
          {query.measurementUnit}
        </span>
      </div>
      <div className="flex items-start gap-2">
        <Search className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${QUERY_ICON_COLOR[query.region]}`} />
        <p className="text-sm font-semibold text-gray-900 leading-snug">{query.query}</p>
      </div>
      <p className="text-[11px] text-gray-500 mt-1.5 italic">{query.reasoning}</p>
    </div>
  );
}

function CompetitorCard({ c, lang }: { c: CompetitorProduct; lang: string }) {
  return (
    <div className={`border-l-4 ${CARD_BORDER[c.region]} rounded-lg shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{FLAG[c.region]}</span>
              <h4 className="font-bold text-sm text-gray-900 line-clamp-2">{c.name}</h4>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {c.brand} — {c.country}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <ScoreBadge score={c.matchScore} />
            <StockBadge status={c.stockStatus} verified={c.urlVerified} lang={lang} />
          </div>
        </div>

        <StarRating rating={c.rating} reviewCount={c.reviewCount} />

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">
              {lang === "en" ? "Price" : "Fiyat"}
            </div>
            <div className="text-sm font-bold text-gray-900">{c.priceLocal}</div>
            <div className="text-[11px] text-gray-500">{"\u2248"} {c.priceTRY}</div>
          </div>
          <div className="bg-gray-50 rounded-md p-2">
            <div className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {lang === "en" ? "Delivery" : "Teslimat"}
            </div>
            <div className="text-xs font-semibold text-gray-800">{c.deliveryEstimate}</div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2 italic line-clamp-2">&ldquo;{c.matchReason}&rdquo;</p>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <a
            href={c.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-white text-xs font-medium rounded-md transition-colors bg-green-700 hover:bg-green-600"
          >
            <ShieldCheck className="w-3 h-3" />
            {lang === "en" ? "Verified Link" : "Doğrulanmış Link"}
          </a>
          {c.socialMedia?.map((sm) => (
            <a
              key={sm.platform}
              href={sm.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-pink-50 text-pink-600 text-[10px] font-medium rounded-md hover:bg-pink-100 transition-colors border border-pink-200"
            >
              {sm.platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompetitorAnalysis({
  productName,
  productDescription,
  productImage,
  productPrice,
  productCategory,
  sku,
}: Props) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<"queries" | "searching" | "validating">("queries");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"TR" | "USA" | "EU">("TR");
  const [showQueries, setShowQueries] = useState(true);
  const { lang } = useLang();

  const regionLabels = lang === "en" ? REGION_LABEL_EN : REGION_LABEL_TR;

  useEffect(() => {
    let cancelled = false;
    async function checkCache() {
      try {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
        const res = await fetch(`${base}/api/competitor-analysis/${encodeURIComponent(sku)}`);
        if (res.ok && !cancelled) {
          const data: AnalysisResult = await res.json();
          setResult(data);
        }
      } catch {}
    }
    if (sku) checkCache();
    return () => { cancelled = true; };
  }, [sku]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setLoadingStage("queries");

    const stageTimer1 = setTimeout(() => setLoadingStage("searching"), 5000);
    const stageTimer2 = setTimeout(() => setLoadingStage("validating"), 30000);

    try {
      const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
      const res = await fetch(`${base}/api/competitor-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productDescription, productImage, productPrice, productCategory, sku }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Analysis failed");
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setLoading(false);
    }
  }

  const byRegion = (region: "TR" | "USA" | "EU") =>
    (result?.competitors || [])
      .filter((c) => c.region === region && c.urlVerified)
      .sort((a, b) => b.matchScore - a.matchScore);

  const counts = {
    TR: byRegion("TR").length,
    USA: byRegion("USA").length,
    EU: byRegion("EU").length,
  };
  const total = counts.TR + counts.USA + counts.EU;

  const loadingMessages = {
    queries: {
      tr: "Yapay zeka bölgesel arama sorgularını oluşturuyor...",
      en: "AI is generating localized search queries...",
    },
    searching: {
      tr: "Canlı web araması ile gerçek ürün URL'leri bulunuyor...",
      en: "Live web search finding real product URLs...",
    },
    validating: {
      tr: "Bulunan URL'ler derin doğrulamadan geçiriliyor...",
      en: "Deep-validating discovered URLs...",
    },
  };

  return (
    <div className="mt-8 border-2 border-indigo-200 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2.5">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {lang === "en" ? "Global Market & Competitor Analysis" : "Global Piyasa ve Rakip Analizi"}
              </h3>
              <p className="text-indigo-200 text-xs mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {lang === "en"
                  ? "Live web search \u2022 Real product URLs \u2022 Deep verification"
                  : "Canlı web araması \u2022 Gerçek ürün URL'leri \u2022 Derin doğrulama"}
              </p>
            </div>
          </div>
          {!result && !loading && (
            <button
              onClick={runAnalysis}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
            >
              <Search className="w-4 h-4" />
              {lang === "en" ? "Analyze Competitors" : "Rakipleri Analiz Et"}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="px-6 py-16 text-center bg-gradient-to-b from-indigo-50 to-white">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-indigo-700 font-semibold text-base">
            {lang === "en" ? loadingMessages[loadingStage].en : loadingMessages[loadingStage].tr}
          </p>

          <div className="flex items-center justify-center gap-4 mt-5">
            {(["queries", "searching", "validating"] as const).map((stage, i) => {
              const isActive = loadingStage === stage;
              const isPast = (["queries", "searching", "validating"] as const).indexOf(loadingStage) > i;
              const labels = {
                queries: { tr: "Sorgu Oluşturma", en: "Query Generation" },
                searching: { tr: "Aday Ürün Tarama", en: "Candidate Search" },
                validating: { tr: "Derin Doğrulama", en: "Deep Verification" },
              };
              return (
                <div key={stage} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isPast ? "bg-green-500 text-white" : isActive ? "bg-indigo-600 text-white animate-pulse" : "bg-gray-200 text-gray-400"
                  }`}>
                    {isPast ? "\u2713" : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-indigo-700" : isPast ? "text-green-600" : "text-gray-400"}`}>
                    {lang === "en" ? labels[stage].en : labels[stage].tr}
                  </span>
                  {i < 2 && <div className={`w-8 h-0.5 ${isPast ? "bg-green-300" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-indigo-400">
            <span>{FLAG.TR} {lang === "en" ? "TR keywords" : "TR anahtar kelimeler"}</span>
            <span>{FLAG.USA} {lang === "en" ? "US inches/sizes" : "US inç/ölçü"}</span>
            <span>{FLAG.EU} {lang === "en" ? "EU terms (cm)" : "EU terimler (cm)"}</span>
          </div>
          <p className="text-indigo-300 text-xs mt-3">
            {lang === "en"
              ? "Generating queries, live searching e-commerce sites, deep-validating URLs... (45-90 seconds)"
              : "Sorgular oluşturuluyor, e-ticaret siteleri canlı aranıyor, URL'ler doğrulanıyor... (45-90 saniye)"}
          </p>
        </div>
      )}

      {error && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-200">
          <p className="text-red-700 text-sm font-medium">{lang === "en" ? "Error" : "Hata"}: {error}</p>
          <button onClick={runAnalysis} className="mt-2 text-sm text-red-600 underline hover:text-red-800">
            {lang === "en" ? "Try again" : "Tekrar dene"}
          </button>
        </div>
      )}

      {result && (
        <div className="bg-gray-50">
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{result.productSummary}</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400">
                    {lang === "en" ? "Analysis" : "Analiz"}: {new Date(result.analysisDate).toLocaleString(lang === "en" ? "en-US" : "tr-TR")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    {total} {lang === "en" ? "verified links" : "doğrulanmış link"}
                  </span>
                  {result.fromCache && (
                    <span className="text-xs text-indigo-500 font-medium">
                      {lang === "en" ? "From cache (24h)" : "Önbellekten (24 saat)"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {result.regionalQueries && (
            <div className="border-b border-gray-200 bg-white">
              <button
                onClick={() => setShowQueries(!showQueries)}
                className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-bold text-gray-700">
                    {lang === "en" ? "AI-Generated Regional Search Queries" : "Yapay Zeka Bölgesel Arama Sorguları"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                    {lang === "en" ? "Localized" : "Lokalize Edildi"}
                  </span>
                </div>
                {showQueries ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {showQueries && (
                <div className="px-6 pb-4 grid gap-3 sm:grid-cols-3">
                  <RegionalQueryCard query={result.regionalQueries.TR} lang={lang} />
                  <RegionalQueryCard query={result.regionalQueries.USA} lang={lang} />
                  <RegionalQueryCard query={result.regionalQueries.EU} lang={lang} />
                </div>
              )}
            </div>
          )}

          <div className="px-6 pt-4">
            <div className="flex gap-1 border-b border-gray-200">
              {(["TR", "USA", "EU"] as const).map((region) => {
                const isActive = activeTab === region;
                const tc = TAB_COLORS[region];
                const regionQuery = result.regionalQueries?.[region];
                return (
                  <button
                    key={region}
                    onClick={() => setActiveTab(region)}
                    className={`px-4 py-2.5 rounded-t-lg text-sm font-bold transition-colors border-b-2 ${isActive ? `${tc.active} ${tc.border}` : `${tc.inactive} border-transparent`}`}
                    title={regionQuery ? `${lang === "en" ? "Query" : "Sorgu"}: ${regionQuery.query}` : ""}
                  >
                    <span className="mr-1.5">{FLAG[region]}</span>
                    {regionLabels[region]}
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/30" : "bg-gray-200 text-gray-600"}`}>
                      {counts[region]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {result.regionalQueries?.[activeTab] && (
            <div className="px-6 pt-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${QUERY_BG[activeTab]}`}>
                <Search className={`w-3 h-3 ${QUERY_ICON_COLOR[activeTab]}`} />
                <span className="font-medium text-gray-600">
                  {lang === "en" ? "Search query" : "Arama sorgusu"}:
                </span>
                <span className="font-bold text-gray-800">&ldquo;{result.regionalQueries[activeTab].query}&rdquo;</span>
                <span className="text-gray-400 font-mono text-[10px]">
                  gl={result.regionalQueries[activeTab].gl}
                </span>
              </div>
            </div>
          )}

          <div className="px-6 py-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {byRegion(activeTab).map((c, i) => (
                <CompetitorCard key={i} c={c} lang={lang} />
              ))}
            </div>
            {byRegion(activeTab).length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">
                {lang === "en" ? "No competitors found for this region" : "Bu bölge için rakip bulunamadı"}
              </p>
            )}
          </div>

          <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {lang === "en" ? "Total" : "Toplam"}: {total} {lang === "en" ? "verified competitors" : "doğrulanmış rakip"} (TR: {counts.TR}, USA: {counts.USA}, EU: {counts.EU})
            </div>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {lang === "en" ? "Re-analyze" : "Tekrar Analiz Et"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
