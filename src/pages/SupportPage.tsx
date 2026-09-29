import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Mail, Phone, BookOpen, ChevronDown, Wallet, Shield, CreditCard, User } from "lucide-react";
import { toast } from "sonner";
import MarketingShell from "@/components/MarketingShell";

const faqs = [
  ["How do I add money to my wallet?", "Go to Wallet → Add Money and choose Mobile Money, card or bank transfer."],
  ["How long do transfers take?", "Mobile Money and LIVRA transfers are instant. Bank transfers usually complete within minutes."],
  ["What are your fees?", "See our Pricing page for charges per country and method."],
  ["How do I verify my business?", "After sign up, onboarding asks for business type, name, location and documents."],
  ["Is my money safe?", "Yes — 256-bit encryption, two-factor sign in and licensed payment partners protect every transaction."],
  ["How do I create a payment link?", "Go to Receive → Payment Link, set an amount and share the link or QR code."],
];

const SupportPage = () => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const list = faqs.filter(([a, b]) => (a + b).toLowerCase().includes(q.toLowerCase()));
  return (
    <MarketingShell eyebrow="Support" title="How can we help?" intro="Search answers, browse topics or talk to our team 24/7.">
      <div className="glass mx-auto mb-12 flex max-w-2xl items-center gap-2 rounded-2xl px-5">
        <Search className="text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for help…" className="w-full bg-transparent py-4 text-lg outline-none" />
      </div>
      <div className="mb-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[{ i: User, t: "Account & login" }, { i: Wallet, t: "Wallet & transfers" }, { i: CreditCard, t: "Payments & cards" }, { i: Shield, t: "Security & fraud" }].map(({ i: I, t }) => (
          <button key={t} onClick={() => setQ(t.split(" ")[0])} className="milk-card rounded-2xl p-6 text-left transition hover:-translate-y-1">
            <I className="mb-4 text-primary" size={28} /><h3 className="text-lg font-semibold">{t}</h3>
          </button>
        ))}
      </div>
      <div className="mx-auto mb-16 max-w-3xl space-y-3">
        <h2 className="mb-6 text-center text-3xl font-bold">Frequently asked questions</h2>
        {list.map(([a, b], i) => (
          <div key={a} className="milk-card rounded-2xl">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left font-semibold">
              {a}<ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-5 pb-5 text-muted-foreground">{b}</p>}
          </div>
        ))}
        {!list.length && <p className="text-center text-muted-foreground">No results. Contact us below.</p>}
      </div>
      <div className="mb-16 grid gap-6 md:grid-cols-4">
        {[{ i: MessageCircle, t: "Live chat", d: "WhatsApp +256 700 000 000", h: "https://wa.me/256700000000" }, { i: Mail, t: "Email", d: "support@livra.africa", h: "mailto:support@livra.africa" }, { i: Phone, t: "Call", d: "+256 700 000 000", h: "tel:+256700000000" }, { i: BookOpen, t: "Developer docs", d: "APIs & guides", h: "/documentation" }].map(({ i: I, t, d, h }) => (
          <a key={t} href={h} className="milk-card rounded-2xl p-6 transition hover:-translate-y-1"><I className="mb-3 text-primary" /><h3 className="font-semibold">{t}</h3><p className="text-sm text-muted-foreground">{d}</p></a>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Ticket submitted — we'll reply by email."); (e.target as HTMLFormElement).reset(); }} className="milk-card mx-auto max-w-2xl space-y-4 rounded-3xl p-8">
        <h2 className="text-2xl font-bold">Submit a ticket</h2>
        <input required type="email" placeholder="Email" className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none" />
        <input required placeholder="Subject" className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none" />
        <textarea required rows={5} placeholder="Describe your issue" className="w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none" />
        <button className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground">Submit ticket</button>
        <p className="text-center text-sm text-muted-foreground">Check our <Link to="/pricing" className="text-primary">pricing</Link> or <Link to="/availability" className="text-primary">availability</Link>.</p>
      </form>
    </MarketingShell>
  );
};

export default SupportPage;
