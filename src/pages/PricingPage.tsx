import { useState } from "react";
import MarketingShell from "@/components/MarketingShell";
import { countries } from "@/data/siteContent";

const PricingPage = () => {
  const [code, setCode] = useState(countries[0].code);
  const c = countries.find((x) => x.code === code)!;
  return (
    <MarketingShell eyebrow="Pricing" title="Simple, transparent pricing." intro="No setup fees, no monthly fees. Pay only per successful transaction.">
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {countries.map((x) => (
          <button key={x.code} onClick={() => setCode(x.code)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition ${x.code === code ? "bg-primary text-primary-foreground" : "glass hover:bg-muted/40"}`}>
            <img src={x.flag} alt="" className="h-5 w-8 rounded object-cover" /> {x.name}
          </button>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="milk-card rounded-3xl p-8">
          <img src={c.flag} alt={`${c.name} flag`} className="mb-4 h-16 w-28 rounded-lg object-cover" />
          <h2 className="text-2xl font-bold">{c.name}</h2>
          <p className="mb-6 text-muted-foreground">Currency: {c.currency}</p>
          <p className="mb-3 font-semibold">Available methods</p>
          <div className="flex flex-wrap gap-2">{c.methods.map((m) => <span key={m} className="rounded-full bg-accent/70 px-3 py-1 text-sm">{m}</span>)}</div>
        </div>
        <div className="milk-card overflow-hidden rounded-3xl">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40"><th className="p-5 font-semibold">Method</th><th className="p-5 text-right font-semibold">Charge</th></tr></thead>
            <tbody>
              {c.pricing.map((p) => (
                <tr key={p.method} className="border-b border-border/20 last:border-0"><td className="p-5">{p.method}</td><td className="p-5 text-right font-semibold text-primary">{p.fee}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MarketingShell>
  );
};

export default PricingPage;
