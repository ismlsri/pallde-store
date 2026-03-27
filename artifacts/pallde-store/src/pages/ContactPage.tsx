import { useT } from "@/i18n";

export default function ContactPage() {
  const t = useT();
  return (
    <div>
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">{t.nav.home}</a>
            <span>/</span>
            <span className="text-foreground font-medium">{t.contact.breadcrumb}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground">{t.contact.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
