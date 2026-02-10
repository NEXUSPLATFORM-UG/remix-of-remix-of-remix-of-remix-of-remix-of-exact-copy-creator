import { ArrowDownToLine, CreditCard, Building2, Smartphone, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, XAxis, Tooltip, Bar, BarChart } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const methods = [
  { id: "card", icon: CreditCard, label: "Debit Card", desc: "Instant deposit from your card", gradient: "stat-card-blue" },
  { id: "bank", icon: Building2, label: "Bank Transfer", desc: "1-3 business days", gradient: "stat-card-purple" },
  { id: "mobile", icon: Smartphone, label: "Mobile Money", desc: "Instant via mobile wallet", gradient: "stat-card-cyan" },
];

const recentDeposits = [
  { name: "Debit Card Deposit", method: "Card", amount: "+$2,500.00", date: "Today", status: "Completed" },
  { name: "Bank Transfer", method: "Bank", amount: "+$5,000.00", date: "Yesterday", status: "Completed" },
  { name: "MTN Mobile Money", method: "Mobile", amount: "+$200.00", date: "Feb 8", status: "Completed" },
  { name: "Debit Card Deposit", method: "Card", amount: "+$1,000.00", date: "Feb 7", status: "Completed" },
  { name: "Airtel Money", method: "Mobile", amount: "+$150.00", date: "Feb 6", status: "Pending" },
];

const analyticsData = [
  { month: "Jul", deposit: 4200, withdraw: 2100, send: 1800, receive: 3200 },
  { month: "Aug", deposit: 5100, withdraw: 2800, send: 2200, receive: 3800 },
  { month: "Sep", deposit: 3800, withdraw: 1900, send: 1500, receive: 2900 },
  { month: "Oct", deposit: 6200, withdraw: 3200, send: 2800, receive: 4500 },
  { month: "Nov", deposit: 5500, withdraw: 2600, send: 2100, receive: 4100 },
  { month: "Dec", deposit: 7800, withdraw: 3800, send: 3200, receive: 5200 },
  { month: "Jan", deposit: 6500, withdraw: 3100, send: 2500, receive: 4800 },
  { month: "Feb", deposit: 8900, withdraw: 4200, send: 3500, receive: 5800 },
];

const depositModalMethods = [
  { id: "mobile", icon: Smartphone, label: "Mobile Money" },
  { id: "bank", icon: Building2, label: "Bank" },
  { id: "card", icon: CreditCard, label: "Card" },
];

const withdrawModalMethods = [
  { id: "mobile", icon: Smartphone, label: "Mobile Money" },
  { id: "bank", icon: Building2, label: "Bank" },
];

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

const DepositPage = () => {
  const [activeMethod, setActiveMethod] = useState("card");
  const [amount, setAmount] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositModalMethod, setDepositModalMethod] = useState("mobile");
  const [withdrawModalMethod, setWithdrawModalMethod] = useState("mobile");

  return (
    <>
      <PageHeader title="Deposit" subtitle="Add funds to your wallet" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowDownToLine size={18} />} label="Total Deposited" value="$45,792" gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value="$8,900" gradient="stat-card-green" />
        <StatCardSmall icon={<ArrowUpRight size={18} />} label="Withdrawn" value="$12,450" gradient="stat-card-orange" />
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Net Inflow" value="+$33,342" gradient="stat-card-cyan" />
      </div>

      <div className="flex gap-3 mb-5">
        <button onClick={() => setShowDepositModal(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity">
          <ArrowDownLeft size={16} /> Deposit
        </button>
        <button onClick={() => setShowWithdrawModal(true)} className="flex items-center gap-2 glass px-5 py-3 rounded-2xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <ArrowUpRight size={16} /> Withdraw
        </button>
      </div>

      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Transaction Analytics</h3>
            <p className="text-xs text-muted-foreground">Deposit, Withdraw, Send & Receive overview</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData} barGap={2}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="deposit" fill="hsl(210 100% 50%)" radius={[4, 4, 0, 0]} name="Deposit" />
            <Bar dataKey="withdraw" fill="hsl(25 95% 55%)" radius={[4, 4, 0, 0]} name="Withdraw" />
            <Bar dataKey="send" fill="hsl(260 70% 55%)" radius={[4, 4, 0, 0]} name="Send" />
            <Bar dataKey="receive" fill="hsl(155 65% 45%)" radius={[4, 4, 0, 0]} name="Receive" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          {[
            { label: "Deposit", color: "hsl(210 100% 50%)" },
            { label: "Withdraw", color: "hsl(25 95% 55%)" },
            { label: "Send", color: "hsl(260 70% 55%)" },
            { label: "Receive", color: "hsl(155 65% 45%)" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          {/* Deposit Methods with round markers */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {methods.map(m => {
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

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Deposit via {methods.find(m => m.id === activeMethod)?.label}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {activeMethod === "card" ? "Card Number" : activeMethod === "bank" ? "Bank Account" : "Phone Number"}
                </label>
                <input placeholder={activeMethod === "card" ? "Enter card number" : activeMethod === "bank" ? "Enter account number" : "Enter phone number"}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Deposit Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$0.00"
                  className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div className="flex gap-2">
                {["$50", "$100", "$500", "$1,000"].map(a => (
                  <button key={a} onClick={() => setAmount(a.replace(/[$,]/g, ""))}
                    className="flex-1 glass-input py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors">{a}</button>
                ))}
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ArrowDownToLine size={16} /> Deposit Funds
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Deposits</h3>
          <div className="space-y-3">
            {recentDeposits.map((tx, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-xl stat-card-green flex items-center justify-center text-primary-foreground">
                  <ArrowDownLeft size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.method} • {tx.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-chart-green">{tx.amount}</span>
                  <p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowDepositModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quick Deposit</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="$0.00"
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              <div className="flex gap-2">
                {["$50", "$100", "$500", "$1,000"].map(a => (
                  <button key={a} onClick={() => setDepositAmount(a.replace(/[$,]/g, ""))}
                    className="flex-1 glass-input py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors">{a}</button>
                ))}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Method</label>
                <div className="space-y-2">
                  {depositModalMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setDepositModalMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${depositModalMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={depositModalMethod === m.id} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground ${m.id === "mobile" ? "stat-card-orange" : m.id === "bank" ? "stat-card-blue" : "stat-card-purple"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setShowDepositModal(false); setDepositAmount(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ArrowDownToLine size={16} /> Deposit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="$0.00"
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Withdraw To</label>
                <div className="space-y-2">
                  {withdrawModalMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setWithdrawModalMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${withdrawModalMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={withdrawModalMethod === m.id} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground ${m.id === "mobile" ? "stat-card-orange" : "stat-card-blue"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ArrowUpRight size={16} /> Withdraw Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepositPage;
