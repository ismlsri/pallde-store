import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/i18n";
import { getPrices, getActivePrice, fmt } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const { tier, addToCart } = useCart();
  const { lang } = useLang();
  const t = useT();
  const displayName = lang === "en" ? product.name_en : product.name_tr;

  const img = imgError
    ? `https://placehold.co/500x500/f5f0eb/c87941?text=${encodeURIComponent(t.catalog.noImage)}`
    : product.images[imgIdx] || product.images[0];

  const prices = getPrices(product.price);
  const activePrice = getActivePrice(product.price, tier);
  const isDiscounted = activePrice < prices.listPrice;

  return (
    <div className="group block bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <Link href={`/urun/${product.urlPart}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={img}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              if (!imgError && imgIdx < product.images.length - 1) {
                setImgIdx((prev) => prev + 1);
              } else {
                setImgError(true);
              }
            }}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              +{product.images.length - 1}
            </div>
          )}
          {tier !== "sale" && (
            <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              tier === "bulk" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
            }`}>
              {tier === "bulk" ? t.product.bulkOrder.toUpperCase() : t.product.wholesale.toUpperCase()}
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {displayName}
          </h3>
          <div className="flex items-baseline gap-2 mb-0.5">
            {isDiscounted && (
              <span className="text-xs text-muted-foreground line-through">{fmt(prices.listPrice)}</span>
            )}
            <span className={`font-bold text-base ${
              tier === "bulk" ? "text-purple-600" : tier === "wholesale" ? "text-blue-600" : "text-primary"
            }`}>
              {fmt(activePrice)}
            </span>
          </div>
          {tier === "bulk" && (
            <p className="text-[10px] text-purple-500 mb-1">{t.product.estimated}</p>
          )}
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all border border-primary/20"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {t.product.addToCart}
        </button>
      </div>
    </div>
  );
}
