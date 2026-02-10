import { Search, Bell, User } from "lucide-react";
import { useState } from "react";
import NotificationSidebar from "./NotificationSidebar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="glass-input pl-9 pr-4 py-2 text-sm rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="glass w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            <User size={16} />
          </button>
        </div>
      </div>
      <NotificationSidebar open={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default PageHeader;
