import { ArrowLeftRight, ArrowDown, Building2, Users, Smartphone, Landmark, PiggyBank, TrendingUp, Clock, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const transferMethods = [
  { id: "bank", icon: Building2, label: "Bank Account", desc: "Transfer to bank", gradient: "stat-card-blue" },
  { id: "livra", icon: Users, label: "Livra User", desc: "Internal transfer", gradient: "stat-card-purple" },
  { id: "mobile", icon: Smartphone, label: "Mobile Money", desc: "MTN, Airtel", gradient: "stat-card-orange" },
  { id: "western", icon: Landmark, label: "Western Union", desc: "Global transfers", gradient: "stat-card-cyan" },
  { id: "saving", icon: PiggyBank, label: "Savings Account", desc: "Move to savings", gradient: "stat-card-green" },
];

const accounts = [
  { name: "Main Wallet", balance: "$12,458.00" },
  { name: "Savings Account", balance: "$8,234.50" },
  { name: "Business Account", balance: "$25,100.00" },
];

const recentTransfers = [
  { name: "Chase Bank (xxx432)", method: "Bank", amount: "$2,000.00", date: "Today", status: "Completed" },
  { name: "David Chen", method: "Livra", amount: "$500.00", date: "Yesterday", status: "Completed" },
  { name: "MTN Mobile", method: "Mobile Money", amount: "$150.00", date: "Feb 8", status: "Completed" },
  { name: "Western Union - UK", method: "Western Union", amount: "$1,200.00", date: "Feb 7", status: "Pending" },
  { name: "Emergency Fund", method: "Savings", amount: "$300.00", date: "Feb 6", status: "Completed" },
];

const frequentRecipients = [
  { name: "Chase Bank", method: "Bank", count: 8 },
  { name: "David Chen", method: "Livra", count: 12 },
  { name: "MTN Mobile", method: "Mobile", count: 6 },
  { name: "Western Union UK", method: "Western Union", count: 3 },
];

const transferAnalytics = [
  { month: "Jul", amount: 3200 }, { month: "Aug", amount: 4100 }, { month: "Sep", amount: 3500 },
  { month: "Oct", amount: 5200 }, { month: "Nov", amount: 4800 }, { month: "Dec", amount: 6100 },
  { month: "Jan", amount: 5500 }, { month: "Feb", amount: 7200 },
];

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

const TransferPage = () => {
  const [activeMethod, setActiveMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");

  return (
    <>
      <PageHeader title="Transfer" subtitle="Move funds between accounts & services" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowLeftRight size={18} />} label="Total Transferred" value="$18,320" gradient="stat-card-blue" />
        <StatCardSmall icon={<Building2 size={18} />} label="To Banks" value="$8,500" gradient="stat-card-cyan" />
        <StatCardSmall icon={<Smartphone size={18} />} label="Mobile Money" value="$3,200" gradient="stat-card-orange" />
        <StatCardSmall icon={<Landmark size={18} />} label="Western Union" value="$6,620" gradient="stat-card-purple" />
      </div>

      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Transfer Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">Monthly transfer volume</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={transferAnalytics}>
            <defs>
              <linearGradient id="transferGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(260 70% 55%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(260 70% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Area type="monotone" dataKey="amount" stroke="hsl(260 70% 55%)" fill="url(#transferGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          {/* Transfer Methods with round markers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
            {transferMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setActiveMethod(m.id)}
                  className={`glass rounded-2xl p-4 text-center transition-all ${activeMethod === m.id ? "ring-2 ring-secondary" : ""}`}>
                  <div className="flex justify-center mb-2">
                    <RadioDot selected={activeMethod === m.id} />
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${m.gradient} mx-auto mb-2`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Transfer via {transferMethods.find(m => m.id === activeMethod)?.label}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
                <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                  {accounts.map(a => <option key={a.name}>{a.name} — {a.balance}</option>)}
                </select>
              </div>

              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <ArrowDown size={18} />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {activeMethod === "bank" ? "Bank Account Number" :
                   activeMethod === "livra" ? "Livra Username" :
                   activeMethod === "mobile" ? "Phone Number" :
                   activeMethod === "western" ? "Western Union Recipient" : "Savings Account"}
                </label>
                <input placeholder={
                  activeMethod === "bank" ? "Enter account number" :
                  activeMethod === "livra" ? "Enter username or email" :
                  activeMethod === "mobile" ? "Enter phone number" :
                  activeMethod === "western" ? "Enter recipient details" : "Select savings account"
                } className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$0.00"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>

              <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <ArrowLeftRight size={16} /> Transfer Now
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Frequent Recipients</h3>
            <div className="space-y-3">
              {frequentRecipients.map((u, i) => (
                <button key={i} className="w-full flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-[hsl(0_0%_100%/0.3)] rounded-lg px-2 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.method} • {u.count} transfers</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Your Accounts</h3>
            <div className="space-y-3">
              {accounts.map(a => (
                <div key={a.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{a.name}</span>
                  <span className="text-sm font-semibold text-foreground">{a.balance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transfers</h3>
        <div className="space-y-3">
          {recentTransfers.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl stat-card-purple flex items-center justify-center text-primary-foreground">
                  <ArrowLeftRight size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.method} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">{tx.amount}</span>
                <p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowTransferModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quick Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input type="number" value={modalAmount} onChange={e => setModalAmount(e.target.value)} placeholder="$0.00"
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              <button onClick={() => { setShowTransferModal(false); setModalAmount(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Transfer Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferPage;
