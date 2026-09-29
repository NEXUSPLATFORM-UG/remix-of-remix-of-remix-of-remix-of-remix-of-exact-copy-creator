import { Link, useParams, Navigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import MarketingShell from "@/components/MarketingShell";
import { products } from "@/data/siteContent";

const ProductPage = () => {
  const { slug } = useParams();
  const p = products.find((x) => x.slug === slug);
  if (!p) return <Navigate to="/" replace />;
  const I = p.icon;
  return (
    <MarketingShell eyebrow={p.title} title={p.headline} intro={p.intro}>
      <div className="mx-auto mb-16 flex justify-center gap-3">
        <Link to="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">See pricing <ArrowRight size={16} /></Link>
        <Link to="/company/contact" className="rounded-xl glass px-6 py-3 font-medium hover:bg-muted/40">Talk to sales</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {p.features.map((f) => (
          <div key={f.title} className="milk-card rounded-2xl p-8">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/70 text-primary"><I size={24} /></span>
            <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
            <p className="text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">How it works</h2>
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {p.steps.map((s, i) => (
          <div key={s} className="glass-heavy rounded-2xl p-8">
            <p className="mb-4 text-5xl font-bold text-primary/30">0{i + 1}</p>
            <p className="text-lg font-medium">{s}</p>
          </div>
        ))}
      </div>
      <div className="milk-card rounded-3xl p-10">
        <h2 className="mb-6 text-2xl font-bold">Perfect for</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {p.useCases.map((u) => <span key={u} className="flex items-center gap-2 glass rounded-xl px-4 py-3"><CheckCircle2 size={18} className="text-primary" />{u}</span>)}
        </div>
      </div>
      <h2 className="mt-16 mb-6 text-center text-2xl font-bold">More products</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {products.filter((x) => x.slug !== p.slug).map((x) => (
          <Link key={x.slug} to={`/products/${x.slug}`} className="glass rounded-full px-4 py-2 text-sm hover:text-primary">{x.title}</Link>
        ))}
      </div>
    </MarketingShell>
  );
};

export default ProductPage;
