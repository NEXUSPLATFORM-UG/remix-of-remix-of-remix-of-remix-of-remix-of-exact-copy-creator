import { BookOpen, Search, ChevronRight, Code2, Zap, Shield, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const sections = [
  { icon: Zap, title: "Getting Started", desc: "Quick start guide and setup instructions", articles: 8 },
  { icon: Code2, title: "API Reference", desc: "Complete API documentation with examples", articles: 24 },
  { icon: CreditCard, title: "Payments", desc: "Send, receive, and manage transactions", articles: 12 },
  { icon: Shield, title: "Security", desc: "Authentication, encryption, and best practices", articles: 6 },
];

const popular = [
  "How to authenticate API requests",
  "Setting up webhooks",
  "Currency conversion guide",
  "Error handling best practices",
  "Rate limits and quotas",
];

const DocumentationPage = () => (
  <>
    <PageHeader title="Documentation" subtitle="Guides, references, and resources" />

    <div className="glass rounded-2xl p-6 mb-5">
      <div className="relative max-w-md mx-auto">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search documentation..." className="glass-input w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <button key={s.title} className="glass rounded-2xl p-5 flex items-start gap-4 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground mb-1">{s.desc}</p>
              <span className="text-[10px] text-primary font-medium">{s.articles} articles</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground mt-1" />
          </button>
        );
      })}
    </div>

    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Popular Articles</h3>
      <div className="space-y-2">
        {popular.map((p) => (
          <button key={p} className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[hsl(0_0%_100%/0.3)] transition-colors text-left">
            <BookOpen size={14} className="text-primary shrink-0" />
            <span className="text-sm text-foreground">{p}</span>
            <ChevronRight size={14} className="text-muted-foreground ml-auto" />
          </button>
        ))}
      </div>
    </div>
  </>
);

export default DocumentationPage;
