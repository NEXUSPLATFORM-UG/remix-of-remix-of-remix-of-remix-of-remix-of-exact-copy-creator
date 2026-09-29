import { CheckCircle, Plus, FileText, RefreshCw, MessageCircle } from "lucide-react";
import { useMainCurrency } from "@/hooks/use-main-currency";

const RecentActivities = () => {
  const { format, code } = useMainCurrency();
  const activities = [
    { icon: CheckCircle, color: "stat-card-blue", title: "Payment Sent", desc: "Transfer to Alex completed", time: "6 min ago" },
    { icon: Plus, color: "stat-card-orange", title: "Deposit Received", desc: `${format(500)} deposited to wallet`, time: "3 hrs ago" },
    { icon: FileText, color: "stat-card-cyan", title: "Bill Paid", desc: `Electricity bill - ${format(120)}`, time: "6 hrs ago" },
    { icon: RefreshCw, color: "stat-card-green", title: "Converted", desc: `${code} → ${code === "USD" ? "EUR" : "USD"}`, time: "1 day ago" },
    { icon: MessageCircle, color: "stat-card-pink", title: "Insurance", desc: "Premium payment processed", time: "2 days ago" },
  ];
  return (
  <div className="glass rounded-2xl p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activities</h3>
    <div className="space-y-4">
      {activities.map((a, i) => {
        const Icon = a.icon;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground ${a.color}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.time}</span>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default RecentActivities;
