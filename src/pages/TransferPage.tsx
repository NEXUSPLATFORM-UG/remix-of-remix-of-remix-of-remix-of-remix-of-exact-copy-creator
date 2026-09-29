import { useMainCurrency } from "@/hooks/use-main-currency";
import { ArrowLeftRight, ArrowDown, Building2, Users, Smartphone, PiggyBank, TrendingUp, Clock, X, ArrowUpRight, Loader2, CheckCircle, AlertCircle, ChevronRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";
import { toast } from "@/hooks/use-toast";

const API_BASE = "https://api.livrauganda.workers.dev/api/products";

interface Product {
  name: string;
  code: string;
  category: string;
  has_price_list: boolean;
  has_choice_list: boolean;
  billable: boolean;
}

interface PriceItem {
  code: string;
  name: string;
  price: number;
}

interface ChoiceItem {
  id: string;
  name: string;
}

const transferMethods = [
  { id: "bank", icon: Building2, label: "Bank Transfer", desc: "Via Relworx", gradient: "stat-card-blue" },
  { id: "livra", icon: Users, label: "Livra User", desc: "Internal transfer", gradient: "stat-card-purple" },
  { id: "mobile", icon: Smartphone, label: "Mobile Money", desc: "MTN, Airtel", gradient: "stat-card-orange" },
  { id: "saving", icon: PiggyBank, label: "Savings Account", desc: "Move to savings", gradient: "stat-card-green" },
];

const savingsGoals = [
  { id: 1, name: "Emergency Fund", current: 7500, target: 10000 },
  { id: 2, name: "Vacation", current: 2100, target: 5000 },
  { id: 3, name: "Build Wealth", current: 12300, target: 50000 },
  { id: 4, name: "New Car", current: 8400, target: 25000 },
  { id: 5, name: "Build Home", current: 15000, target: 100000 },
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
  { name: "Emergency Fund", method: "Savings", amount: "UGX 1,200", date: "Feb 7", status: "Completed" },
  { name: "Emergency Fund", method: "Savings", amount: "$300.00", date: "Feb 6", status: "Completed" },
];

const frequentRecipients = [
  { name: "Chase Bank", method: "Bank", count: 8 },
  { name: "David Chen", method: "Livra", count: 12 },
  { name: "MTN Mobile", method: "Mobile", count: 6 },
  { name: "Emergency Fund", method: "Savings", count: 3 },
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
  const { cx, symbol } = useMainCurrency();
  const [activeMethod, setActiveMethod] = useState("bank");
  const [amount, setAmount] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");

  // Relworx bank transfer state
  const [bankProducts, setBankProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [choiceList, setChoiceList] = useState<ChoiceItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Purchase flow
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [validating, setValidating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [validationRef, setValidationRef] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [purchaseStep, setPurchaseStep] = useState<"form" | "validated" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch only BANK_TRANSFERS products from Relworx
  useEffect(() => {
    setLoadingProducts(true);
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBankProducts(data.products.filter((p: Product) => p.category === "BANK_TRANSFERS"));
        }
      })
      .catch(() => toast({ title: "Error", description: "Failed to load bank transfer products", variant: "destructive" }))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setPriceList([]);
    setChoiceList([]);
    setLoadingDetails(true);

    const promises: Promise<void>[] = [];
    if (product.has_price_list) {
      promises.push(
        fetch(`${API_BASE}/price-list?code=${product.code}`)
          .then(res => res.json())
          .then(data => { if (data.success) setPriceList(data.price_list); })
      );
    }
    if (product.has_choice_list) {
      promises.push(
        fetch(`${API_BASE}/choice-list?code=${product.code}`)
          .then(res => res.json())
          .then(data => { if (data.success) setChoiceList(data.choice_list); })
      );
    }
    await Promise.all(promises).catch(() => {});
    setLoadingDetails(false);
  };

  const openPurchase = (priceItem?: PriceItem) => {
    setSelectedPrice(priceItem || null);
    if (priceItem) setPurchaseAmount(String(priceItem.price));
    else setPurchaseAmount("");
    setPhoneNumber("");
    setContactPhone("");
    setSelectedChoice("");
    setValidationRef("");
    setCustomerName("");
    setPurchaseStep("form");
    setErrorMsg("");
    setShowPurchaseModal(true);
  };

  const handleValidate = async () => {
    if (!phoneNumber || !purchaseAmount || !selectedProduct) return;
    setValidating(true);
    setErrorMsg("");
    try {
      const body: Record<string, string | number> = {
        msisdn: phoneNumber,
        amount: parseFloat(purchaseAmount),
        product_code: selectedPrice?.code || selectedProduct.code,
        contact_phone: contactPhone || phoneNumber,
      };
      if (selectedChoice) body.location_id = selectedChoice;

      const res = await fetch(`${API_BASE}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setValidationRef(data.validation_reference);
        setCustomerName(data.customer_name || "");
        setPurchaseStep("validated");
      } else {
        setErrorMsg(data.message || "Validation failed");
        setPurchaseStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setPurchaseStep("error");
    } finally {
      setValidating(false);
    }
  };

  const handlePurchase = async () => {
    if (!validationRef) return;
    setPurchasing(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validation_reference: validationRef }),
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseStep("success");
        toast({ title: "Success", description: data.message || "Transfer in progress" });
      } else {
        setErrorMsg(data.message || "Transfer failed");
        setPurchaseStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setPurchaseStep("error");
    } finally {
      setPurchasing(false);
    }
  };

  // Filter bank transfer products by search
  const filteredBankProducts = bankProducts.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Transfer" subtitle="Move funds between accounts & services" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowLeftRight size={18} />} label="Total Transferred" value={cx("$18,320")} gradient="stat-card-blue" />
        <StatCardSmall icon={<Building2 size={18} />} label="To Banks" value={cx("$8,500")} gradient="stat-card-cyan" />
        <StatCardSmall icon={<Smartphone size={18} />} label="Mobile Money" value={cx("$3,200")} gradient="stat-card-orange" />
        <StatCardSmall icon={<PiggyBank size={18} />} label="To Savings" value={cx("UGX 6,620")} gradient="stat-card-purple" />
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
          {/* Transfer Methods */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {transferMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => { setActiveMethod(m.id); setSelectedProduct(null); setSearchQuery(""); }}
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

          {/* Bank Transfer via Relworx */}
          {activeMethod === "bank" ? (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Bank Transfer</h3>
              <p className="text-xs text-muted-foreground mb-4">Select a bank transfer product</p>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
                </div>
              ) : (
                <>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..."
                      className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                  </div>

                  {/* Product list */}
                  <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin">
                    {filteredBankProducts.map(p => {
                      const isSelected = selectedProduct?.code === p.code;
                      return (
                        <button key={p.code} onClick={() => handleSelectProduct(p)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${isSelected ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass hover:bg-[hsl(0_0%_100%/0.5)]"}`}>
                          <div className="flex items-center gap-3">
                            <RadioDot selected={isSelected} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">{p.category}</span>
                                {p.has_price_list && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">Packages</span>}
                                {p.has_choice_list && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-chart-orange/10 text-chart-orange font-medium">Options</span>}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </button>
                      );
                    })}
                    {filteredBankProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">No products found</p>
                    )}
                  </div>

                  {/* Selected product details */}
                  {selectedProduct && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {loadingDetails ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="animate-spin text-muted-foreground" size={20} />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl stat-card-blue flex items-center justify-center text-primary-foreground">
                              <Building2 size={16} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">{selectedProduct.name}</h4>
                              <p className="text-xs text-muted-foreground">{selectedProduct.category} • {selectedProduct.code}</p>
                            </div>
                          </div>

                          {priceList.length > 0 && (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin mb-3">
                              {priceList.map(item => (
                                <button key={item.code} onClick={() => openPurchase(item)}
                                  className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-[hsl(0_0%_100%/0.5)] transition-all text-left">
                                  <p className="text-sm font-medium text-foreground flex-1 mr-3">{item.name}</p>
                                  <span className="text-sm font-bold text-foreground shrink-0">UGX {item.price.toLocaleString()}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {priceList.length === 0 && (
                            <button onClick={() => openPurchase()}
                              className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                              <ArrowLeftRight size={16} /> Transfer via {selectedProduct.name}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Other transfer methods - existing form */
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Transfer via {transferMethods.find(m => m.id === activeMethod)?.label}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
                  <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                    {accounts.map(a => <option key={a.name}>{a.name} — {cx(a.balance)}</option>)}
                  </select>
                </div>

                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <ArrowDown size={18} />
                  </div>
                </div>

                {activeMethod === "saving" ? (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Select Savings Goal</label>
                    <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                      <option value="">Choose a goal...</option>
                      {savingsGoals.map(g => (
                        <option key={g.id} value={g.id}>{g.name} (UGX {g.current.toLocaleString()} / {g.target.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      {activeMethod === "livra" ? "Livra Code" : "Phone Number"}
                    </label>
                    <input placeholder={
                      activeMethod === "livra" ? "Enter Livra code" : "Enter phone number"
                    } className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`${symbol}0.00`}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <ArrowLeftRight size={16} /> Transfer Now
                </button>
              </div>
            </div>
          )}
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
                  <span className="text-sm font-semibold text-foreground">{cx(a.balance)}</span>
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
                <span className="text-sm font-semibold text-foreground">{cx(tx.amount)}</span>
                <p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relworx Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowPurchaseModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {purchaseStep === "success" ? "Transfer Complete" : purchaseStep === "validated" ? "Confirm Transfer" : "Transfer Details"}
              </h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {purchaseStep === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-primary-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Transfer in Progress</p>
                <p className="text-sm text-muted-foreground mb-4">Your {selectedProduct.name} transfer is being processed.</p>
                <button onClick={() => setShowPurchaseModal(false)}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">
                  Done
                </button>
              </div>
            ) : purchaseStep === "validated" ? (
              <div className="space-y-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">{selectedPrice?.name || selectedProduct.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">UGX {parseFloat(purchaseAmount).toLocaleString()}</p>
                  {customerName && <p className="text-xs text-muted-foreground mt-1">Customer: {customerName}</p>}
                </div>
                <div className="glass rounded-xl p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Bank Account (msisdn): {phoneNumber}</p>
                  <p className="text-xs text-muted-foreground">Contact Phone: {contactPhone || phoneNumber}</p>
                  <p className="text-xs text-muted-foreground">Product: {selectedProduct.code}</p>
                  <p className="text-xs text-muted-foreground">Validation Ref: {validationRef}</p>
                </div>
                <button onClick={handlePurchase} disabled={purchasing}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {purchasing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : "Confirm Transfer"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPrice && (
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">{selectedPrice.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">UGX {selectedPrice.price.toLocaleString()}</p>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">MSISDN <span className="text-[10px]">(Recipient Bank Account Number)</span></label>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Enter bank account number"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Amount <span className="text-[10px]">(UGX)</span></label>
                  <input type="number" value={purchaseAmount} onChange={e => setPurchaseAmount(e.target.value)} placeholder="Enter transfer amount"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Contact Phone <span className="text-[10px]">(For SMS notification after transfer)</span></label>
                  <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="e.g. 0701234567"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                {choiceList.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Location</label>
                    <select value={selectedChoice} onChange={e => setSelectedChoice(e.target.value)}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                      <option value="">Select location</option>
                      {choiceList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}

                <button onClick={handleValidate} disabled={validating || !phoneNumber || !purchaseAmount}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {validating ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : <><ArrowLeftRight size={16} /> Validate & Transfer</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransferPage;
