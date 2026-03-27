import { useState } from "react";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import { useT } from "@/i18n";
import { ChevronDown, ChevronRight } from "lucide-react";

const visibleProducts = products.filter((p) => p.images && p.images.length > 0);

const SITE_ICONS: Record<string, string> = {
  pallde: "🏠",
  tlc: "🌿",
  bonchicbaby: "🌸",
  cedarworks: "🌲",
  woodandhearts: "❤️",
  communityplaythings: "🏫",
  plywoodproject: "🪵",
  woodandroom: "🛏️",
  saboconcept: "🌈",
  woodened: "🧩",
  woodjoycollection: "✨",
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const t = useT();

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  const getDescendantIds = (parentId: string): string[] => {
    const children = categories.filter((c) => c.parent === parentId).map((c) => c.id);
    return [parentId, ...children];
  };

  const filteredProducts =
    activeCategory === "all"
      ? visibleProducts
      : visibleProducts.filter((p) => getDescendantIds(activeCategory).includes(p.category));

  const topLevelCats = categories.filter((c) => !c.parent && c.id !== "all");

  const getProductCount = (parentId: string) => {
    const ids = getDescendantIds(parentId);
    return visibleProducts.filter((p) => ids.includes(p.category)).length;
  };

  const handleSiteClick = (parentId: string) => {
    setActiveCategory(parentId);
    if (!expandedParents.has(parentId)) toggleParent(parentId);
  };

  const handleShowAll = () => {
    setActiveCategory("all");
    setExpandedParents(new Set());
  };

  return (
    <div>
      <section id="urunler" className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <CategorySidebar
              activeCategory={activeCategory}
              expandedParents={expandedParents}
              onCategoryChange={setActiveCategory}
              onToggleParent={toggleParent}
              onShowAll={handleShowAll}
            />

            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t.catalog.title}</h2>
                <p className="text-muted-foreground mt-1">
                  {filteredProducts.length} {t.catalog.products}
                  {activeCategory !== "all" && (
                    <button
                      onClick={handleShowAll}
                      className="ml-3 text-sm text-primary underline underline-offset-2 hover:opacity-70"
                    >
                      {t.catalog.showAll}
                    </button>
                  )}
                </p>
              </div>

              <div className="lg:hidden mb-8">
                <button
                  onClick={handleShowAll}
                  className={`w-full mb-4 py-3 px-6 rounded-xl text-sm font-semibold transition-all border-2 ${
                    activeCategory === "all"
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-white text-foreground border-border hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  🗂️ {t.catalog.allProducts}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === "all" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {visibleProducts.length}
                  </span>
                </button>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {topLevelCats.map((parent) => {
                    const children = categories.filter((c) => c.parent === parent.id);
                    const count = getProductCount(parent.id);
                    const isActive = activeCategory === parent.id || getDescendantIds(parent.id).includes(activeCategory);
                    const isExpanded = expandedParents.has(parent.id);
                    const icon = SITE_ICONS[parent.id] || "📦";
                    if (count === 0) return null;

                    return (
                      <div
                        key={parent.id}
                        className={`rounded-xl border-2 overflow-hidden transition-all ${
                          isActive ? "border-primary shadow-md bg-amber-50" : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        <button
                          onClick={() => children.length > 0 ? handleSiteClick(parent.id) : setActiveCategory(parent.id)}
                          className="w-full text-left p-3 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{icon}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>{count}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs font-semibold leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>
                              {parent.name}
                            </span>
                            {children.length > 0 && (
                              <span className="text-muted-foreground">
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </span>
                            )}
                          </div>
                        </button>

                        {isExpanded && children.length > 0 && (
                          <div className="border-t border-border/60 px-2 pb-2 pt-1 flex flex-col gap-1 bg-amber-50/50">
                            {children.map((child) => {
                              const childCount = visibleProducts.filter((p) => p.category === child.id).length;
                              if (childCount === 0) return null;
                              const isChildActive = activeCategory === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => setActiveCategory(child.id)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                                    isChildActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                                  }`}
                                >
                                  <span className="truncate">{child.name}</span>
                                  <span className={`ml-1 shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${
                                    isChildActive ? "bg-white/20" : "bg-border text-muted-foreground"
                                  }`}>{childCount}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeCategory === "all" ? (
                <div className="space-y-16">
                  {topLevelCats.map((parent) => {
                    const children = categories.filter((c) => c.parent === parent.id);
                    const allIds = [parent.id, ...children.map((c) => c.id)];
                    const parentProds = visibleProducts.filter((p) => allIds.includes(p.category));
                    if (parentProds.length === 0) return null;

                    if (children.length === 0) {
                      return (
                        <div key={parent.id} id={parent.slug}>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl">{SITE_ICONS[parent.id] || "📦"}</span>
                            <h3 className="text-xl font-bold text-foreground">{parent.name}</h3>
                            <div className="flex-1 h-px bg-border" />
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {parentProds.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={parent.id} id={parent.slug}>
                        <div className="flex items-center gap-3 mb-8">
                          <span className="text-2xl">{SITE_ICONS[parent.id] || "📦"}</span>
                          <div className="w-1 h-8 bg-primary rounded-full" />
                          <h3 className="text-2xl font-bold text-foreground">{parent.name}</h3>
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-sm text-muted-foreground">{parentProds.length} {t.catalog.products}</span>
                        </div>
                        <div className="space-y-10 pl-4">
                          {children.map((child) => {
                            const childProds = visibleProducts.filter((p) => p.category === child.id);
                            if (childProds.length === 0) return null;
                            return (
                              <div key={child.id} id={child.slug}>
                                <div className="flex items-center gap-3 mb-4">
                                  <h4 className="text-lg font-semibold text-foreground">{child.name}</h4>
                                  <div className="flex-1 h-px bg-border/60" />
                                  <span className="text-xs text-muted-foreground">{childProds.length}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                  {childProds.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
