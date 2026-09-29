import { useMainCurrency } from "@/hooks/use-main-currency";
import { Copy, QrCode, Share2, Link2, Smartphone, ArrowDownLeft, TrendingUp, CheckCircle, X, Loader2, AlertCircle, Building2, CreditCard, Clock3 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";
import { toast } from "@/hooks/use-toast";
import BankTransferFlow from "@/components/BankTransferFlow";
import { buildPaymentUrl, createPaymentLinkData } from "@/lib/payment-links";

const API_BASE = "https://api.livrauganda.workers.dev/api";

const recentReceived = [
  { name: "Alice Johnson", method: "Livra", amount: "+UGX 500", date: "Today", status: "Completed" },
  { name: "MTN Mobile", method: "Mobile Money", amount: "+UGX 200", date: "Yesterday", status: "Completed" },
  { name: "Payment Link", method: "Link", amount: "+UGX 1,200", date: "Feb 8", status: "Completed" },
  { name: "QR Payment", method: "QR Code", amount: "+UGX 75", date: "Feb 7", status: "Completed" },
  { name: "Mobile Request", method: "Mobile Money", amount: "+UGX 150", date: "Feb 6", status: "Pending" },
];

const receiveMethods = [
  { id: "qr" as const, icon: QrCode, label: "QR Code", desc: "Scan to pay", gradient: "stat-card-purple" },
  { id: "link" as const, icon: Link2, label: "Payment Link", desc: "Share a link", gradient: "stat-card-blue" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile Money", desc: "Request payment", gradient: "stat-card-orange" },
  { id: "bank" as const, icon: Building2, label: "Bank Transfer", desc: "Via Relworx", gradient: "stat-card-cyan" },
  { id: "card" as const, icon: CreditCard, label: "Card", desc: "Coming soon", gradient: "stat-card-green" },
];

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

type ModalStep = "form" | "processing" | "polling" | "success" | "error";

const ScanningQr = ({ value, compact = false }: { value: string; compact?: boolean }) => (
  <div className={`qr-gradient-frame ${compact ? "h-36 w-36" : "h-56 w-56"}`}>
    <div className="qr-code-surface">
      <QRCodeSVG
        value={value}
        size={compact ? 120 : 200}
        bgColor="transparent"
        fgColor="currentColor"
        className="h-full w-full text-foreground"
      />
      <span className="qr-scan-line" aria-hidden="true" />
    </div>
  </div>
);

const ReceivePage = () => {
  const { cx, symbol, code } = useMainCurrency();
  const [activeTab, setActiveTab] = useState<"qr" | "link" | "mobile" | "bank" | "card">("qr");
  const [requestAmount, setRequestAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // Mobile Money deposit state
  const [depositMsisdn, setDepositMsisdn] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [depositStep, setDepositStep] = useState<ModalStep>("form");
  const [depositError, setDepositError] = useState("");
  const [depositResult, setDepositResult] = useState<Record<string, unknown> | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const depositPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        if (data.success && data.request_status === "success") { stopPolling(pollRef); setResult(data); setStep("success"); toast({ title: "Success", description: data.message || "Payment received" }); }
        else if (data.request_status === "failed") { stopPolling(pollRef); setError(data.message || "Failed"); setStep("error"); }
      } catch { /* silent */ }
    }, 5000);
  }, [stopPolling]);

  const handleDeposit = async () => {
    if (!depositMsisdn || !depositAmount) return;
    setDepositStep("processing"); setDepositError("");
    try {
      const res = await fetch(`${API_BASE}/deposit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn: depositMsisdn, amount: parseFloat(depositAmount), description: depositDescription || "Payment request" }) });
      const data = await res.json();
      if (data.success && data.internal_reference) { setDepositStep("polling"); pollStatus(data.internal_reference, depositPollRef, setDepositStep, setDepositResult, setDepositError); }
      else { setDepositError(data.message || "Failed"); setDepositStep("error"); }
    } catch { setDepositError("Network error."); setDepositStep("error"); }
  };

  const closeDepositModal = () => { stopPolling(depositPollRef); setShowDepositModal(false); setDepositStep("form"); setDepositMsisdn(""); setDepositAmount(""); setDepositDescription(""); setDepositError(""); setDepositResult(null); };

  const generatePaymentLink = () => {
    const link = buildPaymentUrl(createPaymentLinkData(requestAmount, paymentDescription, code));
    setGeneratedLink(link);
    return link;
  };

  const handleCopyLink = () => {
    const link = generatedLink || generatePaymentLink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Payment link copied to clipboard" });
  };

  const handleShareQR = () => {
    const link = generatePaymentLink();
    toast({ title: "QR Code Ready", description: "Share this QR code for payment" });
  };

  const paymentUrl = generatedLink || buildPaymentUrl(createPaymentLinkData(requestAmount, paymentDescription, code));

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
      <PageHeader title="Receive" subtitle="Accept payments via QR, links, or mobile money" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Total Received" value={cx("UGX 8,450")} gradient="stat-card-green" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value={cx("UGX 2,125")} gradient="stat-card-blue" />
        <StatCardSmall icon={<QrCode size={18} />} label="QR Payments" value="32" gradient="stat-card-purple" />
        <StatCardSmall icon={<Link2 size={18} />} label="Link Payments" value="18" gradient="stat-card-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
            {receiveMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setActiveTab(m.id)}
                  className={`glass rounded-2xl p-4 text-left transition-all ${activeTab === m.id ? "ring-2 ring-secondary" : ""}`}>
                  <div className="flex items-center gap-2 mb-2"><RadioDot selected={activeTab === m.id} /></div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${m.gradient} mb-2`}><Icon size={18} /></div>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </button>
              );
            })}
          </div>

          {activeTab === "qr" && (
            <div className="glass rounded-2xl p-6 text-center">
              <div className="mb-4"><ScanningQr value={paymentUrl} /></div>
              <p className="text-sm font-medium text-foreground mb-1">Scan to pay</p>
              <p className="text-xs text-muted-foreground mb-4">Show this QR code to receive payment</p>
              <div className="space-y-3">
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Amount (optional)</label><input type="number" value={requestAmount} onChange={e => { setRequestAmount(e.target.value); setGeneratedLink(""); }} placeholder="0" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Description (optional)</label><input value={paymentDescription} onChange={e => { setPaymentDescription(e.target.value); setGeneratedLink(""); }} placeholder="What's this payment for?" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={handleShareQR} className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90"><Share2 size={16} /> Share QR Code</button>
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Create Payment Link</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Amount (UGX)</label><input type="number" value={requestAmount} onChange={e => { setRequestAmount(e.target.value); setGeneratedLink(""); }} placeholder="Enter amount" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">Description</label><input value={paymentDescription} onChange={e => { setPaymentDescription(e.target.value); setGeneratedLink(""); }} placeholder="What's this payment for?" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={() => { generatePaymentLink(); toast({ title: "Link Generated!", description: "Your payment link is ready" }); }} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90"><Link2 size={16} /> Generate Payment Link</button>
                {generatedLink && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input readOnly value={generatedLink} className="glass-input flex-1 px-4 py-3 rounded-xl text-xs font-mono text-foreground focus:outline-none truncate" />
                      <button onClick={handleCopyLink} className="glass w-12 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <CheckCircle size={16} className="text-chart-green" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-2">QR Code for this link</p>
                      <ScanningQr value={generatedLink} compact />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "mobile" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Request Payment via Mobile Money</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-muted-foreground mb-1.5 block">msisdn <span className="text-[10px]">(Payer's mobile money number)</span></label><input value={depositMsisdn} onChange={e => setDepositMsisdn(e.target.value)} placeholder="+256701234567" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">amount <span className="text-[10px]">(UGX)</span></label><input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="5000" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <div><label className="text-xs text-muted-foreground mb-1.5 block">description</label><input value={depositDescription} onChange={e => setDepositDescription(e.target.value)} placeholder="e.g. Payment for services" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" /></div>
                <button onClick={() => setShowDepositModal(true)} disabled={!depositMsisdn || !depositAmount} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"><Smartphone size={16} /> Request Payment</button>
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="glass rounded-2xl p-6">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">Receive with Bank Transfer</h3>
                <p className="mt-1 text-xs text-muted-foreground">Select an available Relworx bank product and use its required fields.</p>
              </div>
              <BankTransferFlow requestCurrency={code} description={paymentDescription || "Bank payment"} />
            </div>
          )}

          {activeTab === "card" && (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="stat-card-green mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"><CreditCard size={28} /></div>
              <h3 className="text-lg font-semibold text-foreground">Card payments are coming soon</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Card payments will be available after the secure card connection is completed.</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground"><Clock3 size={14} /> Temporarily unavailable</div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Received</h3>
          <div className="space-y-3">
            {recentReceived.map((tx, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-xl stat-card-green flex items-center justify-center text-primary-foreground"><ArrowDownLeft size={14} /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{tx.name}</p><p className="text-xs text-muted-foreground">{tx.method} • {tx.date}</p></div>
                <div className="text-right"><span className="text-sm font-semibold text-chart-green">{cx(tx.amount)}</span><p className={`text-[10px] ${tx.status === "Completed" ? "text-chart-green" : "text-chart-orange"}`}>{tx.status}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Money Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={closeDepositModal}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{depositStep === "success" ? "Payment Received!" : depositStep === "polling" ? "Waiting for Payment..." : "Confirm Request"}</h3>
              <button onClick={closeDepositModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            {depositStep === "success" ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto"><CheckCircle size={28} className="text-primary-foreground" /></div>
                <p className="text-lg font-semibold text-foreground">Payment Received</p>
                {renderResult(depositResult)}
                <button onClick={closeDepositModal} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">Done</button>
              </div>
            ) : depositStep === "polling" ? (
              <div className="space-y-4 text-center py-6"><Loader2 size={32} className="animate-spin text-secondary mx-auto" /><p className="text-sm font-medium text-foreground">Waiting for payer to complete...</p></div>
            ) : depositStep === "processing" ? (
              <div className="flex items-center justify-center py-10"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-3">
                {depositError && <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} /> {depositError}</div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">msisdn</span><span className="font-medium text-foreground">{depositMsisdn}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">amount</span><span className="font-semibold text-foreground">UGX {depositAmount}</span></div>
                {depositDescription && <div className="flex justify-between text-sm"><span className="text-muted-foreground">description</span><span className="font-medium text-foreground">{depositDescription}</span></div>}
                <button onClick={handleDeposit} className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2"><Smartphone size={16} /> Send Payment Request</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReceivePage;
