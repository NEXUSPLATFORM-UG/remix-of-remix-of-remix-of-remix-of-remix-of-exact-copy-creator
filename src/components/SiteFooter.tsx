import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const cols = [
  { h: "Product", l: [["Mobile Money", "/products/mobile-money"], ["Card Payments", "/products/card-payments"], ["Payment Links", "/products/payment-links"], ["POS Machines", "/products/pos-machine"], ["Payroll", "/products/payroll"]] },
  { h: "Company", l: [["About Us", "/company/about"], ["Partners", "/company/partners"], ["Blog", "/company/blog"], ["Careers", "/company/careers"], ["Contact", "/company/contact"]] },
  { h: "Resources", l: [["Availability", "/availability"], ["Pricing", "/pricing"], ["Support", "/support"], ["Developers", "/documentation"]] },
];

const SiteFooter = () => (
  <footer className="w-full px-4 lg:px-8 pb-6">
    <div className="milk-card rounded-[2rem] backdrop-blur-xl">
      <div className="w-full px-6 lg:px-12 xl:px-16 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" aria-label="LIVRA home" className="mb-4 inline-flex items-center"><BrandLogo className="h-9 w-auto" /></Link>
          <p className="text-sm text-muted-foreground max-w-sm">One wallet for Mobile Money, bank transfers, cards, bills and savings across Africa.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-semibold mb-4 text-sm">{c.h}</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {c.l.map(([t, h]) => <li key={t}><Link to={h} className="hover:text-foreground transition-colors">{t}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary/10">
        <div className="w-full px-6 lg:px-12 xl:px-16 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LIVRA. All rights reserved.</p>
          <p>Payments powered by licensed partners.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
