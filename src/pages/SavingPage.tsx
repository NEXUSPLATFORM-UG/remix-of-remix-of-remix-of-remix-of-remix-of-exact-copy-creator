import { useMainCurrency } from "@/hooks/use-main-currency";
import { PiggyBank, Plus, TrendingUp, Target, Users, Briefcase, Home, User, Lock, Unlock, X, Car, Heart, GraduationCap, Plane, Building2, FileText, Receipt, DollarSign } from "lucide-react";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

type AccountType = "individual" | "business" | "family" | "group";
type SavingType = "fixed" | "temporary";

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  icon: any;
  gradient: string;
  savingType: SavingType;
}

const defaultIndividualGoals: Goal[] = [
  { id: 1, name: "Emergency Fund", target: 10000, current: 7500, icon: Heart, gradient: "stat-card-blue", savingType: "temporary" },
  { id: 2, name: "Vacation", target: 5000, current: 2100, icon: Plane, gradient: "stat-card-purple", savingType: "temporary" },
  { id: 3, name: "Build Wealth", target: 50000, current: 12300, icon: TrendingUp, gradient: "stat-card-green", savingType: "fixed" },
  { id: 4, name: "New Car", target: 25000, current: 8400, icon: Car, gradient: "stat-card-cyan", savingType: "temporary" },
  { id: 5, name: "Build Home", target: 100000, current: 15000, icon: Home, gradient: "stat-card-orange", savingType: "fixed" },
];

const defaultBusinessGoals: Goal[] = [
  { id: 10, name: "Product Development", target: 20000, current: 8500, icon: Briefcase, gradient: "stat-card-blue", savingType: "temporary" },
  { id: 11, name: "Renovation", target: 15000, current: 4200, icon: Building2, gradient: "stat-card-orange", savingType: "temporary" },
  { id: 12, name: "New Business", target: 50000, current: 18000, icon: TrendingUp, gradient: "stat-card-green", savingType: "fixed" },
  { id: 13, name: "Rent", target: 12000, current: 6000, icon: Home, gradient: "stat-card-purple", savingType: "fixed" },
  { id: 14, name: "Documents", target: 5000, current: 2800, icon: FileText, gradient: "stat-card-cyan", savingType: "temporary" },
  { id: 15, name: "Bills & Taxes", target: 8000, current: 3500, icon: Receipt, gradient: "stat-card-pink", savingType: "fixed" },
];

const defaultFamilyGoals: Goal[] = [
  { id: 20, name: "Family Vacation", target: 8000, current: 3200, icon: Plane, gradient: "stat-card-blue", savingType: "temporary" },
  { id: 21, name: "Education Fund", target: 30000, current: 12000, icon: GraduationCap, gradient: "stat-card-purple", savingType: "fixed" },
  { id: 22, name: "Home Renovation", target: 20000, current: 5500, icon: Home, gradient: "stat-card-orange", savingType: "temporary" },
  { id: 23, name: "Emergency Fund", target: 15000, current: 9800, icon: Heart, gradient: "stat-card-green", savingType: "fixed" },
];

const defaultGroupGoals: Goal[] = [
  { id: 30, name: "Group Trip", target: 10000, current: 4500, icon: Plane, gradient: "stat-card-cyan", savingType: "temporary" },
  { id: 31, name: "Investment Pool", target: 25000, current: 11200, icon: TrendingUp, gradient: "stat-card-green", savingType: "fixed" },
  { id: 32, name: "Event Fund", target: 5000, current: 2800, icon: Users, gradient: "stat-card-purple", savingType: "temporary" },
];

const accountTypes: { id: AccountType; icon: any; label: string; desc: string; gradient: string }[] = [
  { id: "individual", icon: User, label: "Individual", desc: "Personal savings", gradient: "stat-card-blue" },
  { id: "business", icon: Briefcase, label: "Business", desc: "Business savings", gradient: "stat-card-orange" },
  { id: "family", icon: Home, label: "Family Joint", desc: "Family savings", gradient: "stat-card-purple" },
  { id: "group", icon: Users, label: "Group Joint", desc: "Group savings", gradient: "stat-card-cyan" },
];

const goalIcons = [
  { icon: Heart, name: "Heart" }, { icon: Plane, name: "Plane" }, { icon: Car, name: "Car" },
  { icon: Home, name: "Home" }, { icon: TrendingUp, name: "Growth" }, { icon: GraduationCap, name: "Education" },
  { icon: Briefcase, name: "Business" }, { icon: Building2, name: "Building" }, { icon: DollarSign, name: "Money" },
];

const SavingPage = () => {
  const { cx, symbol } = useMainCurrency();
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);
  const [goals, setGoals] = useState<Record<AccountType, Goal[]>>({
    individual: defaultIndividualGoals,
    business: defaultBusinessGoals,
    family: defaultFamilyGoals,
    group: defaultGroupGoals,
  });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalType, setNewGoalType] = useState<SavingType>("temporary");
  const [newGoalIconIdx, setNewGoalIconIdx] = useState(0);

  // First-time setup: choose account type
  if (!selectedAccount) {
    return (
      <>
        <PageHeader title="Savings" subtitle="Set up your savings account to get started" />
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-6 mb-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4">
              <PiggyBank size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Choose Your Account Type</h2>
            <p className="text-sm text-muted-foreground mb-6">Select the type of savings account you'd like to create</p>
            <div className="grid grid-cols-2 gap-4">
              {accountTypes.map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.id} onClick={() => setSelectedAccount(a.id)}
                    className="glass rounded-2xl p-6 text-center transition-all hover:ring-2 hover:ring-secondary group">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground ${a.gradient} mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{a.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentGoals = goals[selectedAccount];
  const totalSavings = currentGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = currentGoals.reduce((s, g) => s + g.target, 0);
  const activeAccountInfo = accountTypes.find(a => a.id === selectedAccount)!;

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    const gradients = ["stat-card-blue", "stat-card-purple", "stat-card-cyan", "stat-card-orange", "stat-card-pink", "stat-card-green"];
    const newGoal: Goal = {
      id: Date.now(), name: newGoalName, target: parseFloat(newGoalTarget), current: 0,
      icon: goalIcons[newGoalIconIdx].icon,
      gradient: gradients[currentGoals.length % gradients.length],
      savingType: newGoalType,
    };
    setGoals({ ...goals, [selectedAccount]: [...currentGoals, newGoal] });
    setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
  };

  const toggleSavingType = (goalId: number) => {
    setGoals({
      ...goals,
      [selectedAccount]: currentGoals.map(g => g.id === goalId
        ? { ...g, savingType: g.savingType === "fixed" ? "temporary" : "fixed" }
        : g
      ),
    });
  };

  return (
    <>
      <PageHeader title="Savings" subtitle={`${activeAccountInfo.label} Account Dashboard`} />

      {/* Account badge + switch */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${activeAccountInfo.gradient}`}>
            <activeAccountInfo.icon size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{activeAccountInfo.label} Account</p>
            <p className="text-xs text-muted-foreground">{activeAccountInfo.desc}</p>
          </div>
        </div>
        <button onClick={() => setSelectedAccount(null)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-secondary hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          Switch Account
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<PiggyBank size={18} />} label="Total Savings" value={`${symbol}${totalSavings.toLocaleString()}`} gradient="stat-card-green" />
        <StatCardSmall icon={<Target size={18} />} label="Total Target" value={`${symbol}${totalTarget.toLocaleString()}`} gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="Progress" value={`${Math.round((totalSavings / totalTarget) * 100)}%`} gradient="stat-card-purple" />
        <StatCardSmall icon={<PiggyBank size={18} />} label="Active Goals" value={`${currentGoals.length}`} gradient="stat-card-orange" />
      </div>

      {/* Overview */}
      <div className="glass rounded-2xl p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{activeAccountInfo.label} Savings</p>
            <p className="text-3xl font-bold text-foreground">{symbol}{totalSavings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">of {symbol}{totalTarget.toLocaleString()} target</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <PiggyBank size={28} />
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden mt-4">
          <div className="h-full rounded-full stat-card-green transition-all" style={{ width: `${Math.min((totalSavings / totalTarget) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Goals Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Savings Goals</h3>
        <button onClick={() => setShowAddGoal(true)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-primary flex items-center gap-1 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Plus size={14} /> New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentGoals.map(g => {
          const Icon = g.icon;
          const pct = Math.round((g.current / g.target) * 100);
          return (
            <div key={g.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground {symbol}{g.gradient}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{symbol}{g.current.toLocaleString()} of {symbol}{g.target.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => toggleSavingType(g.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium ${
                    g.savingType === "fixed" ? "stat-card-orange text-primary-foreground" : "stat-card-green text-primary-foreground"
                  }`}>
                  {g.savingType === "fixed" ? <Lock size={10} /> : <Unlock size={10} />}
                  {g.savingType === "fixed" ? "Fixed" : "Flexible"}
                </button>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full {symbol}{g.gradient}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1.5">{pct}%</p>
            </div>
          );
        })}
      </div>

      {/* Floating Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddGoal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add New Goal</h3>
              <button onClick={() => setShowAddGoal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Goal Name</label>
                <input value={newGoalName} onChange={e => setNewGoalName(e.target.value)} placeholder="e.g. New Laptop"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Target Amount</label>
                <input type="number" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} placeholder={`${symbol}0.00`}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {goalIcons.map((gi, idx) => {
                    const GIcon = gi.icon;
                    return (
                      <button key={gi.name} onClick={() => setNewGoalIconIdx(idx)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newGoalIconIdx === idx ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" : "glass text-muted-foreground hover:text-foreground"}`}>
                        <GIcon size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Saving Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setNewGoalType("temporary")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${newGoalType === "temporary" ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" : "glass text-muted-foreground"}`}>
                    <Unlock size={14} /> Temporary
                  </button>
                  <button onClick={() => setNewGoalType("fixed")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${newGoalType === "fixed" ? "bg-secondary text-secondary-foreground ring-2 ring-secondary" : "glass text-muted-foreground"}`}>
                    <Lock size={14} /> Fixed
                  </button>
                </div>
              </div>
            </div>
            <button onClick={handleAddGoal}
              className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm mt-4 hover:opacity-90 transition-opacity">
              Create Goal
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SavingPage;
