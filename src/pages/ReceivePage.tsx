import { ArrowDownRight, Copy, QrCode, Share2, Link2, Smartphone, ArrowDownLeft, TrendingUp, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const recentReceived = [
  { name: "Alice Johnson", method: "Livra", amount: "+$500.00", date: "Today", status: "Completed" },
  { name: "MTN Mobile", method: "Mobile Money", amount: "+$200.00", date: "Yesterday", status: "Completed" },
  { name: "Payment Link", method: "Link", amount: "+$1,200.00", date: "Feb 8", status: "Completed" },
  { name: "QR Payment", method: "QR Code", amount: "+$75.00", date: "Feb 7", status: "Completed" },
  { name: "Mobile Request", method: "Mobile Money", amount: "+$150.00", date: "Feb 6", status: "Pending" },
];

const receiveMethods = [
  { id: "qr" as const, icon: QrCode, label: "QR Code", desc: "Scan to receive", gradient: "stat-card-purple" },
  { id: "link" as const, icon: Link2, label: "Payment Link", desc: "Share a link", gradient: "stat-card-blue" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile Money", desc: "Request payment", gradient: "stat-card-orange" },
];

const RadioDot = ({ selected }: { selected: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
    {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
  </div>
);

const ReceivePage = () => {
  const [activeTab, setActiveTab] = useState<"qr" | "link" | "mobile">("qr");
  const [requestAmount, setRequestAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [modalMethod, setModalMethod] = useState<"qr" | "link" | "mobile">("qr");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openModal = (method: "qr" | "link" | "mobile") => {
    setModalMethod(method);
    setShowReceiveModal(true);
  };

  return (
    <>
      <PageHeader title="Receive" subtitle="Accept payments via QR, links, or mobile money" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Total Received" value="$8,450" gradient="stat-card-green" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value="$2,125" gradient="stat-card-blue" />
        <StatCardSmall icon={<QrCode size={18} />} label="QR Payments" value="32" gradient="stat-card-purple" />
        <StatCardSmall icon={<Link2 size={18} />} label="Link Payments" value="18" gradient="stat-card-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          {/* Method selector with round markers */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {receiveMethods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setActiveTab(m.id)}
                  className={`glass rounded-2xl p-4 text-left transition-all ${activeTab === m.id ? "ring-2 ring-secondary" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioDot selected={activeTab === m.id} />
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

          {activeTab === "qr" && (
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-52 h-52 rounded-2xl glass-heavy flex items-center justify-center mx-auto mb-4">
                <QrCode size={140} className="text-foreground/70" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Scan to pay</p>
              <p className="text-xs text-muted-foreground mb-4">Show this QR code to receive payment</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Request Amount (optional)</label>
                  <input type="number" value={requestAmount} onChange={e => setRequestAmount(e.target.value)}
                    placeholder="$0.00" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
                <button onClick={() => openModal("qr")}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Share2 size={16} /> Share QR Code
                </button>
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Payment Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Your Wallet ID</label>
                  <div className="flex gap-2">
                    <input readOnly value="finflow-usr-8f3k2m9x" className="glass-input flex-1 px-4 py-3 rounded-xl text-sm font-mono text-foreground focus:outline-none" />
                    <button onClick={handleCopy} className="glass w-12 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <CheckCircle size={16} className="text-chart-green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Request Amount (optional)</label>
                  <input type="number" value={requestAmount} onChange={e => setRequestAmount(e.target.value)}
                    placeholder="$0.00" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
                <button onClick={() => openModal("link")}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Share2 size={16} /> Generate & Share Payment Link
                </button>
              </div>
            </div>
          )}

          {activeTab === "mobile" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Mobile Money Payment Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</label>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                  <input type="number" value={requestAmount} onChange={e => setRequestAmount(e.target.value)}
                    placeholder="$0.00" className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Provider</label>
                  <select className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                    <option>MTN Mobile Money</option><option>Airtel Money</option><option>Vodafone Cash</option>
                  </select>
                </div>
                <button onClick={() => openModal("mobile")}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <Smartphone size={16} /> Send Payment Request
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Received</h3>
          <div className="space-y-3">
            {recentReceived.map((tx, i) => (
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

      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowReceiveModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {modalMethod === "qr" ? "QR Code Shared!" : modalMethod === "link" ? "Payment Link Generated!" : "Request Sent!"}
              </h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-3">
                <CheckCircle size={32} />
              </div>
              <p className="text-sm text-foreground font-medium mb-1">
                {modalMethod === "qr" ? "Your QR code has been shared" : modalMethod === "link" ? "Payment link copied to clipboard" : "Payment request sent successfully"}
              </p>
              {requestAmount && <p className="text-lg font-bold text-foreground">Amount: ${requestAmount}</p>}
            </div>
            <button onClick={() => { setShowReceiveModal(false); setRequestAmount(""); setPhoneNumber(""); }}
              className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity">
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceivePage;
