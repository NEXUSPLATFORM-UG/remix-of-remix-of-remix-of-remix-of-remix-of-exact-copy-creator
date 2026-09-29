import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const MarketingShell = ({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) => {
  useEffect(() => { window.scrollTo(0, 0); document.title = `${title} | LIVRA`; }, [title]);
  return (
    <div className="min-h-screen liquid-gradient-bg text-foreground">
      <SiteHeader />
      <section className="w-full px-6 lg:px-12 xl:px-20 pt-20 pb-12 text-center">
        <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">{title}</h1>
        {intro && <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      </section>
      <main className="w-full px-6 lg:px-12 xl:px-20 pb-20">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default MarketingShell;
