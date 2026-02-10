import { Zap, Wifi, Phone, Droplets, Tv, CreditCard, X, Plus, TrendingUp, Clock, CheckCircle, ArrowDownLeft, DollarSign, Building2, Smartphone, Calendar, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const utilities = [
  { id: "electricity", icon: Zap, label: "Electricity", gradient: "stat-card-orange" },
  { id: "internet", icon: Wifi, label: "Internet", gradient: "stat-card-blue" },
  { id: "phone", icon: Phone, label: "Phone", gradient: "stat-card-purple" },
  { id: "water", icon: Droplets, label: "Water", gradient: "stat-card-cyan" },
  { id: "cable", icon: Tv, label: "Cable TV", gradient: "stat-card-pink" },
  { id: "other", icon: CreditCard, label: "Other Bills", gradient: "stat-card-green" },
];

const defaultBills = [
  { id: 1, name: "Electricity — DESCO", category: "electricity", amount: 120.00, date: "Feb 5", status: "Paid", recurring: true },
  { id: 2, name: "Internet — Comcast", category: "internet", amount: 79.99, date: "Feb 3", status: "Paid", recurring: true },
  { id: 3, name: "Phone — AT&T", category: "phone", amount: 55.00, date: "Feb 1", status: "Due", recurring: true },
  { id: 4, name: "Water — City Utility", category: "water", amount: 45.00, date: "Jan 28", status: "Paid", recurring: true },
  { id: 5, name: "Netflix", category: "cable", amount: 15.99, date: "Jan 25", status: "Paid", recurring: true },
  { id: 6, name: "Spotify", category: "other", amount: 9.99, date: "Jan 22", status: "Paid", recurring: true },
];

const providers: Record<string, string[]> = {
  electricity: ["DESCO", "DPDC", "National Grid", "Duke Energy", "PG&E"],
  internet: ["Comcast", "AT&T Fiber", "Verizon Fios", "Spectrum", "Google Fiber"],
  phone: ["AT&T", "T-Mobile", "Verizon", "Sprint", "Mint Mobile"],
  water: ["City Utility", "American Water", "Aqua America"],
  cable: ["Netflix", "Disney+", "HBO Max", "Hulu", "YouTube TV"],
  other: ["Gym Membership", "Cloud Storage", "Insurance Premium", "Rent"],
};

const paymentMethods = [
  { id: "mobile", icon: Smartphone, label: "Mobile Money" },
  { id: "bank", icon: Building2, label: "Bank" },
  { id: "card", icon: CreditCard, label: "Card" },
];

const analyticsData = [
  { month: "Jul", electricity: 115, internet: 80, phone: 55, water: 42, cable: 26, other: 10 },
  { month: "Aug", electricity: 130, internet: 80, phone: 55, water: 45, cable: 26, other: 10 },
  { month: "Sep", electricity: 118, internet: 80, phone: 55, water: 40, cable: 26, other: 20 },
  { month: "Oct", electricity: 108, internet: 80, phone: 55, water: 38, cable: 26, other: 10 },
  { month: "Nov", electricity: 125, internet: 80, phone: 55, water: 44, cable: 26, other: 10 },
  { month: "Dec", electricity: 140, internet: 80, phone: 60, water: 48, cable: 26, other: 15 },
  { month: "Jan", electricity: 135, internet: 80, phone: 55, water: 45, cable: 26, other: 10 },
  { month: "Feb", electricity: 120, internet: 80, phone: 55, water: 45, cable: 16, other: 10 },
];

const UtilitiesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("electricity");
  const [bills, setBills] = useState(defaultBills);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [payingBill, setPayingBill] = useState<typeof defaultBills[0] | null>(null);
  const [payMethod, setPayMethod] = useState("mobile");
  const [newBillName, setNewBillName] = useState("");
  const [newBillAmount, setNewBillAmount] = useState("");
  const [newBillCategory, setNewBillCategory] = useState("electricity");
  const [newBillProvider, setNewBillProvider] = useState("");
  const [newBillRecurring, setNewBillRecurring] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const totalPaid = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
  const totalDue = bills.filter(b => b.status === "Due").reduce((s, b) => s + b.amount, 0);
  const filteredBills = bills.filter(b => b.category === selectedCategory);

  const handlePayBill = (bill: typeof defaultBills[0]) => {
    setPayingBill(bill);
    setShowPayModal(true);
  };

  const confirmPay = () => {
    if (payingBill) {
      setBills(bills.map(b => b.id === payingBill.id ? { ...b, status: "Paid" } : b));
    }
    setShowPayModal(false);
    setPayingBill(null);
  };

  const handleAddBill = () => {
    if (!newBillName || !newBillAmount) return;
    setBills([...bills, {
      id: Date.now(),
      name: `${newBillName}${newBillProvider ? ` — ${newBillProvider}` : ""}`,
      category: newBillCategory,
      amount: parseFloat(newBillAmount),
      date: "Feb 10",
      status: "Due",
      recurring: newBillRecurring,
    }]);
    setNewBillName(""); setNewBillAmount(""); setNewBillProvider(""); setShowAddBill(false);
  };

  const RadioDot = ({ selected }: { selected: boolean }) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
    </div>
  );

  return (
    <>
      <PageHeader title="Utilities" subtitle="Pay your bills and manage subscriptions" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<DollarSign size={18} />} label="Total Paid" value={`$${totalPaid.toFixed(2)}`} gradient="stat-card-green" />
        <StatCardSmall icon={<Clock size={18} />} label="Due" value={`$${totalDue.toFixed(2)}`} gradient="stat-card-orange" />
        <StatCardSmall icon={<CheckCircle size={18} />} label="Bills Paid" value={`${bills.filter(b => b.status === "Paid").length}`} gradient="stat-card-blue" />
        <StatCardSmall icon={<Calendar size={18} />} label="Recurring" value={`${bills.filter(b => b.recurring).length}`} gradient="stat-card-purple" />
      </div>

      {/* Analytics */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Bill Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">Monthly breakdown by category</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analyticsData} barGap={1}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="electricity" fill="hsl(25 95% 55%)" radius={[3, 3, 0, 0]} name="Electricity" stackId="a" />
            <Bar dataKey="internet" fill="hsl(210 100% 50%)" radius={[0, 0, 0, 0]} name="Internet" stackId="a" />
            <Bar dataKey="phone" fill="hsl(260 70% 55%)" radius={[0, 0, 0, 0]} name="Phone" stackId="a" />
            <Bar dataKey="water" fill="hsl(185 75% 50%)" radius={[0, 0, 0, 0]} name="Water" stackId="a" />
            <Bar dataKey="cable" fill="hsl(330 85% 55%)" radius={[0, 0, 0, 0]} name="Cable" stackId="a" />
            <Bar dataKey="other" fill="hsl(155 65% 45%)" radius={[3, 3, 0, 0]} name="Other" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-3 justify-center flex-wrap">
          {[
            { label: "Electricity", color: "hsl(25 95% 55%)" },
            { label: "Internet", color: "hsl(210 100% 50%)" },
            { label: "Phone", color: "hsl(260 70% 55%)" },
            { label: "Water", color: "hsl(185 75% 50%)" },
            { label: "Cable", color: "hsl(330 85% 55%)" },
            { label: "Other", color: "hsl(155 65% 45%)" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category selector with round markers */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {utilities.map((u) => {
          const Icon = u.icon;
          const isActive = selectedCategory === u.id;
          return (
            <button key={u.id} onClick={() => setSelectedCategory(u.id)}
              className={`glass rounded-2xl p-4 flex items-center gap-3 transition-all ${isActive ? "ring-2 ring-secondary" : ""}`}>
              <RadioDot selected={isActive} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${u.gradient}`}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-foreground">{u.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-5">
        <button onClick={() => setShowAddBill(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Bill
        </button>
        <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Calendar size={16} /> Schedule Payment
        </button>
      </div>

      {/* Bills List for selected category */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {utilities.find(u => u.id === selectedCategory)?.label} Bills
        </h3>
        {filteredBills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No bills in this category yet</p>
        ) : (
          <div className="space-y-3">
            {filteredBills.map(b => (
              <div key={b.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground ${b.status === "Paid" ? "stat-card-green" : "stat-card-orange"}`}>
                    {b.status === "Paid" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{b.date}</p>
                      {b.recurring && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">Recurring</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">${b.amount.toFixed(2)}</p>
                    <span className={`text-[10px] font-medium ${b.status === "Paid" ? "text-chart-green" : "text-chart-orange"}`}>{b.status}</span>
                  </div>
                  {b.status === "Due" && (
                    <button onClick={() => handlePayBill(b)}
                      className="bg-primary text-primary-foreground px-3 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity">
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Recent Bills */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">All Recent Bills</h3>
        <div className="space-y-3">
          {bills.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground ${utilities.find(u => u.id === b.category)?.gradient || "stat-card-blue"}`}>
                  {(() => { const Icon = utilities.find(u => u.id === b.category)?.icon || CreditCard; return <Icon size={14} />; })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${b.amount.toFixed(2)}</p>
                <span className={`text-[10px] font-medium ${b.status === "Paid" ? "text-chart-green" : "text-chart-orange"}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Bill Modal */}
      {showPayModal && payingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowPayModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Pay Bill</h3>
              <button onClick={() => setShowPayModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">{payingBill.name}</p>
                <p className="text-3xl font-bold text-foreground mt-1">${payingBill.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Payment Method</label>
                <div className="space-y-2">
                  {paymentMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${payMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={payMethod === m.id} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground ${m.id === "mobile" ? "stat-card-orange" : m.id === "bank" ? "stat-card-blue" : "stat-card-purple"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {payMethod === "mobile" ? "Phone Number" : payMethod === "bank" ? "Account Number" : "Card Number"}
                </label>
                <input placeholder={payMethod === "mobile" ? "Enter phone number" : payMethod === "bank" ? "Enter account number" : "Enter card number"}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <button onClick={confirmPay}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Pay ${payingBill.amount.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {showAddBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddBill(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Bill</h3>
              <button onClick={() => setShowAddBill(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {utilities.map(u => {
                    const Icon = u.icon;
                    return (
                      <button key={u.id} onClick={() => { setNewBillCategory(u.id); setNewBillProvider(""); }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${newBillCategory === u.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={newBillCategory === u.id} />
                        <span className="text-xs font-medium text-foreground">{u.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Provider</label>
                <select value={newBillProvider} onChange={e => setNewBillProvider(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                  <option value="">Select provider...</option>
                  {(providers[newBillCategory] || []).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Bill Name</label>
                <input value={newBillName} onChange={e => setNewBillName(e.target.value)} placeholder="e.g. Monthly Electricity"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Amount ($)</label>
                <input type="number" value={newBillAmount} onChange={e => setNewBillAmount(e.target.value)} placeholder="0.00"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Billing Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setNewBillRecurring(true)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${newBillRecurring ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                    <RadioDot selected={newBillRecurring} />
                    <span className="text-sm font-medium text-foreground">Recurring</span>
                  </button>
                  <button onClick={() => setNewBillRecurring(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${!newBillRecurring ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                    <RadioDot selected={!newBillRecurring} />
                    <span className="text-sm font-medium text-foreground">One-time</span>
                  </button>
                </div>
              </div>
              <button onClick={handleAddBill}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Payment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Schedule Payment</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Select Bill</label>
                <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                  <option value="">Choose a bill...</option>
                  {bills.filter(b => b.status === "Due").map(b => (
                    <option key={b.id} value={b.id}>{b.name} — ${b.amount.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Payment Date</label>
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Payment Method</label>
                <div className="space-y-2">
                  {paymentMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${payMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={payMethod === m.id} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground ${m.id === "mobile" ? "stat-card-orange" : m.id === "bank" ? "stat-card-blue" : "stat-card-purple"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setShowScheduleModal(false); setScheduleDate(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Schedule Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UtilitiesPage;
