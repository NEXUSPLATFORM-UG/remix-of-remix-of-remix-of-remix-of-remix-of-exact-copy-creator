import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Phone, MapPin, Target, Heart, Zap } from "lucide-react";
import { toast } from "sonner";
import MarketingShell from "@/components/MarketingShell";

const input = "w-full rounded-xl border border-border/60 bg-background/70 px-4 py-3 outline-none focus:border-primary";

const ContactForm = ({ cta = "Send message" }: { cta?: string }) => {
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Thanks! Our team will reach out shortly."); (e.target as HTMLFormElement).reset(); }} className="milk-card space-y-4 rounded-3xl p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" className={input} />
        <input required type="email" placeholder="Email" className={input} />
      </div>
      <input placeholder="Company / Business" className={input} />
      <textarea required rows={5} placeholder="How can we help?" className={input} />
      <button className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:opacity-90">{sent ? "Sent ✓ — send another" : cta}</button>
    </form>
  );
};

const pages: Record<string, { eyebrow: string; title: string; intro: string; body: () => JSX.Element }> = {
  about: { eyebrow: "About Us", title: "Building the payment rails for Africa.", intro: "LIVRA helps people and businesses send, receive and grow money — across networks, banks and borders.",
    body: () => (
      <div className="grid gap-6 md:grid-cols-3">
        {[{ i: Target, t: "Our mission", d: "Make every payment in Africa instant, affordable and accessible to everyone." }, { i: Heart, t: "Our values", d: "Trust, simplicity and customer obsession guide everything we build." }, { i: Zap, t: "Our impact", d: "Over 50,000 users and $5 trillion+ processed across seven countries." }].map(({ i: I, t, d }) => (
          <div key={t} className="milk-card rounded-2xl p-8"><I className="mb-4 text-primary" size={28} /><h3 className="mb-2 text-xl font-semibold">{t}</h3><p className="text-muted-foreground">{d}</p></div>
        ))}
      </div>) },
  partners: { eyebrow: "Partners", title: "Powered by trusted partners.", intro: "We work with leading mobile networks, banks and card schemes to move money safely.",
    body: () => (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["MTN Mobile Money", "Airtel Money", "M-Pesa", "Visa", "Mastercard", "Stanbic Bank", "Centenary Bank", "Equity Bank", "Absa", "Apple Pay", "Google Pay", "PayPal"].map((p) => (
          <div key={p} className="milk-card flex h-28 items-center justify-center rounded-2xl text-lg font-semibold">{p}</div>
        ))}
        <div className="sm:col-span-2 lg:col-span-4 mt-8"><h2 className="mb-4 text-center text-2xl font-bold">Become a partner</h2><div className="mx-auto max-w-2xl"><ContactForm cta="Apply to partner" /></div></div>
      </div>) },
  blog: { eyebrow: "Blog", title: "News, guides and insights.", intro: "Stories and tips on payments, business growth and fintech in Africa.",
    body: () => (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[["Guide", "How to accept Mobile Money in your shop"], ["Product", "Introducing LIVRA payment links"], ["Business", "5 ways POS systems grow your sales"], ["Savings", "Running a SACCO digitally"], ["Payroll", "Paying staff on time with Mobile Money"], ["Company", "LIVRA expands to seven countries"]].map(([tag, t], i) => (
          <article key={t} className="milk-card rounded-2xl p-8 transition hover:-translate-y-1">
            <span className="text-xs font-medium text-primary">{tag}</span>
            <h3 className="mt-2 mb-3 text-xl font-semibold">{t}</h3>
            <p className="text-sm text-muted-foreground">{5 + i} min read</p>
          </article>
        ))}
      </div>) },
  contact: { eyebrow: "Contact Us", title: "Let's talk.", intro: "Questions, sales or partnerships — our team is ready to help.",
    body: () => (
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[{ i: Mail, t: "support@livra.africa" }, { i: Phone, t: "+256 700 000 000" }, { i: MapPin, t: "Kampala, Uganda" }].map(({ i: I, t }) => (
            <div key={t} className="milk-card flex items-center gap-4 rounded-2xl p-6"><I className="text-primary" /> <span className="text-lg">{t}</span></div>
          ))}
        </div>
        <ContactForm />
      </div>) },
  careers: { eyebrow: "Careers", title: "Help us move Africa's money.", intro: "Join a team building products used by thousands every day.",
    body: () => (
      <div className="space-y-4">
        {[["Senior Backend Engineer", "Engineering", "Kampala / Remote"], ["Product Designer", "Design", "Remote"], ["Sales Executive", "Sales", "Nairobi"], ["Customer Support Agent", "Support", "Kampala"], ["Compliance Officer", "Legal", "Lagos"]].map(([r, d, l]) => (
          <div key={r} className="milk-card flex flex-col justify-between gap-3 rounded-2xl p-6 sm:flex-row sm:items-center">
            <div><h3 className="text-lg font-semibold">{r}</h3><p className="text-sm text-muted-foreground">{d} · {l}</p></div>
            <a href="mailto:careers@livra.africa" className="rounded-xl bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground">Apply</a>
          </div>
        ))}
      </div>) },
};

const CompanyPage = () => {
  const { slug = "" } = useParams();
  const p = pages[slug];
  if (!p) return <Navigate to="/" replace />;
  return <MarketingShell eyebrow={p.eyebrow} title={p.title} intro={p.intro}><p.body /></MarketingShell>;
};

export default CompanyPage;
