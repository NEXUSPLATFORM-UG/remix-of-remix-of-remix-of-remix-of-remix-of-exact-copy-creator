import { X, ArrowDownLeft, ArrowUpRight, Shield, Bell, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface NotificationSidebarProps {
  open: boolean;
  onClose: () => void;
}

const notifications = [
  { id: 1, icon: ArrowDownLeft, title: "Deposit Received", desc: "You received $4,500.00 salary deposit", time: "2 min ago", gradient: "stat-card-green", read: false },
  { id: 2, icon: ArrowUpRight, title: "Money Sent", desc: "You sent $250.00 to Alice Johnson", time: "15 min ago", gradient: "stat-card-blue", read: false },
  { id: 3, icon: Shield, title: "Insurance Due", desc: "Health Insurance premium due Mar 1", time: "1 hour ago", gradient: "stat-card-pink", read: false },
  { id: 4, icon: CheckCircle, title: "Transfer Complete", desc: "Bank transfer of $2,000.00 completed", time: "3 hours ago", gradient: "stat-card-cyan", read: true },
  { id: 5, icon: AlertTriangle, title: "Bill Reminder", desc: "Phone bill of $55.00 is due tomorrow", time: "5 hours ago", gradient: "stat-card-orange", read: true },
  { id: 6, icon: RefreshCw, title: "Currency Converted", desc: "Converted $500 → €460.75", time: "Yesterday", gradient: "stat-card-purple", read: true },
  { id: 7, icon: ArrowDownLeft, title: "Payment Received", desc: "QR payment of $75.00 received", time: "Yesterday", gradient: "stat-card-green", read: true },
  { id: 8, icon: Bell, title: "Savings Goal", desc: "You're 75% to your Emergency Fund goal!", time: "2 days ago", gradient: "stat-card-blue", read: true },
];

const NotificationSidebar = ({ open, onClose }: NotificationSidebarProps) => {
  if (!open) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm glass-heavy shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          <button onClick={onClose} className="glass w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-[hsl(0_0%_100%/0.5)] ${!n.read ? "bg-[hsl(0_0%_100%/0.3)]" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground shrink-0 ${n.gradient}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full glass py-2.5 rounded-xl text-xs font-medium text-foreground hover:bg-[hsl(0_0%_100%/0.6)] transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
