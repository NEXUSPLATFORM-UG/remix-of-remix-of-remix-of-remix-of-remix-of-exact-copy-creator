import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import { products, companyPages } from "@/data/siteContent";

const SiteHeader = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const openAuth = (m: AuthMode) => { setAuthMode(m); setAuthOpen(true); };

  const Drop = ({ label, width, pos = "left-1/2 -translate-x-1/2", children }: { label: string; width: string; pos?: string; children: React.ReactNode }) => (
    <div className="group relative">
      <button className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-primary group-hover:text-primary">
        {label} <ChevronDown size={18} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className={`invisible absolute ${pos} top-full z-50 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100`}>
        <div className={`milk-card rounded-2xl bg-background/95 p-6 shadow-2xl backdrop-blur-xl ${width}`}>{children}</div>
      </div>
    </div>
  );

  const Item = ({ to, icon: I, title, short }: { to: string; icon: any; title: string; short: string }) => (
    <Link to={to} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/60">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><I size={20} /></span>
      <span>
        <span className="block text-base font-semibold text-foreground">{title}</span>
        <span className="block text-sm font-normal text-muted-foreground">{short}</span>
      </span>
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="w-full px-6 lg:px-12 xl:px-20 h-20 flex items-center justify-between">
          <Link to="/" aria-label="LIVRA home" className="flex items-center"><BrandLogo eager className="h-8 w-auto" /></Link>
          <nav className="hidden md:flex shrink-0 items-center gap-6 xl:gap-9 text-lg font-semibold tracking-tight text-foreground">
            <Drop label="Products" width="w-[880px]" pos="-left-52">
              <div className="grid grid-cols-3 gap-1">
                {products.map((p) => <Item key={p.slug} to={`/products/${p.slug}`} icon={p.icon} title={p.title} short={p.short} />)}
              </div>
            </Drop>
            <Drop label="Company" width="w-[560px]">
              <div className="grid grid-cols-2 gap-1">
                {companyPages.map((c) => <Item key={c.slug} to={`/company/${c.slug}`} icon={c.icon} title={c.title} short={c.short} />)}
              </div>
            </Drop>
            <Link to="/availability" className="whitespace-nowrap transition-colors hover:text-primary">Availability</Link>
            <Link to="/pricing" className="whitespace-nowrap transition-colors hover:text-primary">Pricing</Link>
            <Link to="/support" className="whitespace-nowrap transition-colors hover:text-primary">Support</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 xl:gap-3">
            <button onClick={() => openAuth("login")} className="px-4 py-2 text-base rounded-xl hover:bg-muted/50 transition-colors">Log in</button>
            <button onClick={() => openAuth("register")} className="px-5 py-2.5 text-base rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Get started</button>
          </div>
        </div>
      </header>
      <AuthModal open={authOpen} mode={authMode} onModeChange={setAuthMode} onOpenChange={setAuthOpen} />
    </>
  );
};

export default SiteHeader;
