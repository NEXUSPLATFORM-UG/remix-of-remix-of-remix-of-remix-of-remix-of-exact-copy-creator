import {
  LayoutDashboard, Wallet, Send, ArrowDownToLine, ArrowLeftRight,
  ArrowDownRight, Zap, RefreshCw, PiggyBank, Shield, Code2, BookOpen,
  ChevronLeft, ChevronRight, Settings, Users
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: Send, label: "Send", path: "/send" },
  { icon: ArrowDownToLine, label: "Deposit", path: "/deposit" },
  { icon: ArrowLeftRight, label: "Transfer", path: "/transfer" },
  { icon: ArrowDownRight, label: "Receive", path: "/receive" },
  { icon: Zap, label: "Utilities", path: "/utilities" },
  { icon: RefreshCw, label: "Convert", path: "/convert" },
  { icon: PiggyBank, label: "Saving", path: "/saving" },
  { icon: Shield, label: "Insurance", path: "/insurance" },
  { icon: Users, label: "Payroll", path: "/payroll" },
  { icon: Code2, label: "Developer", path: "/developer" },
  { icon: BookOpen, label: "Documentation", path: "/documentation" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`glass-sidebar min-h-screen flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
      <div className={`p-5 pb-3 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <BrandLogo className="h-8 w-auto max-w-[150px]" eager />
        )}
        {collapsed && (
          <BrandLogo compact className="h-8 w-8" eager />
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-auto mb-2 w-6 h-6 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 group
                ${isActive
                  ? "glass-heavy text-primary font-medium shadow-sm"
                  : "hover:bg-[hsl(0_0%_100%/0.3)] text-muted-foreground hover:text-foreground"
                }
                ${collapsed ? "justify-center px-2" : ""}`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
