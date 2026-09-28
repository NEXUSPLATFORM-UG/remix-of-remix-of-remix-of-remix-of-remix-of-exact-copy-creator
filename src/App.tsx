import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Index from "./pages/Index";
import WalletPage from "./pages/WalletPage";
import SendPage from "./pages/SendPage";
import DepositPage from "./pages/DepositPage";
import TransferPage from "./pages/TransferPage";
import ReceivePage from "./pages/ReceivePage";
import UtilitiesPage from "./pages/UtilitiesPage";
import ConvertPage from "./pages/ConvertPage";
import SavingPage from "./pages/SavingPage";
import InsurancePage from "./pages/InsurancePage";
import DeveloperPage from "./pages/DeveloperPage";
import DocumentationPage from "./pages/DocumentationPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentPage from "./pages/PaymentPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/send" element={<SendPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/receive" element={<ReceivePage />} />
            <Route path="/utilities" element={<UtilitiesPage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/saving" element={<SavingPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
