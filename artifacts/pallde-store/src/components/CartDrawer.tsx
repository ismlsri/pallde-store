import { ShoppingCart, X, Trash2, Plus, Minus, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/i18n";
import { getPrices, getActivePrice, fmt, THRESHOLDS } from "@/lib/pricing";
import { useState } from "react";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, tier, cartTotal, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { lang } = useLang();
  const t = useT();

  const toNextTier =
    tier === "sale"
      ? THRESHOLDS.wholesale - cartTotal
      : tier === "wholesale"
      ? THRESHOLDS.bulk - cartTotal
      : 0;

  const nextTierName = tier === "sale" ? t.cart.tierLabels.wholesale : tier === "wholesale" ? t.cart.tierLabels.bulk : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline">{t.nav.cart}</span>
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            {t.cart.title}
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {t.catalog.products})
              </span>
            )}
          </h2>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Badge */}
        {itemCount > 0 && (
          <div
            className={`mx-5 mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
              tier === "bulk"
                ? "bg-purple-50 border border-purple-200 text-purple-800"
                : tier === "wholesale"
                ? "bg-blue-50 border border-blue-200 text-blue-800"
                : "bg-amber-50 border border-amber-200 text-amber-800"
            }`}
          >
            <div className="font-semibold">
              {tier === "bulk" && "🏆 "}
              {tier === "wholesale" && "⭐ "}
              {tier === "sale" && "🛒 "}
              {t.cart.tierLabels[tier]}
              {tier === "bulk" && (
                <span className="ml-2 text-xs font-normal opacity-75">({t.product.estimated})</span>
              )}
            </div>
            {toNextTier > 0 && nextTierName && (
              <div className="text-xs mt-1 opacity-80">
                <ChevronRight className="w-3 h-3 inline" />
                {nextTierName} {t.cart.toNextTier}: {fmt(Math.ceil(toNextTier))}
              </div>
            )}
            {tier === "sale" && (
              <div className="text-xs mt-1 opacity-70">
                ≥{fmt(THRESHOLDS.wholesale)} → {t.cart.tierLabels.wholesale} • ≥{fmt(THRESHOLDS.bulk)} → {t.cart.tierLabels.bulk}
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t.cart.empty}</p>
              <p className="text-xs mt-1">{t.cart.emptySubtext}</p>
            </div>
          ) : (
            items.map((item) => {
              const prices = getPrices(item.product.price);
              const activePrice = getActivePrice(item.product.price, tier);
              const lineTotal = activePrice * item.quantity;
              return (
                <div key={item.product.id} className="flex gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt={lang === "en" ? item.product.name_en : item.product.name_tr} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">{lang === "en" ? item.product.name_en : item.product.name_tr}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground line-through">{fmt(prices.listPrice)}</span>
                      <span className="text-sm font-bold text-primary">{fmt(activePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-border/80 hover:bg-border flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-border/80 hover:bg-border flex items-center justify-center">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{fmt(lineTotal)}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t.cart.total}</span>
              <span className="text-primary">{fmt(cartTotal)}</span>
            </div>
            {tier === "bulk" && (
              <p className="text-xs text-purple-700 bg-purple-50 rounded-lg px-3 py-2">
                ⚠️ {t.cart.estimatedNote}
              </p>
            )}
            <button onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-red-500 transition-colors text-center py-1">
              {t.cart.clear}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
