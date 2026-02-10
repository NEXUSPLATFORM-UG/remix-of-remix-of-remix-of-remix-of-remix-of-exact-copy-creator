import { Shield, Heart, Car, Home, Briefcase, ChevronRight, TrendingUp, FileText, Clock, CheckCircle, AlertTriangle, Plus, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

type InsuranceType = "health" | "auto" | "home" | "business";

const insuranceTypes: { id: InsuranceType; icon: any; label: string; desc: string; gradient: string }[] = [
  { id: "health", icon: Heart, label: "Health", desc: "Medical coverage", gradient: "stat-card-pink" },
  { id: "auto", icon: Car, label: "Auto", desc: "Vehicle protection", gradient: "stat-card-blue" },
  { id: "home", icon: Home, label: "Home", desc: "Property insurance", gradient: "stat-card-orange" },
  { id: "business", icon: Briefcase, label: "Business", desc: "Business coverage", gradient: "stat-card-purple" },
];

const defaultPolicies: Record<InsuranceType, { id: number; name: string; status: string; premium: string; coverage: string; nextPayment: string }[]> = {
  health: [
    { id: 1, name: "Health Insurance Premium", status: "Active", premium: "$120/mo", coverage: "$500,000", nextPayment: "Mar 1, 2026" },
  ],
  auto: [
    { id: 2, name: "Auto Insurance Full", status: "Active", premium: "$85/mo", coverage: "$100,000", nextPayment: "Mar 15, 2026" },
  ],
  home: [
    { id: 3, name: "Home Protection Plan", status: "Active", premium: "$200/mo", coverage: "$750,000", nextPayment: "Mar 10, 2026" },
  ],
  business: [
    { id: 4, name: "Business Liability", status: "Active", premium: "$350/mo", coverage: "$1,000,000", nextPayment: "Mar 5, 2026" },
  ],
};

const claims = [
  { id: "CLM-001", type: "Health", desc: "Medical checkup reimbursement", amount: "$450", status: "Approved", date: "Feb 5, 2026" },
  { id: "CLM-002", type: "Auto", desc: "Minor fender bender repair", amount: "$1,200", status: "Under Review", date: "Jan 28, 2026" },
  { id: "CLM-003", type: "Health", desc: "Dental procedure", amount: "$800", status: "Approved", date: "Jan 15, 2026" },
  { id: "CLM-004", type: "Business", desc: "Equipment damage", amount: "$3,500", status: "Pending", date: "Jan 10, 2026" },
];

const paymentHistory = [
  { month: "Jul", amount: 555 }, { month: "Aug", amount: 555 }, { month: "Sep", amount: 555 },
  { month: "Oct", amount: 555 }, { month: "Nov", amount: 555 }, { month: "Dec", amount: 755 },
  { month: "Jan", amount: 555 }, { month: "Feb", amount: 555 },
];

const InsurancePage = () => {
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [policies, setPolicies] = useState(defaultPolicies);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPremium, setNewPremium] = useState("");
  const [newCoverage, setNewCoverage] = useState("");

  // First-time setup
  if (!selectedType) {
    return (
      <>
        <PageHeader title="Insurance" subtitle="Choose your insurance type to get started" />
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Select Insurance Type</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose what type of insurance you'd like to manage</p>
            <div className="grid grid-cols-2 gap-4">
              {insuranceTypes.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setSelectedType(t.id)}
                    className="glass rounded-2xl p-6 text-center transition-all hover:ring-2 hover:ring-secondary group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground ${t.gradient} mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  const activeType = insuranceTypes.find(t => t.id === selectedType)!;
  const currentPolicies = policies[selectedType];
  const totalPremium = currentPolicies.reduce((s, p) => s + parseInt(p.premium.replace(/[^0-9]/g, "")), 0);
  const typeClaims = claims.filter(c => c.type.toLowerCase() === selectedType || selectedType === "business");

  const handleAddPolicy = () => {
    if (!newPolicyName || !newPremium) return;
    const newPolicy = {
      id: Date.now(), name: newPolicyName, status: "Active",
      premium: `$${newPremium}/mo`, coverage: `$${newCoverage || "0"}`,
      nextPayment: "Apr 1, 2026",
    };
    setPolicies({ ...policies, [selectedType]: [...currentPolicies, newPolicy] });
    setNewPolicyName(""); setNewPremium(""); setNewCoverage(""); setShowAddPolicy(false);
  };

  return (
    <>
      <PageHeader title="Insurance" subtitle={`${activeType.label} Insurance Dashboard`} />

      {/* Type badge + switch */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${activeType.gradient}`}>
            <activeType.icon size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{activeType.label} Insurance</p>
            <p className="text-xs text-muted-foreground">{activeType.desc}</p>
          </div>
        </div>
        <button onClick={() => setSelectedType(null)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-secondary hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          Switch Type
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<Shield size={18} />} label="Active Policies" value={`${currentPolicies.filter(p => p.status === "Active").length}`} gradient="stat-card-green" />
        <StatCardSmall icon={<DollarSign size={18} />} label="Monthly Premium" value={`$${totalPremium}`} gradient="stat-card-blue" />
        <StatCardSmall icon={<FileText size={18} />} label="Claims" value={`${typeClaims.length}`} gradient="stat-card-purple" />
        <StatCardSmall icon={<CheckCircle size={18} />} label="Approved" value={`${typeClaims.filter(c => c.status === "Approved").length}`} gradient="stat-card-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Premium Payments</h3>
              <p className="text-xs text-muted-foreground">Monthly payment history</p>
            </div>
            <p className="text-2xl font-bold text-foreground">${totalPremium}/mo</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={paymentHistory}>
              <defs>
                <linearGradient id="insGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(155 65% 45%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(155 65% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="amount" stroke="hsl(155 65% 45%)" fill="url(#insGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Coverage Summary</h3>
          <div className="space-y-4">
            {currentPolicies.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${activeType.gradient}`}>
                  <activeType.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">Coverage: {p.coverage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">My Policies</h3>
        <button onClick={() => setShowAddPolicy(true)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-primary flex items-center gap-1 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Plus size={14} /> Add Policy
        </button>
      </div>

      <div className="space-y-3 mb-5">
        {currentPolicies.map(p => {
          const isSelected = selectedPlan === p.id;
          return (
            <div key={p.id}>
              <button onClick={() => setSelectedPlan(isSelected ? null : p.id)}
                className={`w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-[hsl(0_0%_100%/0.6)] transition-all ${isSelected ? "ring-2 ring-secondary" : ""}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground ${activeType.gradient}`}>
                  <activeType.icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.premium} • Coverage: {p.coverage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-xl stat-card-green text-primary-foreground">{p.status}</span>
                  <ChevronRight size={16} className={`text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
                </div>
              </button>
              {isSelected && (
                <div className="glass rounded-b-2xl p-4 -mt-2 pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Payment</span>
                    <span className="font-medium text-foreground">{p.nextPayment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Amount</span>
                    <span className="font-medium text-foreground">{p.coverage}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-medium">Pay Now</button>
                    <button className="flex-1 glass py-2 rounded-xl text-xs font-medium text-foreground">File Claim</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claims */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Claims</h3>
        <div className="space-y-3">
          {typeClaims.map(c => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground ${
                  c.status === "Approved" ? "stat-card-green" : c.status === "Under Review" ? "stat-card-orange" : "stat-card-blue"
                }`}>
                  {c.status === "Approved" ? <CheckCircle size={14} /> : c.status === "Under Review" ? <Clock size={14} /> : <AlertTriangle size={14} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.desc}</p>
                  <p className="text-xs text-muted-foreground">{c.id} • {c.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">{c.amount}</span>
                <p className={`text-[10px] ${c.status === "Approved" ? "text-chart-green" : c.status === "Under Review" ? "text-chart-orange" : "text-primary"}`}>{c.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Policy Modal */}
      {showAddPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddPolicy(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add {activeType.label} Policy</h3>
              <button onClick={() => setShowAddPolicy(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Policy Name</label>
                <input value={newPolicyName} onChange={e => setNewPolicyName(e.target.value)} placeholder="e.g. Premium Health Plan"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Monthly Premium ($)</label>
                <input type="number" value={newPremium} onChange={e => setNewPremium(e.target.value)} placeholder="0"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Coverage Amount ($)</label>
                <input type="number" value={newCoverage} onChange={e => setNewCoverage(e.target.value)} placeholder="0"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
            </div>
            <button onClick={handleAddPolicy}
              className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm mt-4 hover:opacity-90 transition-opacity">
              Add Policy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InsurancePage;
