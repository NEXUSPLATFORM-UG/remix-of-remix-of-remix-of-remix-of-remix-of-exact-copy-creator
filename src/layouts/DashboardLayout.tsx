import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = () => {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const validate = async () => {
      const request = ++revision;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (active && request === revision) setSignedIn(!error && Boolean(data.user));
      } catch {
        if (active && request === revision) setSignedIn(false);
      }
    };
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") { revision++; setSignedIn(false); }
      else if (event === "SIGNED_IN") setTimeout(() => { if (active) void validate(); }, 0);
    });
    void validate();
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  if (signedIn === null) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" aria-label="Checking account" /></div>;
  if (!signedIn) return <Navigate to="/" replace />;
  return (
  <div className="flex min-h-screen liquid-gradient-bg">
    <DashboardSidebar />
    <main className="flex-1 p-6 overflow-auto">
      <Outlet />
    </main>
  </div>
);
};

export default DashboardLayout;
