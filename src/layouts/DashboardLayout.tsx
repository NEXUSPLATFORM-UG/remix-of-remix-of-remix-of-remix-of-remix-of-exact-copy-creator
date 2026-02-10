import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = () => (
  <div className="flex min-h-screen liquid-gradient-bg">
    <DashboardSidebar />
    <main className="flex-1 p-6 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
