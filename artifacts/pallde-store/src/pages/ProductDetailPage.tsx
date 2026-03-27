import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { products, categories } from "@/data/products";
import { manufacturers } from "@/data/manufacturers";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/i18n";
import { getPrices, getActivePrice, fmt, THRESHOLDS } from "@/lib/pricing";
import CompetitorAnalysis from "@/components/CompetitorAnalysis";
import {
  ChevronLeft, ChevronDown, ChevronRight, ExternalLink, ShoppingCart, Info, Globe,
  Phone, Mail, MapPin, Instagram, Facebook, Youtube, Building2, Tag, Layers, Factory
} from "lucide-react";

const visibleProducts = products.filter((p) => p.images && p.images.length > 0);

function getTopLevelCategoryId(categoryId: string): string {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return categoryId;
  if (!cat.parent) return cat.id;
  return getTopLevelCategoryId(cat.parent);
}

function Section({ title, icon, defaultOpen = false, variant = "default", children }: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "default" | "admin" | "manufacturer";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = {
    default: "border-border bg-white",
    admin: "border-yellow-200 bg-yellow-50/50",
    manufacturer: "border-blue-200 bg-blue-50/50",
  };
  const headerStyles = {
    default: "text-foreground",
    admin: "text-yellow-700",
    manufacturer: "text-blue-700",
  };
  return (
    <div className={`rounded-xl border overflow-hidden ${styles[variant]}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
      >
        <span className={`shrink-0 ${headerStyles[variant]}`}>{icon}</span>
        <span className={`text-sm font-semibold flex-1 ${headerStyles[variant]}`}>{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-inherit">{children}</div>}
    </div>
  );
}

export default function ProductDetailPage() {
  const [, params] = useRoute("/urun/:urlPart");
  const urlPart = params?.urlPart || "";
  const product = visibleProducts.find((p) => p.urlPart === urlPart);
  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [qty, setQty] = useState(1);

  const { tier, addToCart } = useCart();
  const { lang } = useLang();
  const t = useT();
  const displayName = product ? (lang === "en" ? product.name_en : product.name_tr) : "";
  const displayDesc = product ? (lang === "en" ? product.description_en : product.description_tr) : "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [urlPart]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{t.product.notFound}</h1>
        <Link href="/" className="text-primary hover:underline">{t.product.backToHome}</Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const parentCategory = category?.parent ? categories.find((c) => c.id === category.parent) : null;
  const topLevelId = getTopLevelCategoryId(product.category);
  const manufacturer = manufacturers[topLevelId] ?? null;

  const relatedProducts = visibleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const getImgSrc = (idx: number) =>
    imgError[idx] ? "https://placehold.co/800x800/f5f0eb/c87941?text=No+Image" : product.images[idx];

  const prices = getPrices(product.price);
  const activePrice = getActivePrice(product.price, tier);
  const NA = t.admin.notAvailable;

  return (
    <div>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
            <span>/</span>
            {parentCategory && (
              <><a href={`/#${parentCategory.slug}`} className="hover:text-primary transition-colors">{parentCategory.name}</a><span>/</span></>
            )}
            {category && (
              <><a href={`/#${category.slug}`} className="hover:text-primary transition-colors">{category.name}</a><span>/</span></>
            )}
            <span className="text-foreground font-medium truncate max-w-[200px]">{displayName}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-5">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-4">
          <ChevronLeft className="w-3.5 h-3.5" />{t.nav.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={getImgSrc(activeImg)}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImgError((prev) => ({ ...prev, [activeImg]: true }))}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === idx ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={imgError[idx] ? "https://placehold.co/64x64/f5f0eb/c87941?text=?" : product.images[idx]}
                      alt={`${displayName} ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => setImgError((prev) => ({ ...prev, [idx]: true }))}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div>
              {category && <div className="text-xs text-primary font-medium mb-1">{category.name}</div>}
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{displayName}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-muted-foreground line-through text-sm">{fmt(prices.listPrice)}</span>
              <span className={`text-2xl font-bold ${
                tier === "bulk" ? "text-purple-600" : tier === "wholesale" ? "text-blue-600" : "text-primary"
              }`}>
                {fmt(activePrice)}
              </span>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                {t.pricing[`tier${tier.charAt(0).toUpperCase() + tier.slice(1)}` as keyof typeof t.pricing]}
              </span>
            </div>
            {tier === "bulk" && (
              <p className="text-xs text-purple-600 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />{t.product.estimatedNote}
              </p>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2.5 py-2 hover:bg-muted transition-colors font-bold text-sm">−</button>
                <span className="px-3 py-2 text-xs font-medium border-x border-border">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-2.5 py-2 hover:bg-muted transition-colors font-bold text-sm">+</button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {t.product.addToCart} — {fmt(activePrice * qty)}
              </button>
            </div>

            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />{t.product.viewOriginal}
              </a>
            )}

            {displayDesc && (
              <Section title={t.product.description} icon={<Info className="w-4 h-4" />} defaultOpen={true}>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-2">{displayDesc}</p>
              </Section>
            )}

            <Section title={t.product.pricingTiers} icon={<Tag className="w-4 h-4" />} defaultOpen={false}>
              <table className="w-full text-sm mt-2">
                <tbody className="divide-y divide-border">
                  <tr className={tier === "sale" ? "bg-primary/5" : ""}>
                    <td className="py-2 font-medium">{tier === "sale" && <span className="mr-1">✓</span>}{t.product.salePrice}</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">{t.product.standard}</td>
                    <td className="py-2 text-right font-bold text-primary">{fmt(prices.salePrice)}</td>
                  </tr>
                  <tr className={tier === "wholesale" ? "bg-blue-50" : ""}>
                    <td className="py-2 font-medium">{tier === "wholesale" && <span className="mr-1">✓</span>}{t.product.wholesale}</td>
                    <td className="py-2 text-right text-xs text-muted-foreground">≥ {fmt(THRESHOLDS.wholesale)}</td>
                    <td className="py-2 text-right font-bold text-blue-600">{fmt(prices.wholesalePrice)}</td>
                  </tr>
                  <tr className={tier === "bulk" ? "bg-purple-50" : ""}>
                    <td className="py-2 font-medium">
                      {tier === "bulk" && <span className="mr-1">✓</span>}
                      {t.product.bulkOrder}
                      <span className="ml-1 text-[10px] text-purple-500">({t.product.estimated})</span>
                    </td>
                    <td className="py-2 text-right text-xs text-muted-foreground">≥ {fmt(THRESHOLDS.bulk)}</td>
                    <td className="py-2 text-right font-bold text-purple-600">{fmt(prices.bulkPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Section title={`🔒 ${t.admin.title}`} icon={<Layers className="w-4 h-4" />} variant="admin">
            <div className="mt-2 text-xs text-yellow-900 space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <div><span className="font-semibold">{t.admin.productionCost}:</span> {fmt(product.price)}</div>
                <div><span className="font-semibold">{t.admin.listPrice}:</span> {fmt(prices.listPrice)} <span className="opacity-60">({t.admin.costMultiplier})</span></div>
                <div><span className="font-semibold">{t.admin.salePrice}:</span> {fmt(prices.salePrice)} <span className="opacity-60">({t.admin.saleMultiplier})</span></div>
                <div><span className="font-semibold">{t.admin.wholesalePrice}:</span> {fmt(prices.wholesalePrice)} <span className="opacity-60">(maliyet × 3, ≥${THRESHOLDS.wholesale.toLocaleString()} {t.admin.wholesaleCondition})</span></div>
                <div><span className="font-semibold">{t.admin.bulkEstimate}:</span> {fmt(prices.bulkPrice)} <span className="opacity-60">(maliyet × 2.5, ≥${THRESHOLDS.bulk.toLocaleString()} {t.admin.bulkCondition})</span></div>
                <div><span className="font-semibold">{t.admin.stockCode}:</span> <span className="font-mono">{product.sku}</span></div>
              </div>
              <div className="pt-1">
                <span className="font-semibold">{t.admin.source}:</span>{" "}
                <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-mono underline text-yellow-800 hover:text-yellow-600 break-all text-[11px]">{product.sourceUrl}</a>
              </div>
              {product.etsyUrl && (
                <div>
                  <span className="font-semibold">{t.admin.etsy}:</span>{" "}
                  <a href={product.etsyUrl} target="_blank" rel="noopener noreferrer" className="font-mono underline text-yellow-800 break-all text-[11px]">{product.etsyUrl}</a>
                </div>
              )}
            </div>
          </Section>

          {manufacturer && (
            <Section title={`🏭 ${t.admin.manufacturerTitle}`} icon={<Factory className="w-4 h-4" />} variant="manufacturer">
              <div className="mt-2 text-xs text-blue-900">
                {manufacturer.description && (
                  <p className="text-blue-800 mb-3 leading-relaxed bg-blue-100/50 rounded-lg p-2.5 border border-blue-200 text-[11px]">
                    {lang === "en" ? manufacturer.description.en : manufacturer.description.tr}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <Building2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                    <span><span className="font-semibold text-blue-700">{t.admin.manufacturerCompany}:</span> {manufacturer.name}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Globe className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                    <span>
                      <span className="font-semibold text-blue-700">{t.admin.manufacturerWebsite}:</span>{" "}
                      {manufacturer.website.startsWith("http") ? (
                        <a href={manufacturer.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-800 hover:text-blue-600 break-all">{manufacturer.website}</a>
                      ) : (
                        <span>{manufacturer.website}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                    <span><span className="font-semibold text-blue-700">{t.admin.manufacturerCountry}:</span> {manufacturer.country}</span>
                  </div>
                  {manufacturer.address && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                      <span><span className="font-semibold text-blue-700">{t.admin.manufacturerAddress}:</span> {manufacturer.address}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5">
                    <Phone className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                    <span><span className="font-semibold text-blue-700">{t.admin.manufacturerPhone}:</span> {manufacturer.phone ?? NA}</span>
                  </div>
                  {manufacturer.whatsapp && (
                    <div className="flex items-start gap-1.5">
                      <Phone className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                      <span>
                        <span className="font-semibold text-blue-700">{t.admin.manufacturerWhatsapp}:</span>{" "}
                        <a href={`https://wa.me/${manufacturer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline text-green-700">{manufacturer.whatsapp}</a>
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5">
                    <Mail className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                    <span>
                      <span className="font-semibold text-blue-700">{t.admin.manufacturerEmail}:</span>{" "}
                      {manufacturer.email && manufacturer.email.includes("@") ? (
                        <a href={`mailto:${manufacturer.email}`} className="underline text-blue-800 hover:text-blue-600">{manufacturer.email}</a>
                      ) : (
                        <span>{manufacturer.email ?? NA}</span>
                      )}
                    </span>
                  </div>
                  {manufacturer.taxId && (
                    <div className="flex items-start gap-1.5">
                      <Building2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                      <span><span className="font-semibold text-blue-700">{t.admin.manufacturerTaxId}:</span> <span className="font-mono">{manufacturer.taxId}</span></span>
                    </div>
                  )}
                  {manufacturer.owner && (
                    <div className="flex items-start gap-1.5">
                      <Building2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                      <span><span className="font-semibold text-blue-700">{t.admin.manufacturerOwner}:</span> {manufacturer.owner}</span>
                    </div>
                  )}
                  {manufacturer.ownerContact && (
                    <div className="flex items-start gap-1.5">
                      <Mail className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                      <span><span className="font-semibold text-blue-700">{lang === "en" ? "Key Contact" : "Yetkili Kişi"}:</span> {manufacturer.ownerContact}</span>
                    </div>
                  )}
                  {manufacturer.founded && (
                    <div className="flex items-start gap-1.5">
                      <Building2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                      <span><span className="font-semibold text-blue-700">{t.admin.manufacturerFounded}:</span> {manufacturer.founded}</span>
                    </div>
                  )}
                </div>

                {(manufacturer.instagram || manufacturer.facebook || manufacturer.pinterest || manufacturer.youtube || manufacturer.etsy || manufacturer.linkedin) && (
                  <div className="mt-3 pt-2 border-t border-blue-200 flex flex-wrap gap-2">
                    {manufacturer.instagram && (
                      <a href={manufacturer.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <Instagram className="w-3 h-3 text-pink-500" /><span className="text-[10px]">Instagram</span>
                      </a>
                    )}
                    {manufacturer.facebook && (
                      <a href={manufacturer.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <Facebook className="w-3 h-3 text-blue-500" /><span className="text-[10px]">Facebook</span>
                      </a>
                    )}
                    {manufacturer.pinterest && (
                      <a href={manufacturer.pinterest} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <span className="text-red-500 text-[10px]">📌</span><span className="text-[10px]">Pinterest</span>
                      </a>
                    )}
                    {manufacturer.youtube && (
                      <a href={manufacturer.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <Youtube className="w-3 h-3 text-red-500" /><span className="text-[10px]">YouTube</span>
                      </a>
                    )}
                    {manufacturer.etsy && (
                      <a href={manufacturer.etsy} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <span className="text-orange-500 text-[10px]">🛍️</span><span className="text-[10px]">Etsy</span>
                      </a>
                    )}
                    {manufacturer.linkedin && (
                      <a href={manufacturer.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors">
                        <span className="text-blue-600 text-[10px]">💼</span><span className="text-[10px]">LinkedIn</span>
                      </a>
                    )}
                  </div>
                )}

                {manufacturer.notes && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <span className="font-semibold text-blue-700">{t.admin.manufacturerNotes}:</span>
                    <p className="mt-0.5 text-blue-800 leading-relaxed">{manufacturer.notes}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          <CompetitorAnalysis
            productName={lang === "en" ? product.name_en : product.name_tr}
            productDescription={lang === "en" ? product.description_en : product.description_tr}
            productImage={product.images?.[0] || ""}
            productPrice={product.price}
            productCategory={product.category}
            sku={product.sku}
          />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-foreground">{t.catalog.relatedProducts}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
