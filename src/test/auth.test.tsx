import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { goAfterAuth } from "@/components/AuthModal";

const auth = vi.hoisted(() => ({ getUser: vi.fn(), onAuthStateChange: vi.fn(), from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth, from: auth.from } }));
vi.mock("@/components/DashboardSidebar", () => ({ default: () => null }));
vi.mock("@/integrations/lovable", () => ({ lovable: { auth: {} } }));

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
});

const renderDashboard = () => render(
  <MemoryRouter initialEntries={["/dashboard"]}>
    <Routes>
      <Route path="/" element={<p>Signed out destination</p>} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<p>Account content</p>} />
      </Route>
    </Routes>
  </MemoryRouter>,
);

describe("real account routing", () => {
  it("does not render dashboard content without a validated user", async () => {
    auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    renderDashboard();
    await screen.findByText("Signed out destination");
    expect(screen.queryByText("Account content")).toBeNull();
  });

  it("renders dashboard content after server user validation", async () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    renderDashboard();
    await screen.findByText("Account content");
    expect(auth.getUser).toHaveBeenCalled();
  });

  it("routes an existing business to the dashboard", async () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    auth.from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: "business-1" }, error: null }) }) }) });
    const navigate = vi.fn();
    await goAfterAuth(navigate);
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });

  it("does not treat a failed business lookup as a new account", async () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    auth.from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: new Error("Lookup failed") }) }) }) });
    const navigate = vi.fn();
    await expect(goAfterAuth(navigate)).rejects.toThrow("Lookup failed");
    expect(navigate).not.toHaveBeenCalled();
  });
});