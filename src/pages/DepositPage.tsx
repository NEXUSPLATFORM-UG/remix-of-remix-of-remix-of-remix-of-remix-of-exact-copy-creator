import { ArrowDownToLine, Smartphone, Building2, TrendingUp, ArrowUpRight, ArrowDownLeft, X, Loader2, CheckCircle, AlertCircle, Search, ChevronRight, ArrowLeftRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { ResponsiveContainer, XAxis, Tooltip, Bar, BarChart } from "recharts";
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

interface ChoiceItem {
  id: string;
  name: string;
}

const recentDeposits = [
  { name: "MTN Mobile Money", method: "Mobile", amount: "+UGX 2,500", date: "Today", status: "Completed" },
  { name: "Bank Transfer", method: "Bank", amount: "+UGX 5,000", date: "Yesterday", status: "Completed" },
  { name: "MTN Mobile Money", method: "Mobile", amount: "+UGX 200", date: "Feb 8", status: "Completed" },
  { name: "Airtel Money", method: "Mobile", amount: "+UGX 1,000", date: "Feb 7", status: "Completed" },
  { name: "Airtel Money", method: "Mobile", amount: "+UGX 150", date: "Feb 6", status: "Pending" },
];

const analyticsData = [
  { month: "Jul", deposit: 4200, withdraw: 2100 },
  { month: "Aug", deposit: 5100, withdraw: 2800 },
  { month: "Sep", deposit: 3800, withdraw: 1900 },
  { month: "Oct", deposit: 6200, withdraw: 3200 },
  { month: "Nov", deposit: 5500, withdraw: 2600 },
  { month: "Dec", deposit: 7800, withdraw: 3800 },
  { month: "Jan", deposit: 6500, withdraw: 3100 },
  { month: "Feb", deposit: 8900, withdraw: 4200 },
];

type ModalStep = "form" | "processing" | "polling" | "success" | "error";
type WithdrawTab = "mobile" | "bank";

const DepositPage = () => {
  // Deposit modal
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositMsisdn, setDepositMsisdn] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [depositStep, setDepositStep] = useState<ModalStep>("form");
  const [depositError, setDepositError] = useState("");
  const [depositResult, setDepositResult] = useState<Record<string, unknown> | null>(null);
  const depositPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Withdraw modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawTab, setWithdrawTab] = useState<WithdrawTab>("mobile");
  const [withdrawMsisdn, setWithdrawMsisdn] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [withdrawStep, setWithdrawStep] = useState<ModalStep>("form");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawResult, setWithdrawResult] = useState<Record<string, unknown> | null>(null);
  const withdrawPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bank transfer withdraw state
  const [bankProducts, setBankProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [choiceList, setChoiceList] = useState<ChoiceItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bankPhoneNumber, setBankPhoneNumber] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [bankContactPhone, setBankContactPhone] = useState("");
  const [bankDepositorName, setBankDepositorName] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [validating, setValidating] = useState(false);
  const [validationRef, setValidationRef] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [bankPurchaseStep, setBankPurchaseStep] = useState<"list" | "form" | "validated" | "success" | "error">("list");
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

  // Fetch bank products when bank tab is selected
  useEffect(() => {
    if (withdrawTab === "bank" && bankProducts.length === 0) {
      setLoadingProducts(true);
      fetch(`${API_BASE}/products`)
        .then(res => res.json())
        .then(data => { if (data.success) setBankProducts(data.products.filter((p: Product) => p.category === "BANK_TRANSFERS")); })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [withdrawTab, bankProducts.length]);

  const handleDeposit = async () => {
    if (!depositMsisdn || !depositAmount) return;
    setDepositStep("processing");
    setDepositError("");
    try {
      const res = await fetch(`${API_BASE}/deposit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn: depositMsisdn, amount: parseFloat(depositAmount), description: depositDescription || "Deposit" }) });
      const data = await res.json();
      if (data.success && data.internal_reference) { setDepositStep("polling"); pollStatus(data.internal_reference, depositPollRef, setDepositStep, setDepositResult, setDepositError); }
      else { setDepositError(data.message || "Failed"); setDepositStep("error"); }
    } catch { setDepositError("Network error."); setDepositStep("error"); }
  };

  const handleWithdrawMobile = async () => {
    if (!withdrawMsisdn || !withdrawAmount) return;
    setWithdrawStep("processing");
    setWithdrawError("");
    try {
      const res = await fetch(`${API_BASE}/withdraw`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn: withdrawMsisdn, amount: parseFloat(withdrawAmount), description: withdrawDescription || "Withdrawal" }) });
      const data = await res.json();
      if (data.success && data.internal_reference) { setWithdrawStep("polling"); pollStatus(data.internal_reference, withdrawPollRef, setWithdrawStep, setWithdrawResult, setWithdrawError); }
      else { setWithdrawError(data.message || "Failed"); setWithdrawStep("error"); }
    } catch { setWithdrawError("Network error."); setWithdrawStep("error"); }
  };

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setChoiceList([]);
    setLoadingDetails(true);
    if (product.has_choice_list) {
      try { const res = await fetch(`${API_BASE}/products/choice-list?code=${product.code}`); const data = await res.json(); if (data.success) setChoiceList(data.choice_list); } catch {}
    }
    setLoadingDetails(false);
    setBankPurchaseStep("form");
    setBankPhoneNumber(""); setBankAmount(""); setBankContactPhone(""); setBankDepositorName(""); setSelectedChoice(""); setValidationRef(""); setCustomerName(""); setBankErrorMsg("");
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
      if (data.success) { setValidationRef(data.validation_reference); setCustomerName(data.customer_name || ""); setBankPurchaseStep("validated"); }
      else { setBankErrorMsg(data.message || "Validation failed"); setBankPurchaseStep("error"); }
    } catch { setBankErrorMsg("Network error."); setBankPurchaseStep("error"); }
    finally { setValidating(false); }
  };

  const handleBankPurchase = async () => {
    if (!validationRef) return;
    setPurchasing(true); setBankErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/products/purchase`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ validation_reference: validationRef }) });
      const data = await res.json();
      if (data.success) { setBankPurchaseStep("success"); toast({ title: "Success", description: data.message || "Transfer in progress" }); }
      else { setBankErrorMsg(data.message || "Failed"); setBankPurchaseStep("error"); }
    } catch { setBankErrorMsg("Network error."); setBankPurchaseStep("error"); }
    finally { setPurchasing(false); }
  };

  const closeDepositModal = () => { stopPolling(depositPollRef); setShowDepositModal(false); setDepositStep("form"); setDepositMsisdn(""); setDepositAmount(""); setDepositDescription(""); setDepositError(""); setDepositResult(null); };
  const closeWithdrawModal = () => { stopPolling(withdrawPollRef); setShowWithdrawModal(false); setWithdrawStep("form"); setWithdrawMsisdn(""); setWithdrawAmount(""); setWithdrawDescription(""); setWithdrawError(""); setWithdrawResult(null); setWithdrawTab("mobile"); setSelectedProduct(null); setBankPurchaseStep("list"); setSearchQuery(""); };

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

  const filteredBankProducts = bankProducts.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <PageHeader title="Deposit & Withdraw" subtitle="Add or withdraw funds from your wallet" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowDownToLine size={18} />} label="Total Deposited" value="UGX 45,792" gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value="UGX 8,900" gradient="stat-card-green" />
        <StatCardSmall icon={<ArrowUpRight size={18} />} label="Withdrawn" value="UGX 12,450" gradient="stat-card-orange" />
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Net Inflow" value="+UGX 33,342" gradient="stat-card-cyan" />
      </div>

      <div className="flex gap-3 mb-5">
        <button onClick={() => setShowDepositModal(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity">
          <ArrowDownLeft size={16} /> Add Money
        </button>
        <button onClick={() => setShowWithdrawModal(true)} className="flex items-center gap-2 glass px-5 py-3 rounded-2xl text-sm font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
          <ArrowUpRight size={16} /> Withdraw
        </button>
      </div>

      {/* Analytics */}
      <div className="glass rounded-2xl p-5 mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Transaction Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">Deposit & Withdraw overview</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData} barGap={2}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }} />
            <Bar dataKey="deposit" fill="hsl(210 100% 50%)" radius={[4, 4, 0, 0]} name="Deposit" />
            <Bar dataKey="withdraw" fill="hsl(25 95% 55%)" radius={[4, 4, 0, 0]} name="Withdraw" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentDeposits.map((tx, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-xl stat-card-green flex items-center justify-center text-primary-foreground"><ArrowDownLeft size={14} /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{tx.name}</p><p className="text-xs text-muted-foreground">{tx.method} • {tx.date}</p></div>
              <div className="text-right"><span className="text-sm font-semibold text-chart-green">{tx.amount}</span><p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal - Mobile Money Only */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeDepositModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {depositStep === "success" ? "Deposit Complete" : depositStep === "polling" ? "Processing..." : "Add Money (Mobile Money)"}
              </h3>
              <button onClick={closeDepositModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            {depositStep === "success" ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-primary-foreground" /></div>
                <p className="text-lg font-semibold text-foreground">Deposit Successful</p>
                {renderResult(depositResult)}
                <button onClick={closeDepositModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
              </div>
            ) : depositStep === "polling" ? (
              <div className="space-y-4 text-center py-6"><Loader2 size={32} className="animate-spin text-secondary mx-auto" /><p className="text-sm font-medium text-foreground">Waiting for payment confirmation...</p><p className="text-xs text-muted-foreground">Complete the payment on your phone.</p></div>
            ) : depositStep === "processing" ? (
              <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-4">
                {depositError && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {depositError}</div>}
                <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Mobile Money phone number)</span></label><input value={depositMsisdn} onChange={e => setDepositMsisdn(e.target.value)} placeholder="+256701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="5000" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">description</label><input value={depositDescription} onChange={e => setDepositDescription(e.target.value)} placeholder="e.g. Wallet top-up" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={handleDeposit} disabled={!depositMsisdn || !depositAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"><ArrowDownToLine size={16} /> Request Payment</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal - Mobile Money + Bank Transfer tabs */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeWithdrawModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {withdrawStep === "success" ? "Withdrawal Complete" : withdrawStep === "polling" ? "Processing..." : bankPurchaseStep === "success" ? "Transfer Complete" : "Withdraw"}
              </h3>
              <button onClick={closeWithdrawModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {/* Tab selector */}
            {withdrawStep === "form" && bankPurchaseStep !== "validated" && bankPurchaseStep !== "success" && (
              <div className="flex gap-2 mb-4">
                <button onClick={() => { setWithdrawTab("mobile"); setSelectedProduct(null); setBankPurchaseStep("list"); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${withdrawTab === "mobile" ? "bg-secondary text-secondary-foreground" : "glass text-muted-foreground"}`}>
                  <Smartphone size={14} /> Mobile Money
                </button>
                <button onClick={() => setWithdrawTab("bank")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${withdrawTab === "bank" ? "bg-secondary text-secondary-foreground" : "glass text-muted-foreground"}`}>
                  <Building2 size={14} /> Bank Transfer
                </button>
              </div>
            )}

            {/* Mobile Money Withdraw */}
            {withdrawTab === "mobile" && (
              <>
                {withdrawStep === "success" ? (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-primary-foreground" /></div>
                    <p className="text-lg font-semibold text-foreground">Withdrawal Successful</p>
                    {renderResult(withdrawResult)}
                    <button onClick={closeWithdrawModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
                  </div>
                ) : withdrawStep === "polling" ? (
                  <div className="space-y-4 text-center py-6"><Loader2 size={32} className="animate-spin text-secondary mx-auto" /><p className="text-sm font-medium text-foreground">Processing withdrawal...</p></div>
                ) : withdrawStep === "processing" ? (
                  <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="space-y-4">
                    {withdrawError && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {withdrawError}</div>}
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Recipient mobile money number)</span></label><input value={withdrawMsisdn} onChange={e => setWithdrawMsisdn(e.target.value)} placeholder="+256701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="2000" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">description</label><input value={withdrawDescription} onChange={e => setWithdrawDescription(e.target.value)} placeholder="e.g. User withdrawal" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <button onClick={handleWithdrawMobile} disabled={!withdrawMsisdn || !withdrawAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"><ArrowUpRight size={16} /> Send Withdrawal</button>
                  </div>
                )}
              </>
            )}

            {/* Bank Transfer Withdraw */}
            {withdrawTab === "bank" && (
              <>
                {bankPurchaseStep === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-primary-foreground" /></div>
                    <p className="text-lg font-semibold text-foreground mb-1">Transfer in Progress</p>
                    <p className="text-sm text-muted-foreground mb-4">Your bank transfer is being processed.</p>
                    <button onClick={closeWithdrawModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
                  </div>
                ) : bankPurchaseStep === "validated" ? (
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground">{selectedProduct?.name}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">UGX {parseFloat(bankAmount).toLocaleString()}</p>
                      {customerName && <p className="text-xs text-muted-foreground mt-1">Customer: {customerName}</p>}
                    </div>
                    <div className="glass rounded-xl p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">msisdn: {bankPhoneNumber}</p>
                      <p className="text-xs text-muted-foreground">contact_phone: {bankContactPhone || bankPhoneNumber}</p>
                      {bankDepositorName && <p className="text-xs text-muted-foreground">depositor_name: {bankDepositorName}</p>}
                      <p className="text-xs text-muted-foreground">product_code: {selectedProduct?.code}</p>
                      <p className="text-xs text-muted-foreground">validation_reference: {validationRef}</p>
                    </div>
                    <button onClick={handleBankPurchase} disabled={purchasing} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                      {purchasing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : "Confirm Transfer"}
                    </button>
                  </div>
                ) : bankPurchaseStep === "form" && selectedProduct ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => { setSelectedProduct(null); setBankPurchaseStep("list"); }} className="text-xs text-secondary">← Back to banks</button>
                      <p className="text-sm font-semibold text-foreground">{selectedProduct.name}</p>
                    </div>
                    {bankErrorMsg && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {bankErrorMsg}</div>}
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Recipient Bank Account Number)</span></label><input value={bankPhoneNumber} onChange={e => setBankPhoneNumber(e.target.value)} placeholder="Enter bank account number" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={bankAmount} onChange={e => setBankAmount(e.target.value)} placeholder="Enter amount" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">contact_phone <span className="text-[10px]">(For SMS notification)</span></label><input value={bankContactPhone} onChange={e => setBankContactPhone(e.target.value)} placeholder="e.g. 0701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1.5 block">depositor_name <span className="text-[10px]">(Your name)</span></label><input value={bankDepositorName} onChange={e => setBankDepositorName(e.target.value)} placeholder="Enter your name" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                    {choiceList.length > 0 && (
                      <div><label className="text-xs text-muted-foreground mb-1.5 block">location_id</label><select value={selectedChoice} onChange={e => setSelectedChoice(e.target.value)} className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none"><option value="">Select location</option>{choiceList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    )}
                    <button onClick={handleBankValidate} disabled={validating || !bankPhoneNumber || !bankAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                      {validating ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : <><ArrowLeftRight size={16} /> Validate & Transfer</>}
                    </button>
                  </div>
                ) : (
                  /* Bank list */
                  <div className="space-y-3">
                    {loadingProducts ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div> : (
                      <>
                        <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search banks..." className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                          {filteredBankProducts.map(p => (
                            <button key={p.code} onClick={() => handleSelectProduct(p)} className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-[hsl(0_0%_100%/0.5)] transition-all text-left">
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DepositPage;
