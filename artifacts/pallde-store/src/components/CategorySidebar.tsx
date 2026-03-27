import { categories, products } from "@/data/products";
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

interface CategorySidebarProps {
  activeCategory: string;
  expandedParents: Set<string>;
  onCategoryChange: (id: string) => void;
  onToggleParent: (id: string) => void;
  onShowAll: () => void;
}

export default function CategorySidebar({
  activeCategory,
  expandedParents,
  onCategoryChange,
  onToggleParent,
  onShowAll,
}: CategorySidebarProps) {
  const t = useT();

  const topLevelCats = categories.filter((c) => !c.parent && c.id !== "all");

  const getDescendantIds = (parentId: string): string[] => {
    const children = categories.filter((c) => c.parent === parentId).map((c) => c.id);
    return [parentId, ...children];
  };

  const getProductCount = (parentId: string) => {
    const ids = getDescendantIds(parentId);
    return visibleProducts.filter((p) => ids.includes(p.category)).length;
  };

  const handleSiteClick = (parentId: string) => {
    onCategoryChange(parentId);
    if (!expandedParents.has(parentId)) onToggleParent(parentId);
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8 scrollbar-thin">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 px-2">
          {t.catalog.categories}
        </h3>

        <button
          onClick={onShowAll}
          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all mb-1 flex items-center justify-between ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🗂️</span>
            <span>{t.catalog.allProducts}</span>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeCategory === "all" ? "bg-white/20" : "bg-muted text-muted-foreground"
          }`}>
            {visibleProducts.length}
          </span>
        </button>

        <div className="space-y-0.5 mt-1">
          {topLevelCats.map((parent) => {
            const children = categories.filter((c) => c.parent === parent.id);
            const count = getProductCount(parent.id);
            const isActive = activeCategory === parent.id || getDescendantIds(parent.id).includes(activeCategory);
            const isExpanded = expandedParents.has(parent.id);
            const icon = SITE_ICONS[parent.id] || "📦";
            if (count === 0) return null;

            return (
              <div key={parent.id}>
                <button
                  onClick={() => children.length > 0 ? handleSiteClick(parent.id) : onCategoryChange(parent.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-amber-50 text-primary border border-primary/20"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-base shrink-0">{icon}</span>
                  <span className="truncate flex-1">{parent.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>{count}</span>
                  {children.length > 0 && (
                    <span className="text-muted-foreground shrink-0">
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </span>
                  )}
                </button>

                {isExpanded && children.length > 0 && (
                  <div className="ml-5 pl-3 border-l-2 border-border/60 mt-0.5 mb-1 space-y-0.5">
                    {children.map((child) => {
                      const childCount = visibleProducts.filter((p) => p.category === child.id).length;
                      if (childCount === 0) return null;
                      const isChildActive = activeCategory === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => onCategoryChange(child.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-between ${
                            isChildActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
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
    </aside>
  );
}
