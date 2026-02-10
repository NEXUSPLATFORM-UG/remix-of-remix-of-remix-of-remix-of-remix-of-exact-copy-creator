import { Send, User, DollarSign, ArrowRight, Smartphone, Building2, Users, TrendingUp, ArrowUpRight, Clock, X } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const recentContacts = [
  { name: "Alice J.", avatar: "A" },
  { name: "David C.", avatar: "D" },
  { name: "Sarah K.", avatar: "S" },
  { name: "James P.", avatar: "J" },
  { name: "Maria S.", avatar: "M" },
];

const sendMethods = [
  { id: "livra", icon: Users, label: "Livra User", desc: "Send to any Livra user", gradient: "stat-card-blue" },
  { id: "mobile", icon: Smartphone, label: "Mobile Money", desc: "MTN, Airtel, Vodafone", gradient: "stat-card-orange" },
  { id: "bank", icon: Building2, label: "Bank Transfer", desc: "Direct bank deposit", gradient: "stat-card-cyan" },
];

const recentSends = [
  { name: "Alice Johnson", method: "Livra", amount: "-$250.00", date: "Today", status: "Completed" },
  { name: "MTN Mobile", method: "Mobile Money", amount: "-$100.00", date: "Today", status: "Completed" },
  { name: "Chase Bank", method: "Bank", amount: "-$1,500.00", date: "Yesterday", status: "Completed" },
  { name: "David Chen", method: "Livra", amount: "-$75.00", date: "Feb 8", status: "Completed" },
  { name: "Airtel Money", method: "Mobile Money", amount: "-$50.00", date: "Feb 7", status: "Pending" },
  { name: "Sarah Kim", method: "Livra", amount: "-$320.00", date: "Feb 6", status: "Completed" },
];

const previousUsers = [
  { name: "Alice Johnson", method: "Livra", count: 12 },
  { name: "David Chen", method: "Livra", count: 8 },
  { name: "MTN Mobile (077xxx)", method: "Mobile Money", count: 6 },
  { name: "Chase Bank (xxx432)", method: "Bank", count: 4 },
  { name: "Sarah Kim", method: "Livra", count: 3 },
];

const sendAnalytics = [
  { month: "Jul", amount: 1200 }, { month: "Aug", amount: 1800 }, { month: "Sep", amount: 1500 },
  { month: "Oct", amount: 2200 }, { month: "Nov", amount: 1900 }, { month: "Dec", amount: 2500 },
  { month: "Jan", amount: 2100 }, { month: "Feb", amount: 2800 },
];

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

const SendPage = () => {
  const [activeMethod, setActiveMethod] = useState("livra");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);

  return (
    <>
      <PageHeader title="Send Money" subtitle="Transfer funds to anyone, anywhere" />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<Send size={18} />} label="Total Sent" value="$12,450" gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value="$2,800" gradient="stat-card-cyan" />
        <StatCardSmall icon={<Users size={18} />} label="Recipients" value="24" gradient="stat-card-purple" />
        <StatCardSmall icon={<Clock size={18} />} label="Pending" value="$50.00" gradient="stat-card-orange" />
      </div>

      {/* Analytics Chart */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Send Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">Monthly transaction volume</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={sendAnalytics}>
            <defs>
              <linearGradient id="sendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210 100% 50%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(210 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Area type="monotone" dataKey="amount" stroke="hsl(210 100% 50%)" fill="url(#sendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Send Form */}
        <div className="lg:col-span-2">
          {/* Send Methods with round markers */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {sendMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setActiveMethod(m.id)}
                  className={`glass rounded-2xl p-4 text-left transition-all ${activeMethod === m.id ? "ring-2 ring-secondary" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioDot selected={activeMethod === m.id} />
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${m.gradient} mb-2`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Recent Contacts */}
          <div className="glass rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-3">Recent Contacts</p>
            <div className="flex gap-3 mb-5">
              {recentContacts.map(c => (
                <button key={c.name} onClick={() => setRecipient(c.name)} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    {c.avatar}
                  </div>
                  <span className="text-xs text-muted-foreground">{c.name}</span>
                </button>
              ))}
              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <User size={18} />
                </div>
                <span className="text-xs text-muted-foreground">New</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {activeMethod === "livra" ? "Livra Username or Email" : activeMethod === "mobile" ? "Phone Number" : "Bank Account"}
                </label>
                <input value={recipient} onChange={e => setRecipient(e.target.value)}
                  placeholder={activeMethod === "livra" ? "Enter username or email" : activeMethod === "mobile" ? "Enter phone number" : "Enter account number"}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Note (optional)</label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="What's this for?"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
            </div>

            <button onClick={() => setShowSendModal(true)}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-4">
              Send Money <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Frequently Sent To */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Frequent Recipients</h3>
          <div className="space-y-3">
            {previousUsers.map((u, i) => (
              <button key={i} onClick={() => setRecipient(u.name)} className="w-full flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-[hsl(0_0%_100%/0.3)] rounded-lg px-2 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-xs">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.method} • {u.count} sends</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Send Transactions */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Send Transactions</h3>
        <div className="space-y-3">
          {recentSends.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl stat-card-blue flex items-center justify-center text-primary-foreground">
                  <ArrowUpRight size={14} />
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

      {/* Floating Send Confirmation Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowSendModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm Send</h3>
              <button onClick={() => setShowSendModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium text-foreground">{recipient || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground">${amount || "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium text-foreground">{sendMethods.find(m => m.id === activeMethod)?.label}</span>
              </div>
              {note && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Note</span>
                  <span className="font-medium text-foreground">{note}</span>
                </div>
              )}
            </div>
            <button onClick={() => { setShowSendModal(false); setAmount(""); setRecipient(""); setNote(""); }}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Send size={16} /> Confirm & Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SendPage;
