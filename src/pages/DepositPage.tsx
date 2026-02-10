import { ArrowDownToLine, CreditCard, Building2, Smartphone, TrendingUp, ArrowUpRight, ArrowDownLeft, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { ResponsiveContainer, XAxis, Tooltip, Bar, BarChart } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";
import { toast } from "@/hooks/use-toast";

const API_BASE = "https://api.livrauganda.workers.dev/api";

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

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

type ModalStep = "form" | "processing" | "polling" | "success" | "error";

const DepositPage = () => {
  const [activeMethod, setActiveMethod] = useState("card");
  const [amount, setAmount] = useState("");

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
  const [withdrawMsisdn, setWithdrawMsisdn] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [withdrawStep, setWithdrawStep] = useState<ModalStep>("form");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawResult, setWithdrawResult] = useState<Record<string, unknown> | null>(null);
  const withdrawPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback((ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    if (ref.current) { clearInterval(ref.current); ref.current = null; }
  }, []);

  const pollStatus = useCallback((internalRef: string, pollRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>, setStep: (s: ModalStep) => void, setResult: (r: Record<string, unknown>) => void, setError: (e: string) => void) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 min max
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        stopPolling(pollRef);
        setError("Payment status check timed out. Please check your transaction history.");
        setStep("error");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/request-status?internal_reference=${internalRef}`);
        const data = await res.json();
        console.log("Poll status:", data);
        if (data.success && data.request_status === "success") {
          stopPolling(pollRef);
          setResult(data);
          setStep("success");
          toast({ title: "Success", description: data.message || "Transaction completed successfully" });
        } else if (data.request_status === "failed") {
          stopPolling(pollRef);
          setError(data.message || "Transaction failed");
          setStep("error");
        }
      } catch {
        // silently continue polling on network error
      }
    }, 5000);
  }, [stopPolling]);

  const handleDeposit = async () => {
    if (!depositMsisdn || !depositAmount) return;
    setDepositStep("processing");
    setDepositError("");
    try {
      const res = await fetch(`${API_BASE}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn: depositMsisdn,
          amount: parseFloat(depositAmount),
          description: depositDescription || "Deposit",
        }),
      });
      const data = await res.json();
      console.log("Deposit response:", data);
      if (data.success && data.internal_reference) {
        setDepositStep("polling");
        pollStatus(data.internal_reference, depositPollRef, setDepositStep, setDepositResult, setDepositError);
      } else {
        setDepositError(data.message || "Deposit request failed");
        setDepositStep("error");
      }
    } catch {
      setDepositError("Network error. Please try again.");
      setDepositStep("error");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawMsisdn || !withdrawAmount) return;
    setWithdrawStep("processing");
    setWithdrawError("");
    try {
      const res = await fetch(`${API_BASE}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn: withdrawMsisdn,
          amount: parseFloat(withdrawAmount),
          description: withdrawDescription || "Withdrawal",
        }),
      });
      const data = await res.json();
      console.log("Withdraw response:", data);
      if (data.success && data.internal_reference) {
        setWithdrawStep("polling");
        pollStatus(data.internal_reference, withdrawPollRef, setWithdrawStep, setWithdrawResult, setWithdrawError);
      } else {
        setWithdrawError(data.message || "Withdraw request failed");
        setWithdrawStep("error");
      }
    } catch {
      setWithdrawError("Network error. Please try again.");
      setWithdrawStep("error");
    }
  };

  const closeDepositModal = () => {
    stopPolling(depositPollRef);
    setShowDepositModal(false);
    setDepositStep("form");
    setDepositMsisdn("");
    setDepositAmount("");
    setDepositDescription("");
    setDepositError("");
    setDepositResult(null);
  };

  const closeWithdrawModal = () => {
    stopPolling(withdrawPollRef);
    setShowWithdrawModal(false);
    setWithdrawStep("form");
    setWithdrawMsisdn("");
    setWithdrawAmount("");
    setWithdrawDescription("");
    setWithdrawError("");
    setWithdrawResult(null);
  };

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

      {/* Analytics chart */}
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

      {/* Methods + form section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
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

      {/* Deposit Modal - Mobile Money */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeDepositModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {depositStep === "success" ? "Deposit Complete" : depositStep === "polling" ? "Processing Deposit..." : "Deposit / Request Payment"}
              </h3>
              <button onClick={closeDepositModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {depositStep === "success" ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto">
                  <CheckCircle size={28} className="text-primary-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">Deposit Successful</p>
                <p className="text-sm text-muted-foreground">Your payment has been completed.</p>
                {renderResult(depositResult)}
                <button onClick={closeDepositModal}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
              </div>
            ) : depositStep === "polling" ? (
              <div className="space-y-4 text-center py-6">
                <Loader2 size={32} className="animate-spin text-secondary mx-auto" />
                <p className="text-sm font-medium text-foreground">Waiting for payment confirmation...</p>
                <p className="text-xs text-muted-foreground">Please complete the payment on your phone. This will update automatically.</p>
              </div>
            ) : depositStep === "processing" ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={28} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {depositError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    <AlertCircle size={16} /> {depositError}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Mobile Money phone number)</span></label>
                  <input value={depositMsisdn} onChange={e => setDepositMsisdn(e.target.value)} placeholder="+256701234567"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="5000"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">description <span className="text-[10px]">(Payment description)</span></label>
                  <input value={depositDescription} onChange={e => setDepositDescription(e.target.value)} placeholder="e.g. Wallet top-up"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <button onClick={handleDeposit} disabled={!depositMsisdn || !depositAmount}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  <ArrowDownToLine size={16} /> Request Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal - Mobile Money */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeWithdrawModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {withdrawStep === "success" ? "Withdrawal Complete" : withdrawStep === "polling" ? "Processing Withdrawal..." : "Withdraw / Send Money"}
              </h3>
              <button onClick={closeWithdrawModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {withdrawStep === "success" ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto">
                  <CheckCircle size={28} className="text-primary-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">Withdrawal Successful</p>
                <p className="text-sm text-muted-foreground">Money has been sent to your mobile money.</p>
                {renderResult(withdrawResult)}
                <button onClick={closeWithdrawModal}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
              </div>
            ) : withdrawStep === "polling" ? (
              <div className="space-y-4 text-center py-6">
                <Loader2 size={32} className="animate-spin text-secondary mx-auto" />
                <p className="text-sm font-medium text-foreground">Processing withdrawal...</p>
                <p className="text-xs text-muted-foreground">Please wait while the transfer is being processed.</p>
              </div>
            ) : withdrawStep === "processing" ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={28} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    <AlertCircle size={16} /> {withdrawError}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Recipient mobile money number)</span></label>
                  <input value={withdrawMsisdn} onChange={e => setWithdrawMsisdn(e.target.value)} placeholder="+256701234567"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label>
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="2000"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">description <span className="text-[10px]">(Withdrawal description)</span></label>
                  <input value={withdrawDescription} onChange={e => setWithdrawDescription(e.target.value)} placeholder="e.g. User withdrawal"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <button onClick={handleWithdraw} disabled={!withdrawMsisdn || !withdrawAmount}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  <ArrowUpRight size={16} /> Send Withdrawal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DepositPage;
