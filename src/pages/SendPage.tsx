import { useMainCurrency } from "@/hooks/use-main-currency";
import { Send, User, ArrowRight, Smartphone, Building2, Users, TrendingUp, ArrowUpRight, Clock, X, Loader2, CheckCircle, AlertCircle, Search, ChevronRight, ArrowLeftRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";
import { toast } from "@/hooks/use-toast";

const API_BASE = "https://api.livrauganda.workers.dev/api";

interface Product {
  name: string;
  code: string;
  category: string;
  has_price_list: boolean;
  has_choice_list: boolean;
  billable: boolean;
}

interface ChoiceItem { id: string; name: string; }

const recentContacts = [
  { name: "Alice J.", avatar: "A" },
  { name: "David C.", avatar: "D" },
  { name: "Sarah K.", avatar: "S" },
  { name: "James P.", avatar: "J" },
  { name: "Maria S.", avatar: "M" },
];

const sendMethods = [
  { id: "livra" as const, icon: Users, label: "Livra User", desc: "Send to any Livra user", gradient: "stat-card-blue" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile Money", desc: "MTN, Airtel", gradient: "stat-card-orange" },
  { id: "bank" as const, icon: Building2, label: "Bank Transfer", desc: "Via Relworx", gradient: "stat-card-cyan" },
];

const recentSends = [
  { name: "Alice Johnson", method: "Livra", amount: "-UGX 250", date: "Today", status: "Completed" },
  { name: "MTN Mobile", method: "Mobile Money", amount: "-UGX 100", date: "Today", status: "Completed" },
  { name: "Stanbic Bank", method: "Bank", amount: "-UGX 1,500", date: "Yesterday", status: "Completed" },
  { name: "David Chen", method: "Livra", amount: "-UGX 75", date: "Feb 8", status: "Completed" },
  { name: "Airtel Money", method: "Mobile Money", amount: "-UGX 50", date: "Feb 7", status: "Pending" },
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

type ModalStep = "form" | "processing" | "polling" | "success" | "error";

const SendPage = () => {
  const { cx, symbol } = useMainCurrency();
  const [activeMethod, setActiveMethod] = useState<"livra" | "mobile" | "bank">("livra");

  // Livra
  const [livraCode, setLivraCode] = useState("");
  const [livraAmount, setLivraAmount] = useState("");
  const [livraNote, setLivraNote] = useState("");
  const [showLivraModal, setShowLivraModal] = useState(false);

  // Mobile Money (withdraw endpoint)
  const [mobileMsisdn, setMobileMsisdn] = useState("");
  const [mobileAmount, setMobileAmount] = useState("");
  const [mobileDescription, setMobileDescription] = useState("");
  const [mobileStep, setMobileStep] = useState<ModalStep>("form");
  const [mobileError, setMobileError] = useState("");
  const [mobileResult, setMobileResult] = useState<Record<string, unknown> | null>(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const mobilePollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bank Transfer (Relworx)
  const [bankProducts, setBankProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [choiceList, setChoiceList] = useState<ChoiceItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankPhoneNumber, setBankPhoneNumber] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [bankContactPhone, setBankContactPhone] = useState("");
  const [bankDepositorName, setBankDepositorName] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationRef, setValidationRef] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [bankStep, setBankStep] = useState<"list" | "form" | "validated" | "success" | "error">("list");
  const [bankErrorMsg, setBankErrorMsg] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  const stopPolling = useCallback((ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (ref.current) { clearInterval(ref.current); ref.current = null; }
  }, []);

  const pollStatus = useCallback((internalRef: string, pollRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>, setStep: (s: ModalStep) => void, setResult: (r: Record<string, unknown>) => void, setError: (e: string) => void) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 60) { stopPolling(pollRef); setError("Timed out."); setStep("error"); return; }
      try {
        const res = await fetch(`${API_BASE}/request-status?internal_reference=${internalRef}`);
        const data = await res.json();
        if (data.success && data.request_status === "success") { stopPolling(pollRef); setResult(data); setStep("success"); toast({ title: "Success", description: data.message || "Completed" }); }
        else if (data.request_status === "failed") { stopPolling(pollRef); setError(data.message || "Failed"); setStep("error"); }
      } catch { /* silent */ }
    }, 5000);
  }, [stopPolling]);

  // Fetch bank products
  useEffect(() => {
    if (activeMethod === "bank" && bankProducts.length === 0) {
      setLoadingProducts(true);
      fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(data => { if (data.success) setBankProducts(data.products.filter((p: Product) => p.category === "BANK_TRANSFERS")); })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [activeMethod, bankProducts.length]);

  const handleMobileSend = async () => {
    if (!mobileMsisdn || !mobileAmount) return;
    setMobileStep("processing"); setMobileError("");
    try {
      const res = await fetch(`${API_BASE}/withdraw`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn: mobileMsisdn, amount: parseFloat(mobileAmount), description: mobileDescription || "Send to mobile" }) });
      const data = await res.json();
      if (data.success && data.internal_reference) { setMobileStep("polling"); pollStatus(data.internal_reference, mobilePollRef, setMobileStep, setMobileResult, setMobileError); }
      else { setMobileError(data.message || "Failed"); setMobileStep("error"); }
    } catch { setMobileError("Network error."); setMobileStep("error"); }
  };

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product); setChoiceList([]); setLoadingDetails(true);
    if (product.has_choice_list) {
      try { const res = await fetch(`${API_BASE}/products/choice-list?code=${product.code}`); const data = await res.json(); if (data.success) setChoiceList(data.choice_list); } catch {}
    }
    setLoadingDetails(false);
    setBankStep("form"); setBankPhoneNumber(""); setBankAmount(""); setBankContactPhone(""); setBankDepositorName(""); setSelectedChoice(""); setValidationRef(""); setCustomerName(""); setBankErrorMsg("");
  };

  const handleBankValidate = async () => {
    if (!bankPhoneNumber || !bankAmount || !selectedProduct) return;
    setValidating(true); setBankErrorMsg("");
    try {
      const body: Record<string, string | number> = { msisdn: bankPhoneNumber, amount: parseFloat(bankAmount), product_code: selectedProduct.code, contact_phone: bankContactPhone || bankPhoneNumber };
      if (bankDepositorName) body.depositor_name = bankDepositorName;
      if (selectedChoice) body.location_id = selectedChoice;
      const res = await fetch(`${API_BASE}/products/validate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setValidationRef(data.validation_reference); setCustomerName(data.customer_name || ""); setBankStep("validated"); }
      else { setBankErrorMsg(data.message || "Validation failed"); setBankStep("error"); }
    } catch { setBankErrorMsg("Network error."); setBankStep("error"); }
    finally { setValidating(false); }
  };

  const handleBankPurchase = async () => {
    if (!validationRef) return;
    setPurchasing(true); setBankErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/products/purchase`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ validation_reference: validationRef }) });
      const data = await res.json();
      if (data.success) { setBankStep("success"); toast({ title: "Success", description: data.message || "Transfer in progress" }); }
      else { setBankErrorMsg(data.message || "Failed"); setBankStep("error"); }
    } catch { setBankErrorMsg("Network error."); setBankStep("error"); }
    finally { setPurchasing(false); }
  };

  const closeMobileModal = () => { stopPolling(mobilePollRef); setShowMobileModal(false); setMobileStep("form"); setMobileMsisdn(""); setMobileAmount(""); setMobileDescription(""); setMobileError(""); setMobileResult(null); };
  const closeBankModal = () => { setShowBankModal(false); setSelectedProduct(null); setBankStep("list"); setSearchQuery(""); };

  const filteredBankProducts = bankProducts.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderResult = (result: Record<string, unknown> | null) => {
    if (!result) return null;
    return (
      <div className="glass rounded-xl p-3 space-y-1 text-left">
        {result.msisdn && <p className="text-xs text-muted-foreground">msisdn: {String(result.msisdn)}</p>}
        {result.amount && <p className="text-xs text-muted-foreground">amount: {String(result.amount)} {String(result.currency || "UGX")}</p>}
        {result.provider && <p className="text-xs text-muted-foreground">provider: {String(result.provider)}</p>}
        {result.charge !== undefined && <p className="text-xs text-muted-foreground">charge: {String(result.charge)}</p>}
        {result.internal_reference && <p className="text-xs text-muted-foreground">internal_reference: {String(result.internal_reference)}</p>}
        {result.provider_transaction_id && <p className="text-xs text-muted-foreground">provider_transaction_id: {String(result.provider_transaction_id)}</p>}
      </div>
    );
  };

  return (
    <>
      <PageHeader title="Send Money" subtitle="Transfer funds to anyone, anywhere" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<Send size={18} />} label="Total Sent" value={cx("UGX 12,450")} gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value={cx("UGX 2,800")} gradient="stat-card-cyan" />
        <StatCardSmall icon={<Users size={18} />} label="Recipients" value="24" gradient="stat-card-purple" />
        <StatCardSmall icon={<Clock size={18} />} label="Pending" value={cx("UGX 50")} gradient="stat-card-orange" />
      </div>

      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Send Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">Monthly transaction volume</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={sendAnalytics}>
            <defs><linearGradient id="sendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(210 100% 50%)" stopOpacity={0.25} /><stop offset="100%" stopColor="hsl(210 100% 50%)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Area type="monotone" dataKey="amount" stroke="hsl(210 100% 50%)" fill="url(#sendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          {/* Method selector */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {sendMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setActiveMethod(m.id)}
                  className={`glass rounded-2xl p-4 text-left transition-all ${activeMethod === m.id ? "ring-2 ring-secondary" : ""}`}>
                  <div className="flex items-center gap-2 mb-2"><RadioDot selected={activeMethod === m.id} /></div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${m.gradient} mb-2`}><Icon size={18} /></div>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Livra */}
          {activeMethod === "livra" && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Send to Livra User</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Livra Code</label><input value={livraCode} onChange={e => setLivraCode(e.target.value)} placeholder="Enter user's Livra code" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Amount (UGX)</label><input type="number" value={livraAmount} onChange={e => setLivraAmount(e.target.value)} placeholder="0" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Note (optional)</label><input value={livraNote} onChange={e => setLivraNote(e.target.value)} placeholder="What's this for?" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={() => setShowLivraModal(true)} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90"><Send size={16} /> Send Money</button>
              </div>
            </div>
          )}

          {/* Mobile Money */}
          {activeMethod === "mobile" && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Send via Mobile Money</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Recipient phone number)</span></label><input value={mobileMsisdn} onChange={e => setMobileMsisdn(e.target.value)} placeholder="+256701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={mobileAmount} onChange={e => setMobileAmount(e.target.value)} placeholder="2000" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">description</label><input value={mobileDescription} onChange={e => setMobileDescription(e.target.value)} placeholder="e.g. Send to friend" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={() => setShowMobileModal(true)} disabled={!mobileMsisdn || !mobileAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"><Smartphone size={16} /> Send via Mobile Money</button>
              </div>
            </div>
          )}

          {/* Bank Transfer */}
          {activeMethod === "bank" && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Send via Bank Transfer</h3>
              <p className="text-xs text-muted-foreground mb-4">Select a bank to send to</p>
              {loadingProducts ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div> : (
                <>
                  <div className="relative mb-4"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search banks..." className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin">
                    {filteredBankProducts.map(p => (
                      <button key={p.code} onClick={() => { handleSelectProduct(p); setShowBankModal(true); }} className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-[hsl(0_0%_100%/0.5)] transition-all text-left">
                        <div className="flex items-center gap-3"><Building2 size={14} className="text-muted-foreground" /><p className="text-sm font-medium text-foreground">{p.name}</p></div>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </button>
                    ))}
                    {filteredBankProducts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No banks found</p>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Contacts</h3>
          <div className="space-y-3">
            {recentContacts.map(c => (
              <button key={c.name} className="w-full flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-[hsl(0_0%_100%/0.3)] rounded-lg px-2 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-xs">{c.avatar}</div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sends */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentSends.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl stat-card-blue flex items-center justify-center text-primary-foreground"><ArrowUpRight size={14} /></div>
                <div><p className="text-sm font-medium text-foreground">{tx.name}</p><p className="text-xs text-muted-foreground">{tx.method} • {tx.date}</p></div>
              </div>
              <div className="text-right"><span className="text-sm font-semibold text-foreground">{cx(tx.amount)}</span><p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Livra Confirm Modal */}
      {showLivraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowLivraModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-foreground">Confirm Send</h3><button onClick={() => setShowLivraModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button></div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">To (Livra Code)</span><span className="font-medium text-foreground">{livraCode || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-semibold text-foreground">UGX {livraAmount || "0"}</span></div>
              {livraNote && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Note</span><span className="font-medium text-foreground">{livraNote}</span></div>}
            </div>
            <button onClick={() => { setShowLivraModal(false); setLivraCode(""); setLivraAmount(""); setLivraNote(""); toast({ title: "Sent!", description: "Transfer to Livra user initiated." }); }} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2"><Send size={16} /> Confirm & Send</button>
          </div>
        </div>
      )}

      {/* Mobile Money Send Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeMobileModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{mobileStep === "success" ? "Sent!" : mobileStep === "polling" ? "Processing..." : "Confirm Send"}</h3>
              <button onClick={closeMobileModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            {mobileStep === "success" ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-primary-foreground" /></div>
                <p className="text-lg font-semibold text-foreground">Money Sent Successfully</p>
                {renderResult(mobileResult)}
                <button onClick={closeMobileModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
              </div>
            ) : mobileStep === "polling" ? (
              <div className="space-y-4 text-center py-6"><Loader2 size={32} className="animate-spin text-secondary mx-auto" /><p className="text-sm font-medium text-foreground">Sending money...</p></div>
            ) : mobileStep === "processing" ? (
              <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-3 mb-4">
                {mobileError && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {mobileError}</div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">msisdn</span><span className="font-medium text-foreground">{mobileMsisdn}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">amount</span><span className="font-semibold text-foreground">UGX {mobileAmount}</span></div>
                {mobileDescription && <div className="flex justify-between text-sm"><span className="text-muted-foreground">description</span><span className="font-medium text-foreground">{mobileDescription}</span></div>}
                <button onClick={handleMobileSend} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2"><Send size={16} /> Confirm & Send</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bank Transfer Modal */}
      {showBankModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeBankModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{bankStep === "success" ? "Transfer Complete" : bankStep === "validated" ? "Confirm Transfer" : selectedProduct.name}</h3>
              <button onClick={closeBankModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            {bankStep === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-primary-foreground" /></div>
                <p className="text-lg font-semibold text-foreground mb-1">Transfer in Progress</p>
                <button onClick={closeBankModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 mt-4">Done</button>
              </div>
            ) : bankStep === "validated" ? (
              <div className="space-y-4">
                <div className="glass rounded-xl p-4 text-center"><p className="text-sm text-muted-foreground">{selectedProduct.name}</p><p className="text-3xl font-bold text-foreground mt-1">UGX {parseFloat(bankAmount).toLocaleString()}</p>{customerName && <p className="text-xs text-muted-foreground mt-1">Customer: {customerName}</p>}</div>
                <div className="glass rounded-xl p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">msisdn: {bankPhoneNumber}</p>
                  <p className="text-xs text-muted-foreground">contact_phone: {bankContactPhone || bankPhoneNumber}</p>
                  {bankDepositorName && <p className="text-xs text-muted-foreground">depositor_name: {bankDepositorName}</p>}
                  <p className="text-xs text-muted-foreground">product_code: {selectedProduct.code}</p>
                  <p className="text-xs text-muted-foreground">validation_reference: {validationRef}</p>
                </div>
                <button onClick={handleBankPurchase} disabled={purchasing} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {purchasing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : "Confirm Transfer"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bankErrorMsg && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {bankErrorMsg}</div>}
                <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Recipient Bank Account Number)</span></label><input value={bankPhoneNumber} onChange={e => setBankPhoneNumber(e.target.value)} placeholder="Enter bank account number" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={bankAmount} onChange={e => setBankAmount(e.target.value)} placeholder="Enter amount" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">contact_phone <span className="text-[10px]">(For SMS notification)</span></label><input value={bankContactPhone} onChange={e => setBankContactPhone(e.target.value)} placeholder="e.g. 0701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">depositor_name <span className="text-[10px]">(Your name)</span></label><input value={bankDepositorName} onChange={e => setBankDepositorName(e.target.value)} placeholder="Enter your name" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                {choiceList.length > 0 && <div><label className="text-xs text-muted-foreground mb-1.5 block">location_id</label><select value={selectedChoice} onChange={e => setSelectedChoice(e.target.value)} className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none"><option value="">Select location</option>{choiceList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
                <button onClick={handleBankValidate} disabled={validating || !bankPhoneNumber || !bankAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {validating ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : <><ArrowLeftRight size={16} /> Validate & Send</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SendPage;
