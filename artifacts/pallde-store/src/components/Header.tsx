import { useState } from "react";
import { Menu, X } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { useLang } from "@/context/LanguageContext";
import { useT } from "@/i18n";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = useT();

  const navLinks = [
    { href: "/", label: t.nav.catalog },
    { href: "/iletisim", label: t.nav.contact },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language switcher */}
            <div className="flex items-center rounded-lg border border-border overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang("tr")}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === "tr"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-foreground/70 hover:bg-muted"
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-foreground/70 hover:bg-muted"
                }`}
              >
                EN
              </button>
            </div>

            <CartDrawer />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
