import { useMainCurrency } from "@/hooks/use-main-currency";
import { Wallet, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, CreditCard, Plus, DollarSign, Euro, PoundSterling, JapaneseYen, Trash2, TrendingUp, X, Smartphone, Building2 } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const defaultCurrencyWallets = [
  { currency: "USD", symbol: "$", balance: 12458.0, icon: DollarSign, gradient: "stat-card-blue" },
  { currency: "EUR", symbol: "€", balance: 8234.5, icon: Euro, gradient: "stat-card-purple" },
  { currency: "GBP", symbol: "£", balance: 5100.0, icon: PoundSterling, gradient: "stat-card-cyan" },
  { currency: "JPY", symbol: "¥", balance: 250000, icon: JapaneseYen, gradient: "stat-card-orange" },
];

const defaultCards = [
  { id: 1, name: "Main Card", number: "•••• 4532", balance: "$12,458.00", expiry: "12/27", gradient: "stat-card-blue", type: "VISA" },
  { id: 2, name: "Savings Card", number: "•••• 7891", balance: "$8,234.50", expiry: "06/28", gradient: "stat-card-purple", type: "Mastercard" },
  { id: 3, name: "Business Card", number: "•••• 3456", balance: "$25,100.00", expiry: "03/26", gradient: "stat-card-cyan", type: "VISA" },
];

const transactions = [
  { name: "Netflix Subscription", amount: "-$15.99", date: "Today", type: "debit" },
  { name: "Salary Deposit", amount: "+$4,500.00", date: "Today", type: "credit" },
  { name: "Amazon Purchase", amount: "-$89.99", date: "Yesterday", type: "debit" },
  { name: "Freelance Payment", amount: "+$750.00", date: "Feb 7", type: "credit" },
  { name: "Uber Ride", amount: "-$24.50", date: "Feb 6", type: "debit" },
  { name: "Transfer from savings", amount: "+$1,200.00", date: "Feb 5", type: "credit" },
  { name: "Grocery Store", amount: "-$67.30", date: "Feb 4", type: "debit" },
];

const balanceHistory = [
  { d: "Jan", v: 35000 }, { d: "Feb", v: 38000 }, { d: "Mar", v: 36500 }, { d: "Apr", v: 41000 },
  { d: "May", v: 39000 }, { d: "Jun", v: 43000 }, { d: "Jul", v: 42000 }, { d: "Aug", v: 45000 },
  { d: "Sep", v: 44000 }, { d: "Oct", v: 46000 }, { d: "Nov", v: 44500 }, { d: "Dec", v: 45792 },
];

const availableCurrencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL"];

const addMoneyMethods = [
  { id: "mobile", icon: Smartphone, label: "Mobile Money" },
  { id: "bank", icon: Building2, label: "Bank" },
  { id: "card", icon: CreditCard, label: "Card" },
];

const withdrawMethods = [
  { id: "mobile", icon: Smartphone, label: "Mobile Money" },
  { id: "bank", icon: Building2, label: "Bank" },
];

const WalletPage = () => {
  const { cx, symbol } = useMainCurrency();
  const [showBalance, setShowBalance] = useState(true);
  const [wallets, setWallets] = useState(defaultCurrencyWallets);
  const [cards, setCards] = useState(defaultCards);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [newCurrency, setNewCurrency] = useState("");
  const [newCardName, setNewCardName] = useState("");
  const [newCardType, setNewCardType] = useState("VISA");
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [addMethod, setAddMethod] = useState("mobile");
  const [withdrawMethod, setWithdrawMethod] = useState("mobile");

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const gradients = ["stat-card-blue", "stat-card-purple", "stat-card-cyan", "stat-card-orange", "stat-card-pink", "stat-card-green"];

  const handleAddWallet = () => {
    if (!newCurrency) return;
    setWallets([...wallets, {
      currency: newCurrency, symbol: newCurrency, balance: 0,
      icon: DollarSign, gradient: gradients[wallets.length % gradients.length],
    }]);
    setNewCurrency("");
    setShowAddWallet(false);
  };

  const handleAddCard = () => {
    if (!newCardName) return;
    const num = Math.floor(1000 + Math.random() * 9000);
    setCards([...cards, {
      id: Date.now(), name: newCardName, number: `•••• ${num}`,
      balance: "$0.00", expiry: "01/30",
      gradient: gradients[cards.length % gradients.length], type: newCardType,
    }]);
    setNewCardName("");
    setShowAddCard(false);
  };

  const handleDeleteCard = (id: number) => setCards(cards.filter(c => c.id !== id));

  const RadioDot = ({ selected }: { selected: boolean }) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
    </div>
  );

  return (
    <>
      <PageHeader title="Wallet" subtitle="Manage your cards, balances & currencies" />

      {/* Main Balance */}
      <div className="glass rounded-2xl p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-3xl font-bold text-foreground">
              {showBalance ? `${symbol}${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-chart-green" /> +5.3% from last month
            </p>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="glass w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowAddMoney(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <ArrowDownLeft size={16} /> Add Money
          </button>
          <button onClick={() => setShowWithdraw(true)} className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
            <ArrowUpRight size={16} /> Withdraw
          </button>
        </div>
      </div>

      {/* Balance Chart */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Balance History</h3>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={balanceHistory}>
            <defs>
              <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210 100% 50%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(210 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="hsl(210 100% 50%)" fill="url(#walletGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Currency Wallets */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Currency Wallets</h3>
        <button onClick={() => setShowAddWallet(true)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-primary flex items-center gap-1 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Plus size={14} /> Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {wallets.map(w => {
          const Icon = w.icon;
          return (
            <div key={w.currency} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground ${w.gradient}`}>
                  <Icon size={14} />
                </div>
                <span className="text-xs font-semibold text-foreground">{w.currency}</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {showBalance ? `${w.symbol}${w.balance.toLocaleString()}` : "••••"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Cards */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">My Cards</h3>
        <button onClick={() => setShowAddCard(true)} className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-primary flex items-center gap-1 hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <Plus size={14} /> New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {cards.map(card => (
          <div key={card.id} className={`${card.gradient} rounded-2xl p-5 text-primary-foreground relative group`}>
            <button onClick={() => handleDeleteCard(card.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-[hsl(0_0%_100%/0.2)] flex items-center justify-center hover:bg-[hsl(0_0%_100%/0.3)]">
              <Trash2 size={12} />
            </button>
            <div className="flex items-center justify-between mb-8">
              <CreditCard size={24} className="opacity-80" />
              <span className="text-xs opacity-70">{card.type}</span>
            </div>
            <p className="text-lg font-mono tracking-widest mb-1">{card.number}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70">{card.name}</p>
                <p className="text-[10px] opacity-50">Exp {card.expiry}</p>
              </div>
              <p className="text-lg font-bold">{cx(card.balance)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<Wallet size={18} />} label="Active Cards" value={`${cards.length}`} gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value={cx("+$4,580")} gradient="stat-card-green" />
        <StatCardSmall icon={<ArrowUpRight size={18} />} label="Spent" value={cx("$1,245")} gradient="stat-card-orange" />
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Received" value={cx("$5,825")} gradient="stat-card-cyan" />
      </div>

      {/* Recent Transactions */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === "credit" ? "stat-card-green" : "stat-card-orange"} text-primary-foreground`}>
                  {tx.type === "credit" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-chart-green" : "text-foreground"}`}>
                {cx(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddMoney(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Money</h3>
              <button onClick={() => setShowAddMoney(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Select Method</label>
                <div className="space-y-2">
                  {addMoneyMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setAddMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${addMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={addMethod === m.id} />
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
                  {addMethod === "mobile" ? "Phone Number" : addMethod === "bank" ? "Account Number" : "Card Number"}
                </label>
                <input placeholder={addMethod === "mobile" ? "Enter phone number" : addMethod === "bank" ? "Enter account number" : "Enter card number"}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <input type="number" placeholder="Enter amount" value={addAmount} onChange={e => setAddAmount(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              <div className="flex gap-2">
                {["$50", "$100", "$500", "$1,000"].map(cx).map(a => (
                  <button key={a} onClick={() => setAddAmount(a.replace(/[$,]/g, ""))}
                    className="flex-1 glass-input py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors">{a}</button>
                ))}
              </div>
              <button onClick={() => { setShowAddMoney(false); setAddAmount(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowWithdraw(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Withdraw</h3>
              <button onClick={() => setShowWithdraw(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Withdraw To</label>
                <div className="space-y-2">
                  {withdrawMethods.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setWithdrawMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${withdrawMethod === m.id ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                        <RadioDot selected={withdrawMethod === m.id} />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground ${m.id === "mobile" ? "stat-card-orange" : "stat-card-blue"}`}>
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
                  {withdrawMethod === "mobile" ? "Phone Number" : "Account Number"}
                </label>
                <input placeholder={withdrawMethod === "mobile" ? "Enter phone number" : "Enter account number"}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <input type="number" placeholder="Enter amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              <button onClick={() => { setShowWithdraw(false); setWithdrawAmount(""); }}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Wallet Modal */}
      {showAddWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddWallet(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Currency Wallet</h3>
              <button onClick={() => setShowAddWallet(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Select Currency</label>
                <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                  <option value="">Choose currency...</option>
                  {availableCurrencies.filter(c => !wallets.find(w => w.currency === c)).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddWallet}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Add Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddCard(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Card</h3>
              <button onClick={() => setShowAddCard(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Card Name</label>
                <input value={newCardName} onChange={e => setNewCardName(e.target.value)} placeholder="e.g. Travel Card"
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Card Type</label>
                <div className="space-y-2">
                  {["VISA", "Mastercard", "Amex"].map(t => (
                    <button key={t} onClick={() => setNewCardType(t)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${newCardType === t ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass"}`}>
                      <RadioDot selected={newCardType === t} />
                      <span className="text-sm font-medium text-foreground">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddCard}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
                Create Card
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletPage;
