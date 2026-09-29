import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import MarketingShell from "@/components/MarketingShell";
import { countries } from "@/data/siteContent";

const allMethods = Array.from(new Set(countries.flatMap((c) => c.methods)));

const AvailabilityPage = () => {
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("");
  const list = countries.filter((c) =>
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.methods.some((m) => m.toLowerCase().includes(q.toLowerCase()))) &&
    (!method || c.methods.includes(method)));

  return (
    <MarketingShell eyebrow="Availability" title="Where LIVRA works." intro="Search countries and payment methods available today — or request your country.">
      <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <div className="glass flex flex-1 items-center gap-2 rounded-xl px-4">
          <Search size={18} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country or method…" className="w-full bg-transparent py-3 outline-none" />
        </div>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="glass rounded-xl px-4 py-3 outline-none">
          <option value="">All methods</option>
          {allMethods.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <div key={c.code} className="milk-card rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-4">
              <img src={c.flag} alt={`${c.name} flag`} className="h-12 w-20 rounded-lg object-cover" />
              <div><h3 className="text-xl font-semibold">{c.name}</h3><p className="text-sm text-muted-foreground">{c.currency} · <span className="text-primary">{c.status}</span></p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.methods.map((m) => <span key={m} className="rounded-full bg-accent/70 px-3 py-1 text-sm">{m}</span>)}
            </div>
          </div>
        ))}
        {!list.length && <p className="col-span-full text-center text-muted-foreground">No countries match your search.</p>}
      </div>
      <div className="mx-auto mt-16 max-w-2xl milk-card rounded-3xl p-8">
        <h2 className="mb-2 text-2xl font-bold">Don't see your country?</h2>
        <p className="mb-6 text-muted-foreground">Request it and we'll notify you when LIVRA launches there.</p>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Request received — we'll let you know!"); (e.target as HTMLFormElement).reset(); }} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input required placeholder="Country" className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none" />
          <input required type="email" placeholder="Email" className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none" />
          <button className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground">Request</button>
        </form>
      </div>
    </MarketingShell>
  );
};

export default AvailabilityPage;
