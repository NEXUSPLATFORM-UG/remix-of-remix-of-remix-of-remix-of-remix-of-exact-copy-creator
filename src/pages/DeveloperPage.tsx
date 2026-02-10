import { Code2, Key, Terminal, Copy, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const apiKeys = [
  { name: "Production", key: "sk_live_•••••••••••••4f2a", created: "Jan 15, 2025", status: "Active" },
  { name: "Test", key: "sk_test_•••••••••••••8b3c", created: "Dec 20, 2024", status: "Active" },
];

const endpoints = [
  { method: "POST", path: "/api/v1/send", desc: "Send money to a recipient" },
  { method: "GET", path: "/api/v1/balance", desc: "Get wallet balance" },
  { method: "POST", path: "/api/v1/convert", desc: "Convert currencies" },
  { method: "GET", path: "/api/v1/transactions", desc: "List transactions" },
];

const DeveloperPage = () => (
  <>
    <PageHeader title="Developer" subtitle="API keys and integration tools" />

    <div className="glass rounded-2xl p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">API Keys</h3>
        <button className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-primary flex items-center gap-1 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Key size={12} /> Generate Key
        </button>
      </div>
      <div className="space-y-3">
        {apiKeys.map((k) => (
          <div key={k.name} className="glass-input rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{k.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{k.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="glass w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Copy size={14} />
              </button>
              <button className="glass w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">API Endpoints</h3>
      <div className="space-y-2">
        {endpoints.map((e) => (
          <div key={e.path} className="glass-input rounded-xl p-3 flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
              e.method === "POST" ? "stat-card-blue text-primary-foreground" : "stat-card-green text-primary-foreground"
            }`}>{e.method}</span>
            <code className="text-sm font-mono text-foreground flex-1">{e.path}</code>
            <span className="text-xs text-muted-foreground hidden md:block">{e.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default DeveloperPage;
