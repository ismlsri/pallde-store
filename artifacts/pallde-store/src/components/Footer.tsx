import { useT } from "@/i18n";

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="font-bold text-2xl mb-1">Pallde Catalog</div>
            <p className="text-sm text-background/70 leading-relaxed mt-3">
              Children's furniture &amp; play equipment catalog — sourced from global manufacturers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">{t.footer.categories}</h3>
            <ul className="space-y-2">
              {[
                { href: "/#araba-yatak", label: t.footer.carBed },
                { href: "/iletisim", label: t.footer.contact },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6">
          <p className="text-xs text-background/50">© 2025 Pallde Catalog. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
