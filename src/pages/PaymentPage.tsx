import { useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Smartphone, Loader2, CheckCircle, AlertCircle, ArrowDownToLine, Building2, CreditCard, Clock3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BrandLogo from "@/components/BrandLogo";
import BankTransferFlow from "@/components/BankTransferFlow";
import { decodePaymentLinkData, formatPaymentAmount } from "@/lib/payment-links";

const API_BASE = "https://api.livrauganda.workers.dev/api";

type ModalStep = "form" | "processing" | "polling" | "success" | "error";
type PaymentMethod = "mobile" | "bank" | "card";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");

  const paymentData = decodePaymentLinkData(dataParam);

  const [msisdn, setMsisdn] = useState("");
  const [amount, setAmount] = useState(paymentData.amount || "");
  const [step, setStep] = useState<ModalStep>("form");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("mobile");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const pollStatus = useCallback((internalRef: string) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 60) { stopPolling(); setError("Timed out."); setStep("error"); return; }
      try {
        const res = await fetch(`${API_BASE}/request-status?internal_reference=${internalRef}`);
        const data = await res.json();
        if (data.success && data.request_status === "success") { stopPolling(); setResult(data); setStep("success"); toast({ title: "Success", description: "Payment completed!" }); }
        else if (data.request_status === "failed") { stopPolling(); setError(data.message || "Failed"); setStep("error"); }
      } catch { /* silent */ }
    }, 5000);
  }, [stopPolling]);

  const handlePay = async () => {
    if (!msisdn || !amount) return;
    setStep("processing"); setError("");
    try {
      const res = await fetch(`${API_BASE}/deposit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn, amount: parseFloat(amount), description: paymentData.description || "Payment" }) });
      const data = await res.json();
      if (data.success && data.internal_reference) { setStep("polling"); pollStatus(data.internal_reference); }
      else { setError(data.message || "Failed"); setStep("error"); }
    } catch { setError("Network error."); setStep("error"); }
  };

  return (
    <div className="liquid-gradient-bg flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg py-8">
        <div className="glass-heavy rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <BrandLogo className="mx-auto mb-5 h-8 w-auto" eager />
            <div className="w-16 h-16 rounded-2xl stat-card-blue flex items-center justify-center text-primary-foreground mx-auto mb-4">
              <ArrowDownToLine size={28} />
            </div>
            <h1 className="text-xl font-bold text-foreground">Payment</h1>
            {paymentData.description && <p className="text-sm text-muted-foreground mt-1">{paymentData.description}</p>}
            {paymentData.amount && <p className="text-3xl font-bold text-foreground mt-2">{formatPaymentAmount(paymentData.amount, paymentData.currency)}</p>}
            <p className="mt-1 text-xs font-medium text-primary">Payment currency: {paymentData.currency}</p>
          </div>

          {step === "success" ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-primary-foreground" /></div>
              <p className="text-lg font-semibold text-foreground">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Thank you for your payment.</p>
              {result && (
                <div className="glass rounded-xl p-3 space-y-1 text-left">
                  {result.amount && <p className="text-xs text-muted-foreground">Amount: {String(result.amount)} {String(result.currency || "UGX")}</p>}
                  {result.provider && <p className="text-xs text-muted-foreground">Provider: {String(result.provider)}</p>}
                  {result.provider_transaction_id && <p className="text-xs text-muted-foreground">Transaction ID: {String(result.provider_transaction_id)}</p>}
                </div>
              )}
            </div>
          ) : step === "polling" ? (
            <div className="text-center space-y-4 py-6">
              <Loader2 size={32} className="animate-spin text-secondary mx-auto" />
              <p className="text-sm font-medium text-foreground">Waiting for payment confirmation...</p>
              <p className="text-xs text-muted-foreground">Please complete the payment on your phone.</p>
            </div>
          ) : step === "processing" ? (
            <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
          ) : method === "mobile" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2" aria-label="Payment method">
                {([
                  { id: "mobile" as const, label: "Mobile Money", icon: Smartphone },
                  { id: "bank" as const, label: "Bank", icon: Building2 },
                  { id: "card" as const, label: "Card", icon: CreditCard },
                ]).map((item) => {
                  const Icon = item.icon;
                  return <button key={item.id} onClick={() => { setMethod(item.id); setError(""); }} className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium transition-colors ${method === item.id ? "bg-primary text-primary-foreground" : "glass text-foreground hover:bg-accent"}`}><Icon size={19} />{item.label}</button>;
                })}
              </div>
              {error && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {error}</div>}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Your mobile money number)</span></label>
                <input value={msisdn} onChange={e => setMsisdn(e.target.value)} placeholder="+256701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
              {!paymentData.amount && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">({paymentData.currency})</span></label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
              )}
              <button onClick={handlePay} disabled={!msisdn || !amount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                <Smartphone size={16} /> Pay with Mobile Money
              </button>
            </div>
          ) : method === "bank" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2" aria-label="Payment method">
                <button onClick={() => setMethod("mobile")} className="glass flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium text-foreground hover:bg-accent"><Smartphone size={19} />Mobile Money</button>
                <button className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl bg-primary p-2 text-xs font-medium text-primary-foreground"><Building2 size={19} />Bank</button>
                <button onClick={() => setMethod("card")} className="glass flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium text-foreground hover:bg-accent"><CreditCard size={19} />Card</button>
              </div>
              <BankTransferFlow fixedAmount={paymentData.amount} requestCurrency={paymentData.currency} description={paymentData.description} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2" aria-label="Payment method">
                <button onClick={() => setMethod("mobile")} className="glass flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium text-foreground hover:bg-accent"><Smartphone size={19} />Mobile Money</button>
                <button onClick={() => setMethod("bank")} className="glass flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium text-foreground hover:bg-accent"><Building2 size={19} />Bank</button>
                <button className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl bg-primary p-2 text-xs font-medium text-primary-foreground"><CreditCard size={19} />Card</button>
              </div>
              <div className="rounded-2xl bg-accent p-6 text-center"><Clock3 className="mx-auto mb-3 text-primary" size={30} /><h2 className="font-semibold text-foreground">Card payments are coming soon</h2><p className="mt-1 text-sm text-muted-foreground">Please use Mobile Money or Bank Transfer for this payment.</p></div>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Powered by</span><BrandLogo className="h-4 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
