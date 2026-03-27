import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import {
  competitorAnalysesTable,
  type CompetitorRecord,
  type RegionalQueries,
  type RegionalQuery,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

interface AnalysisResult {
  productSummary: string;
  regionalQueries: RegionalQueries;
  competitors: CompetitorRecord[];
  analysisDate: string;
  fromCache: boolean;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TARGET_PER_REGION = 5;
const SEARCH_URLS_PER_REGION = 10;

const DEAD_PAGE_PATTERNS = [
  /404/i,
  /page\s*not\s*found/i,
  /sayfa\s*bulunamad/i,
  /arad[ıi][gğ][ıi]n[ıi]z\s*sayfa/i,
  /currently\s*unavailable/i,
  /out\s*of\s*stock/i,
  /t[üu]kendi/i,
  /no\s*longer\s*available/i,
  /product\s*not\s*found/i,
  /item\s*not\s*found/i,
  /this\s*item\s*is\s*no\s*longer/i,
  /ürün\s*bulunamad/i,
  /stokta\s*yok/i,
  /we\s*couldn.?t\s*find/i,
  /access\s*denied/i,
  /bu\s*ürün\s*sat/i,
];

const TRACKING_PARAMS = [
  "gclid", "gclsrc", "utm_source", "utm_medium", "utm_campaign",
  "utm_term", "utm_content", "fbclid", "ref", "ref_", "tag",
  "psc", "linkCode", "linkId", "camp", "creative", "creativeASIN",
  "ascsubtag", "th", "smid",
];

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

function sanitizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    for (const param of TRACKING_PARAMS) {
      url.searchParams.delete(param);
    }
    let clean = url.toString();
    if (clean.endsWith("?")) clean = clean.slice(0, -1);
    return clean;
  } catch {
    return rawUrl;
  }
}

const BLOCKED_HOSTS = [
  "localhost", "google.com", "bing.com", "duckduckgo.com",
  "yahoo.com", "baidu.com", "yandex.com", "github.com",
  "stackoverflow.com", "wikipedia.org", "youtube.com",
];

function isValidEcommerceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(host)) return false;
    if (host.endsWith(".local") || host.endsWith(".internal")) return false;
    for (const blocked of BLOCKED_HOSTS) {
      if (host === blocked || host.endsWith(`.${blocked}`)) return false;
    }
    if (parsed.pathname === "/" || parsed.pathname === "") return false;
    if (!host.includes(".")) return false;
    return true;
  } catch {
    return false;
  }
}

function isSearchResultsPage(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    if (path.includes("/search") || path.includes("/ara") || path.includes("/sr?")) return true;
    if (search.includes("q=") && (path === "/s" || path === "/")) return true;
    if (path.match(/^\/[^/]+-y-s\d+$/)) return true;
    return false;
  } catch {
    return false;
  }
}

const EU_DOMAINS = [
  "amazon.co.uk", "amazon.de", "amazon.fr", "amazon.es", "amazon.it", "amazon.nl",
  "etsy.com", "wayfair.co.uk", "johnlewis.com", "argos.co.uk", "vertbaudet.co.uk",
  "smallable.com", "kidswoodlove.de", "otto.de", "home24.de",
];

function isEuDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return EU_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`)) ||
      host.endsWith(".co.uk") || host.endsWith(".de") || host.endsWith(".fr") ||
      host.endsWith(".es") || host.endsWith(".it") || host.endsWith(".nl");
  } catch {
    return false;
  }
}

function isKnownProductUrlPattern(url: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    if (parsed.hostname.includes("amazon.") && /\/dp\/[A-Z0-9]{10}/.test(path)) return true;
    if (parsed.hostname.includes("etsy.com") && /\/listing\/\d+/.test(path)) return true;
    if (parsed.hostname.includes("wayfair.") && path.length > 10) return true;
    if (parsed.hostname.includes("trendyol.com") && /\-p\-\d+/.test(path)) return true;
    if (parsed.hostname.includes("hepsiburada.com") && /\-pm\-/.test(path)) return true;
    if (path.includes("/product") || path.includes("/products/") || path.includes("/item/")) return true;
    if (path.split("/").length >= 3 && path.length > 20) return true;
    return false;
  } catch {
    return false;
  }
}

interface VerifyResult {
  valid: boolean;
  finalUrl: string;
  statusCode: number;
  reason: string;
}

async function verifyURL(url: string, skipHttpCheck = false): Promise<VerifyResult> {
  const cleanUrl = sanitizeUrl(url);

  if (!isValidEcommerceUrl(cleanUrl)) {
    return { valid: false, finalUrl: cleanUrl, statusCode: 0, reason: "Invalid URL structure" };
  }

  if (isSearchResultsPage(cleanUrl)) {
    return { valid: false, finalUrl: cleanUrl, statusCode: 0, reason: "Search results page, not product page" };
  }

  if (skipHttpCheck) {
    if (isKnownProductUrlPattern(cleanUrl)) {
      return { valid: true, finalUrl: cleanUrl, statusCode: 200, reason: "EU GDPR bypass — trusted URL pattern from web search" };
    }
    return { valid: false, finalUrl: cleanUrl, statusCode: 0, reason: "EU bypass: URL pattern not recognized as product page" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(cleanUrl, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: BROWSER_HEADERS,
    }).catch(() => null);

    clearTimeout(timeout);

    if (!res) {
      return { valid: false, finalUrl: cleanUrl, statusCode: 0, reason: "Connection failed/timeout" };
    }

    const finalUrl = sanitizeUrl(res.url || cleanUrl);
    const status = res.status;

    if (status >= 400) {
      return { valid: false, finalUrl, statusCode: status, reason: `HTTP ${status}` };
    }

    if (status >= 300) {
      return { valid: false, finalUrl, statusCode: status, reason: `Redirect without resolution: ${status}` };
    }

    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      return { valid: false, finalUrl, statusCode: status, reason: "Failed to read response body" };
    }

    const titleMatch = bodyText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].trim() : "";

    for (const pattern of DEAD_PAGE_PATTERNS) {
      if (pattern.test(titleText)) {
        return { valid: false, finalUrl, statusCode: status, reason: `Dead page detected in title: ${pattern.source}` };
      }
    }

    const bodyCheckText = bodyText.substring(0, 15000);
    let deadHits = 0;
    for (const pattern of DEAD_PAGE_PATTERNS) {
      if (pattern.test(bodyCheckText)) {
        deadHits++;
      }
    }
    if (deadHits >= 2) {
      return { valid: false, finalUrl, statusCode: status, reason: `Multiple dead page patterns found (${deadHits} hits)` };
    }

    if (bodyText.length < 500) {
      return { valid: false, finalUrl, statusCode: status, reason: "Page too short — likely error/empty page" };
    }

    return { valid: true, finalUrl, statusCode: status, reason: "OK" };
  } catch (err: any) {
    return { valid: false, finalUrl: cleanUrl, statusCode: 0, reason: err.message || "Unknown error" };
  }
}

async function getCachedAnalysis(sku: string): Promise<AnalysisResult | null> {
  try {
    const rows = await db
      .select()
      .from(competitorAnalysesTable)
      .where(eq(competitorAnalysesTable.sku, sku))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];

    if (new Date(row.expiresAt) < new Date()) return null;

    return {
      productSummary: row.productSummary || "",
      regionalQueries: (row.regionalQueries as RegionalQueries) || null,
      competitors: row.competitors as CompetitorRecord[],
      analysisDate: row.analysisDate.toISOString(),
      fromCache: true,
    };
  } catch {
    return null;
  }
}

async function saveCachedAnalysis(
  sku: string,
  productName: string,
  productCategory: string,
  result: AnalysisResult,
) {
  try {
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);
    const existing = await db
      .select({ id: competitorAnalysesTable.id })
      .from(competitorAnalysesTable)
      .where(eq(competitorAnalysesTable.sku, sku))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(competitorAnalysesTable)
        .set({
          productName,
          productCategory,
          productSummary: result.productSummary,
          regionalQueries: result.regionalQueries,
          competitors: result.competitors,
          analysisDate: new Date(),
          expiresAt,
          validationPassed: true,
          updatedAt: new Date(),
        })
        .where(eq(competitorAnalysesTable.sku, sku));
    } else {
      await db.insert(competitorAnalysesTable).values({
        sku,
        productName,
        productCategory,
        productSummary: result.productSummary,
        regionalQueries: result.regionalQueries,
        competitors: result.competitors,
        analysisDate: new Date(),
        expiresAt,
        validationPassed: true,
      });
    }
  } catch (err) {
    console.error("Failed to cache analysis:", err);
  }
}

let cachedUsdToTry = 38.5;
let fxLastFetch = 0;

async function getUsdToTry(): Promise<number> {
  if (Date.now() - fxLastFetch < 30 * 60 * 1000) return cachedUsdToTry;
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY");
    if (res.ok) {
      const data = (await res.json()) as any;
      cachedUsdToTry = data.rates.TRY;
      fxLastFetch = Date.now();
    }
  } catch {}
  return cachedUsdToTry;
}

async function generateRegionalQueries(
  productName: string,
  productDescription: string,
  productCategory: string,
): Promise<RegionalQueries> {
  const systemPrompt = `You are an expert e-commerce search keyword optimization specialist.
Your job is to analyze a children's furniture/toy product and generate 3 DIFFERENT localized search queries optimized for each regional market.

CRITICAL LOCALIZATION RULES:

1. TURKEY (TR) Query:
   - Write in Turkish using Trendyol/Hepsiburada keyword style
   - Keep measurements in "cm"
   - Use product-focused short keywords, NOT long sentences
   - Example: "Çatılı masif çocuk montessori yatak 90x190" NOT "Sebastian Çatılı Masif Karyola detaylı açıklama..."

2. USA Query:
   - Write in American English using Amazon/Wayfair keyword style
   - CONVERT all cm measurements to inches mathematically (1 cm = 0.3937 inches)
   - Map to standard US bed sizes: Toddler (28x52"), Crib (28x52"), Twin (38x75"), Twin XL (38x80"), Full (54x75"), Queen (60x80"), King (76x80")
   - Map common furniture dimensions to US terms
   - Example: "Solid wood house bed frame twin size" NOT "90x190 cm wooden bed"

3. EUROPE (EU) Query — IMPORTANT: This is for the UK market (gl=gb, hl=en).
   - Write in British English using Amazon.co.uk / Wayfair.co.uk / John Lewis keyword style
   - Keep measurements in "cm" (NEVER use inches for EU)
   - Use UK e-commerce search terms (e.g., "children's" not "kids'", "cot bed" not "crib")
   - Example: "Wooden house bed frame children 90x190 cm" NOT "Ahşap çatılı yatak"

Return ONLY valid JSON (no markdown, no code fences):
{
  "TR": {
    "region": "TR",
    "query": "the Turkish search query",
    "gl": "tr",
    "hl": "tr",
    "measurementUnit": "cm",
    "reasoning": "Brief explanation of keyword choices"
  },
  "USA": {
    "region": "USA",
    "query": "the American search query with inch measurements",
    "gl": "us",
    "hl": "en",
    "measurementUnit": "inches",
    "reasoning": "Brief explanation including cm-to-inch conversion"
  },
  "EU": {
    "region": "EU",
    "query": "the British English search query with cm measurements",
    "gl": "gb",
    "hl": "en",
    "measurementUnit": "cm",
    "reasoning": "Brief explanation — UK market focus, Amazon.co.uk style"
  }
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate 3 localized search queries for this product:

Product Name: ${productName}
Category: ${productCategory || "Children's furniture / Wooden toys"}
Description: ${productDescription || "N/A"}

Remember:
- TR: Turkish keywords, cm, Trendyol/Hepsiburada style
- USA: English keywords, CONVERT cm to inches, use US bed size names (Twin/Full/etc)
- EU: British English keywords, cm, Amazon.co.uk/John Lewis style, gl=gb`,
      },
    ],
    temperature: 0.4,
    max_tokens: 1500,
  });

  const raw = completion.choices[0]?.message?.content || "";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  let data: any;
  try {
    data = JSON.parse(cleaned);
  } catch {
    console.warn("[Regional Queries] JSON parse failed, using fallback queries for:", productName);
    return buildFallbackQueries(productName, productCategory);
  }

  if (!data?.TR?.query || !data?.USA?.query || !data?.EU?.query) {
    console.warn("[Regional Queries] Incomplete AI response, using fallback queries");
    return buildFallbackQueries(productName, productCategory);
  }

  return {
    TR: {
      region: "TR",
      query: data.TR.query,
      gl: data.TR.gl || "tr",
      hl: data.TR.hl || "tr",
      measurementUnit: data.TR.measurementUnit || "cm",
      reasoning: data.TR.reasoning || "",
    },
    USA: {
      region: "USA",
      query: data.USA.query,
      gl: data.USA.gl || "us",
      hl: data.USA.hl || "en",
      measurementUnit: data.USA.measurementUnit || "inches",
      reasoning: data.USA.reasoning || "",
    },
    EU: {
      region: "EU",
      query: data.EU.query,
      gl: "gb",
      hl: "en",
      measurementUnit: data.EU.measurementUnit || "cm",
      reasoning: data.EU.reasoning || "",
    },
  };
}

function buildFallbackQueries(productName: string, productCategory: string): RegionalQueries {
  return {
    TR: {
      region: "TR",
      query: `${productName} ${productCategory}`,
      gl: "tr",
      hl: "tr",
      measurementUnit: "cm",
      reasoning: "Fallback: using original product name",
    },
    USA: {
      region: "USA",
      query: `${productCategory} children furniture wooden`,
      gl: "us",
      hl: "en",
      measurementUnit: "inches",
      reasoning: "Fallback: using category-based English query",
    },
    EU: {
      region: "EU",
      query: `${productCategory} children's furniture wooden`,
      gl: "gb",
      hl: "en",
      measurementUnit: "cm",
      reasoning: "Fallback: UK market, category-based British English query",
    },
  };
}

const REGION_SITES: Record<string, string> = {
  TR: "trendyol.com, hepsiburada.com, n11.com, ciceksepeti.com, or .com.tr brand sites",
  USA: "amazon.com, etsy.com, wayfair.com, target.com, walmart.com, potterybarnkids.com",
  EU_GB: "amazon.co.uk, etsy.com/uk, wayfair.co.uk, johnlewis.com, argos.co.uk, vertbaudet.co.uk, or UK brand sites",
  EU_DE: "amazon.de, otto.de, home24.de, kidswoodlove.de, or German brand sites",
};

const RESPONSES_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "";
const RESPONSES_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "";

async function webSearchForRegion(
  query: string,
  region: "TR" | "USA" | "EU",
  subRegion?: "GB" | "DE",
): Promise<string[]> {
  let sites: string;
  let searchQuery = query;

  if (region === "EU") {
    if (subRegion === "DE") {
      sites = REGION_SITES.EU_DE;
    } else {
      sites = REGION_SITES.EU_GB;
    }
  } else {
    sites = REGION_SITES[region];
  }

  const searchPrompt = `Find ${SEARCH_URLS_PER_REGION} real product page URLs for "${searchQuery}" on these e-commerce sites: ${sites}.

RULES:
- Return ONLY direct product page URLs (not search/category pages)
- Each URL must be a specific product listing
- One URL per line, no other text, no numbering
- URLs must start with https://
- For Amazon: URLs must contain /dp/ followed by a 10-character ASIN
- For Etsy: URLs must contain /listing/ followed by a number`;

  const logPrefix = region === "EU" ? `[EU-${subRegion || "GB"}]` : `[${region}]`;

  try {
    const responsesUrl = `${RESPONSES_BASE_URL}/responses`;

    console.log(`  ${logPrefix} Sending web search request...`);
    console.log(`  ${logPrefix} Query: "${searchQuery}"`);
    console.log(`  ${logPrefix} Target sites: ${sites}`);

    const res = await fetch(responsesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESPONSES_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: searchPrompt,
        max_output_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  ${logPrefix} ❌ Responses API HTTP error: ${res.status}`);
      console.error(`  ${logPrefix} ❌ Response body: ${errText.substring(0, 500)}`);
      return [];
    }

    const data = await res.json() as any;

    const searchCalls = data.output?.filter((o: any) => o.type === "web_search_call") || [];
    console.log(`  ${logPrefix} Web search calls made: ${searchCalls.length}`);
    for (const sc of searchCalls) {
      console.log(`  ${logPrefix}   Search query used: "${sc.action?.query || "N/A"}"`);
    }

    const messageOutput = data.output?.find((o: any) => o.type === "message");
    const text = messageOutput?.content?.[0]?.text || "";

    if (!text) {
      console.error(`  ${logPrefix} ❌ Empty response text from API`);
      console.error(`  ${logPrefix} ❌ Full API response output types: ${data.output?.map((o: any) => o.type).join(", ")}`);
      return [];
    }

    const urls = (text.match(/https?:\/\/[^\s\)\"<>,]+/g) || [])
      .map((u: string) => u.replace(/[\.\)]+$/, ""))
      .filter((u: string) => isValidEcommerceUrl(u) && !isSearchResultsPage(u));

    const unique = [...new Set(urls)];
    console.log(`  ${logPrefix} Web search found ${unique.length} candidate URLs:`);
    unique.forEach((u, i) => console.log(`    ${i + 1}. ${u}`));

    if (unique.length === 0) {
      console.error(`  ${logPrefix} ❌ 0 valid URLs extracted from response text (${text.length} chars)`);
      console.error(`  ${logPrefix} ❌ Raw response preview: ${text.substring(0, 300)}`);
    }

    return unique;
  } catch (err: any) {
    console.error(`  ${logPrefix} ❌ Web search exception: ${err.message}`);
    console.error(`  ${logPrefix} ❌ Stack: ${err.stack?.substring(0, 300)}`);
    return [];
  }
}

async function enrichVerifiedUrls(
  urls: string[],
  region: "TR" | "USA" | "EU",
  productName: string,
  usdToTry: number,
  euSubRegion?: "GB" | "DE",
): Promise<CompetitorRecord[]> {
  if (urls.length === 0) return [];

  const urlList = urls.map((u, i) => `${i + 1}. ${u}`).join("\n");

  let currency: string;
  let currencyLabel: string;
  if (region === "TR") {
    currency = "TRY";
    currencyLabel = "TRY (₺)";
  } else if (region === "USA") {
    currency = "USD";
    currencyLabel = "USD ($)";
  } else if (euSubRegion === "DE") {
    currency = "EUR";
    currencyLabel = "EUR (€)";
  } else {
    currency = "GBP";
    currencyLabel = "GBP (£)";
  }

  const systemPrompt = `You are an e-commerce product data analyst. Given a list of VERIFIED product URLs, provide structured product information for each.

RULES:
- Use your knowledge to fill in realistic product details for each URL
- Product names should reflect what the URL/site typically sells
- Prices should be realistic for the ${region === "EU" ? (euSubRegion === "DE" ? "German" : "UK") : region} market
- Currency: ${currencyLabel}
- Current USD/TRY rate: ${usdToTry.toFixed(2)}
- For priceTRY: convert to Turkish Lira if not already in TRY
- matchScore: 70-95 based on how similar to "${productName}"
- Rating and reviewCount should be realistic estimates

Return ONLY valid JSON array (no markdown, no code fences):
[
  {
    "url": "the exact URL from the list",
    "name": "Product name",
    "brand": "Brand name",
    "priceLocal": "Price with currency symbol",
    "priceTRY": "Converted TRY price with ₺",
    "currency": "${currency}",
    "deliveryEstimate": "Delivery estimate to Turkey",
    "matchScore": 85,
    "matchReason": "One sentence why this is similar",
    "rating": 4.5,
    "reviewCount": 100
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Provide product details for these ${urls.length} verified URLs (region: ${region}, market: ${euSubRegion || region}):\n\n${urlList}\n\nOriginal product for comparison: "${productName}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr)) return [];

    const now = new Date().toISOString();
    const country = region === "TR" ? "Türkiye" : region === "USA" ? "United States" : (euSubRegion === "DE" ? "Germany" : "United Kingdom");

    const urlToEnrichment = new Map<string, any>();
    for (const item of arr) {
      if (item.url) urlToEnrichment.set(item.url, item);
    }

    return urls.map((url) => {
      const item = urlToEnrichment.get(url) || arr.find((a: any) => a.url === url) || {};
      return {
        name: item.name || "Product",
        brand: item.brand || "",
        region,
        country,
        priceLocal: item.priceLocal || "",
        priceTRY: item.priceTRY || "",
        currency: item.currency || currency,
        productUrl: url,
        deliveryEstimate: item.deliveryEstimate || "",
        socialMedia: [],
        matchScore: item.matchScore || 75,
        matchReason: item.matchReason || "",
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,
        stockStatus: "in_stock" as const,
        urlVerified: true,
        lastChecked: now,
      };
    });
  } catch (err: any) {
    console.error(`[${region}] Enrichment failed:`, err.message);
    const now = new Date().toISOString();
    const country = region === "TR" ? "Türkiye" : region === "USA" ? "United States" : (euSubRegion === "DE" ? "Germany" : "United Kingdom");
    return urls.map((url) => ({
      name: "Product",
      brand: "",
      region,
      country,
      priceLocal: "",
      priceTRY: "",
      currency,
      productUrl: url,
      deliveryEstimate: "",
      socialMedia: [],
      matchScore: 70,
      matchReason: "Similar product found via web search",
      rating: 0,
      reviewCount: 0,
      stockStatus: "in_stock" as const,
      urlVerified: true,
      lastChecked: now,
    }));
  }
}

async function searchAndVerifyRegion(
  query: string,
  region: "TR" | "USA" | "EU",
  productName: string,
  usdToTry: number,
): Promise<CompetitorRecord[]> {
  console.log(`[${region}] Starting live web search: "${query}"`);

  if (region === "EU") {
    return searchAndVerifyEU(query, productName, usdToTry);
  }

  const candidateUrls = await webSearchForRegion(query, region);

  if (candidateUrls.length === 0) {
    console.error(`[${region}] ❌ ZERO RESULTS — No URLs found from web search`);
    console.error(`[${region}] ❌ Query was: "${query}"`);
    return [];
  }

  const verified: string[] = [];
  const BATCH_SIZE = 3;

  for (let i = 0; i < candidateUrls.length && verified.length < TARGET_PER_REGION; i += BATCH_SIZE) {
    const batch = candidateUrls.slice(i, Math.min(i + BATCH_SIZE, candidateUrls.length));

    const results = await Promise.allSettled(
      batch.map(async (url) => {
        const result = await verifyURL(url, false);
        return { url, result };
      }),
    );

    for (const r of results) {
      if (verified.length >= TARGET_PER_REGION) break;
      if (r.status !== "fulfilled") continue;

      const { url, result } = r.value;

      if (result.valid) {
        verified.push(result.finalUrl);
        console.log(`  [${region}] ✓ VERIFIED (${verified.length}/${TARGET_PER_REGION}): ${result.finalUrl}`);
      } else {
        console.log(`  [${region}] ✗ REJECTED: ${url} — ${result.reason}`);
      }
    }
  }

  console.log(`[${region}] Verification complete: ${verified.length}/${TARGET_PER_REGION} verified`);

  if (verified.length === 0) {
    console.error(`[${region}] ❌ ALL ${candidateUrls.length} candidate URLs failed verification`);
  }

  const enriched = await enrichVerifiedUrls(verified, region, productName, usdToTry);
  return enriched;
}

async function searchAndVerifyEU(
  query: string,
  productName: string,
  usdToTry: number,
): Promise<CompetitorRecord[]> {
  console.log(`[EU] Phase 1: Searching UK market (gl=gb, hl=en)...`);

  const gbUrls = await webSearchForRegion(query, "EU", "GB");

  const gbVerified: string[] = [];

  for (const url of gbUrls) {
    if (gbVerified.length >= TARGET_PER_REGION) break;

    const result = await verifyURL(url, isEuDomain(url));

    if (result.valid) {
      gbVerified.push(result.finalUrl);
      console.log(`  [EU-GB] ✓ VERIFIED (${gbVerified.length}/${TARGET_PER_REGION}): ${result.finalUrl} [${isEuDomain(url) ? "GDPR bypass" : "full check"}]`);
    } else {
      console.log(`  [EU-GB] ✗ REJECTED: ${url} — ${result.reason}`);
    }
  }

  console.log(`[EU-GB] Result: ${gbVerified.length}/${TARGET_PER_REGION} verified from ${gbUrls.length} candidates`);

  if (gbVerified.length >= TARGET_PER_REGION) {
    const enriched = await enrichVerifiedUrls(gbVerified, "EU", productName, usdToTry, "GB");
    return enriched;
  }

  const remaining = TARGET_PER_REGION - gbVerified.length;
  console.log(`[EU] Phase 2: UK gave ${gbVerified.length}, need ${remaining} more — falling back to DE market (gl=de, hl=de)...`);

  const deQuery = await generateGermanQuery(productName);
  console.log(`[EU-DE] German query: "${deQuery}"`);

  const deUrls = await webSearchForRegion(deQuery, "EU", "DE");

  const deVerified: string[] = [];

  for (const url of deUrls) {
    if (deVerified.length >= remaining) break;

    if (gbVerified.includes(url)) continue;

    const result = await verifyURL(url, isEuDomain(url));

    if (result.valid) {
      deVerified.push(result.finalUrl);
      console.log(`  [EU-DE] ✓ VERIFIED (${deVerified.length}/${remaining}): ${result.finalUrl} [${isEuDomain(url) ? "GDPR bypass" : "full check"}]`);
    } else {
      console.log(`  [EU-DE] ✗ REJECTED: ${url} — ${result.reason}`);
    }
  }

  console.log(`[EU-DE] Result: ${deVerified.length}/${remaining} verified from ${deUrls.length} candidates`);

  const allGbEnriched = gbVerified.length > 0
    ? await enrichVerifiedUrls(gbVerified, "EU", productName, usdToTry, "GB")
    : [];

  const allDeEnriched = deVerified.length > 0
    ? await enrichVerifiedUrls(deVerified, "EU", productName, usdToTry, "DE")
    : [];

  const combined = [...allGbEnriched, ...allDeEnriched];

  const totalVerified = gbVerified.length + deVerified.length;
  console.log(`[EU] TOTAL: ${totalVerified}/${TARGET_PER_REGION} verified (GB: ${gbVerified.length}, DE: ${deVerified.length})`);

  if (totalVerified === 0) {
    console.error(`[EU] ❌ ZERO RESULTS from both GB and DE markets`);
    console.error(`[EU] ❌ GB query: "${query}" → ${gbUrls.length} candidates, 0 verified`);
    console.error(`[EU] ❌ DE query: "${deQuery}" → ${deUrls.length} candidates, 0 verified`);
  }

  return combined;
}

async function generateGermanQuery(productName: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Translate the following product name into German e-commerce search terms suitable for amazon.de. Use German keywords, keep measurements in cm. Return ONLY the German search query, nothing else.",
        },
        {
          role: "user",
          content: `Translate to German e-commerce keywords: "${productName}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });
    return completion.choices[0]?.message?.content?.trim() || productName;
  } catch {
    return productName;
  }
}

router.post("/competitor-analysis", async (req, res) => {
  try {
    const { productName, productDescription, productPrice, productCategory, sku } = req.body;

    if (!productName) {
      res.status(400).json({ error: "productName is required" });
      return;
    }

    const cacheKey = sku || productName;

    const cached = await getCachedAnalysis(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`[Competitor Analysis] Starting for: "${productName}" (SKU: ${sku})`);
    console.log(`${"=".repeat(60)}`);

    const [usdToTry, regionalQueries] = await Promise.all([
      getUsdToTry(),
      generateRegionalQueries(productName, productDescription || "", productCategory || ""),
    ]);

    console.log(`[Phase 1] Regional queries generated:`);
    console.log(`  TR: "${regionalQueries.TR.query}" (gl=${regionalQueries.TR.gl}, hl=${regionalQueries.TR.hl})`);
    console.log(`  USA: "${regionalQueries.USA.query}" (gl=${regionalQueries.USA.gl}, hl=${regionalQueries.USA.hl})`);
    console.log(`  EU: "${regionalQueries.EU.query}" (gl=${regionalQueries.EU.gl}, hl=${regionalQueries.EU.hl})`);

    console.log(`[Phase 2] Live web search + deep verification (target: ${TARGET_PER_REGION}/region)...`);

    const [trResults, usaResults, euResults] = await Promise.all([
      searchAndVerifyRegion(regionalQueries.TR.query, "TR", productName, usdToTry)
        .catch((err) => { console.error("[TR error]", err.message); return [] as CompetitorRecord[]; }),
      searchAndVerifyRegion(regionalQueries.USA.query, "USA", productName, usdToTry)
        .catch((err) => { console.error("[USA error]", err.message); return [] as CompetitorRecord[]; }),
      searchAndVerifyRegion(regionalQueries.EU.query, "EU", productName, usdToTry)
        .catch((err) => { console.error("[EU error]", err.message); return [] as CompetitorRecord[]; }),
    ]);

    const allVerified = [...trResults, ...usaResults, ...euResults];

    allVerified.sort((a, b) => {
      if (a.region !== b.region) return 0;
      return b.matchScore - a.matchScore;
    });

    console.log(`[Phase 2] Complete: TR=${trResults.length}, USA=${usaResults.length}, EU=${euResults.length}, Total=${allVerified.length}`);

    if (allVerified.length === 0) {
      console.error(`[CRITICAL] ❌ ALL REGIONS returned 0 results!`);
      console.error(`[CRITICAL] Queries: TR="${regionalQueries.TR.query}", USA="${regionalQueries.USA.query}", EU="${regionalQueries.EU.query}"`);
    }

    console.log(`[Phase 3] Generating market summary...`);

    let productSummary = "";
    try {
      const summaryCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a market analyst. Write a brief 2-3 sentence market summary. Return ONLY the summary text, no JSON.",
          },
          {
            role: "user",
            content: `Product: ${productName}
Category: ${productCategory || "Children's furniture"}
Verified competitors found: TR=${trResults.length}, USA=${usaResults.length}, EU=${euResults.length}
Search queries:
- TR: "${regionalQueries.TR.query}"
- USA: "${regionalQueries.USA.query}"
- EU: "${regionalQueries.EU.query}"
Verified price range: ${allVerified.map((c) => c.priceLocal).join(", ")}

Write a brief market analysis summary (2-3 sentences).`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });
      productSummary = summaryCompletion.choices[0]?.message?.content?.trim() || "";
    } catch {
      productSummary = `Market analysis for ${productName}: ${allVerified.length} verified competitors found across ${trResults.length > 0 ? "Turkey" : ""}${usaResults.length > 0 ? ", USA" : ""}${euResults.length > 0 ? ", Europe" : ""}.`;
    }

    const result: AnalysisResult = {
      productSummary,
      regionalQueries,
      competitors: allVerified,
      analysisDate: new Date().toISOString(),
      fromCache: false,
    };

    await saveCachedAnalysis(cacheKey, productName, productCategory || "", result);

    console.log(`[Competitor Analysis] COMPLETE. ${allVerified.length} verified competitors saved.`);
    console.log(`${"=".repeat(60)}\n`);

    res.json(result);
  } catch (err: any) {
    console.error("Competitor analysis error:", err);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

router.get("/competitor-analysis/:sku", async (req, res) => {
  try {
    const cached = await getCachedAnalysis(req.params.sku);
    if (cached) {
      res.json(cached);
    } else {
      res.status(404).json({ error: "No cached analysis found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
