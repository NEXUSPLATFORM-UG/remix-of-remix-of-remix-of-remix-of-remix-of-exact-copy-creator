import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { validateBankTransfer, purchaseBankTransfer } from "@/lib/relworx";
import { ChevronLeft, ChevronRight, Trash2, UserPlus, ShieldCheck, ShieldOff, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";

const API = "https://api.livrauganda.workers.dev/api";
type Worker = { id: string; full_name: string; phone: string; payout_method: string; bank_product_code: string | null; bank_name: string | null; bank_account: string | null; daily_rate: number; active: boolean };
type Member = { id: string; email: string; status: string };
type Pay = { id: string; worker_id: string; amount: number; days: number; status: string; method: string; created_at: string; period_start: string; period_end: string };

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const ugx = (n: number) => `UGX ${Math.round(n).toLocaleString()}`;
const input = "glass-input w-full px-3 py-2 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";
const btn = "px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50";

const PayrollPage = () => {
  const [tab, setTab] = useState<"workers" | "attendance" | "pay" | "admins">("workers");
  const [biz, setBiz] = useState<{ id: string; user_id: string } | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [att, setAtt] = useState<{ worker_id: string; work_date: string }[]>([]);
  const [pays, setPays] = useState<Pay[]>([]);
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selWorker, setSelWorker] = useState<string>("");
  const [form, setForm] = useState({ full_name: "", phone: "", payout_method: "mobile_money", bank_product_code: "", bank_name: "", bank_account: "", daily_rate: "" });
  const [invite, setInvite] = useState("");
  const [paying, setPaying] = useState<string | null>(null);

  const isOwner = !!biz && biz.user_id === uid;
  const monthStart = ymd(month);
  const monthEnd = ymd(new Date(month.getFullYear(), month.getMonth() + 1, 0));

  const load = useCallback(async () => {
    if (!biz) return;
    const [w, m, a, p] = await Promise.all([
      supabase.from("workers").select("*").eq("business_id", biz.id).order("created_at"),
      supabase.from("business_members").select("id,email,status").eq("business_id", biz.id).order("created_at"),
      supabase.from("attendance").select("worker_id,work_date").eq("business_id", biz.id).gte("work_date", monthStart).lte("work_date", monthEnd),
      supabase.from("payroll_payments").select("*").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(50),
    ]);
    setWorkers((w.data as Worker[]) ?? []);
    setMembers((m.data as Member[]) ?? []);
    setAtt(a.data ?? []);
    setPays((p.data as Pay[]) ?? []);
  }, [biz, monthStart, monthEnd]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setLoading(false); return; }
      setUid(data.user.id);
      const { data: b } = await supabase.from("businesses").select("id,user_id").order("created_at").limit(10);
      const own = b?.find((x) => x.user_id === data.user?.id) ?? b?.[0] ?? null;
      setBiz(own);
      if (own && data.user.email) {
        await supabase.from("business_members").update({ user_id: data.user.id, status: "active" }).eq("business_id", own.id).eq("email", data.user.email.toLowerCase()).eq("status", "invited");
      }
      setLoading(false);
    })();
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!selWorker && workers[0]) setSelWorker(workers[0].id); }, [workers, selWorker]);

  const daysFor = (wid: string) => att.filter((a) => a.worker_id === wid).length;

  const addWorker = async () => {
    if (!biz) return;
    const rate = Number(form.daily_rate);
    if (!form.full_name.trim() || !/^\+?\d{9,15}$/.test(form.phone.trim()) || !(rate > 0)) return toast.error("Enter a name, a valid phone number (e.g. 256700000000) and a daily rate.");
    if (form.payout_method === "bank" && (!form.bank_product_code.trim() || !form.bank_account.trim())) return toast.error("Enter the bank code and account number.");
    const { error } = await supabase.from("workers").insert({
      business_id: biz.id, full_name: form.full_name.trim().slice(0, 100), phone: form.phone.trim(), payout_method: form.payout_method,
      bank_product_code: form.bank_product_code.trim() || null, bank_name: form.bank_name.trim() || null, bank_account: form.bank_account.trim() || null, daily_rate: rate,
    });
    if (error) return toast.error(error.message);
    toast.success("Worker added");
    setForm({ full_name: "", phone: "", payout_method: "mobile_money", bank_product_code: "", bank_name: "", bank_account: "", daily_rate: "" });
    load();
  };

  const removeWorker = async (id: string) => {
    if (!confirm("Remove this worker?")) return;
    const { error } = await supabase.from("workers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Worker removed"); load();
  };

  const toggleDay = async (date: string) => {
    if (!biz || !selWorker) return;
    const has = att.some((a) => a.worker_id === selWorker && a.work_date === date);
    const { error } = has
      ? await supabase.from("attendance").delete().eq("worker_id", selWorker).eq("work_date", date)
      : await supabase.from("attendance").insert({ worker_id: selWorker, business_id: biz.id, work_date: date });
    if (error) return toast.error(error.message);
    load();
  };

  const payWorker = async (w: Worker) => {
    if (!biz) return;
    const days = daysFor(w.id); const amount = days * Number(w.daily_rate);
    if (amount <= 0) return toast.error("No attendance days this month.");
    if (!confirm(`Pay ${w.full_name} ${ugx(amount)} for ${days} day(s)?`)) return;
    setPaying(w.id);
    let status = "failed"; let reference: string | null = null;
    try {
      if (w.payout_method === "bank") {
        if (!w.bank_account || !w.bank_product_code) throw new Error("This worker's bank details are incomplete.");
        const v = await validateBankTransfer({ msisdn: w.bank_account, amount, product_code: w.bank_product_code, contact_phone: w.phone });
        const p = await purchaseBankTransfer(v.validation_reference);
        reference = p.internal_reference ?? v.validation_reference; status = "success";
      } else {
        const res = await fetch(`${API}/withdraw`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ msisdn: w.phone, amount, description: `Payroll ${monthStart.slice(0, 7)}` }) });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.message || "Payout failed");
        reference = d.internal_reference ?? null; status = "pending";
      }
      toast.success(`Payout sent to ${w.full_name}`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Payout failed"); }
    await supabase.from("payroll_payments").insert({ worker_id: w.id, business_id: biz.id, period_start: monthStart, period_end: monthEnd, days, amount, method: w.payout_method, status, reference });
    setPaying(null); load();
  };

  const inviteAdmin = async () => {
    const email = invite.trim().toLowerCase();
    if (!biz || !/^\S+@\S+\.\S+$/.test(email) || email.length > 255) return toast.error("Enter a valid email.");
    const { error } = await supabase.from("business_members").upsert({ business_id: biz.id, email, status: "invited" }, { onConflict: "business_id,email" });
    if (error) return toast.error(error.message);
    toast.success("Admin invited — they get access when they sign in with this email."); setInvite(""); load();
  };
  const setMember = async (m: Member, status: string) => {
    const { error } = status === "delete" ? await supabase.from("business_members").delete().eq("id", m.id) : await supabase.from("business_members").update({ status }).eq("id", m.id);
    if (error) return toast.error(error.message);
    load();
  };

  const cal = useMemo(() => {
    const first = month.getDay(); const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  }, [month]);
  const monthLabel = month.toLocaleString(undefined, { month: "long", year: "numeric" });
  const sel = workers.find((w) => w.id === selWorker);
  const payrollTotal = workers.reduce((sum, worker) => sum + daysFor(worker.id) * Number(worker.daily_rate), 0);

  const printSection = (target: "payroll" | "history") => {
    document.body.dataset.printTarget = target;
    const cleanup = () => {
      delete document.body.dataset.printTarget;
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    window.setTimeout(cleanup, 1000);
  };

  const PrintHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="hidden print:block border-b-2 border-foreground pb-4 mb-5">
      <div className="flex items-end justify-between gap-6">
        <BrandLogo className="h-8 w-auto" eager />
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Official payroll record</p>
      </div>
      <h1 className="mt-6 font-serif text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );

  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!uid || !biz) return <div><PageHeader title="Payroll" /><div className="glass-card p-8 rounded-2xl text-muted-foreground">Sign in and complete business onboarding to use Payroll.</div></div>;

  const MonthNav = () => (
    <div className="flex items-center gap-2">
      <button className="glass w-8 h-8 rounded-lg flex items-center justify-center" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={14} /></button>
      <span className="text-sm font-medium w-36 text-center">{monthLabel}</span>
      <button className="glass w-8 h-8 rounded-lg flex items-center justify-center" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={14} /></button>
    </div>
  );

  return (
    <div>
      <PageHeader title="Payroll" subtitle="Pay your workers to mobile money or bank, based on days worked" />
      <div className="flex gap-2 mb-5">
        {([["workers", "Workers"], ["attendance", "Attendance"], ["pay", "Run Payroll"], ["admins", "Admins"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl text-sm ${tab === k ? "glass-heavy text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
        ))}
      </div>

      {tab === "workers" && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-5">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="font-semibold">Add worker</h3>
            <input className={input} placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input className={input} placeholder="Phone (256700000000)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className={input} type="number" placeholder="Daily rate (UGX)" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} />
            <select className={input} value={form.payout_method} onChange={(e) => setForm({ ...form, payout_method: e.target.value })}>
              <option value="mobile_money">Mobile Money</option><option value="bank">Bank account</option>
            </select>
            {form.payout_method === "bank" && (<>
              <input className={input} placeholder="Bank name" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} />
              <input className={input} placeholder="Bank product code (from Transfer page)" value={form.bank_product_code} onChange={(e) => setForm({ ...form, bank_product_code: e.target.value })} />
              <input className={input} placeholder="Account number" value={form.bank_account} onChange={(e) => setForm({ ...form, bank_account: e.target.value })} />
            </>)}
            <button className={`${btn} w-full`} onClick={addWorker}><UserPlus size={14} className="inline mr-1" />Add worker</button>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Workers ({workers.length})</h3>
            {workers.length === 0 ? <p className="text-sm text-muted-foreground">No workers yet.</p> : (
              <div className="space-y-2">{workers.map((w) => (
                <div key={w.id} className="glass rounded-xl p-3 flex items-center justify-between">
                  <div><p className="font-medium text-sm">{w.full_name}</p><p className="text-xs text-muted-foreground">{w.payout_method === "bank" ? `${w.bank_name ?? "Bank"} · ${w.bank_account}` : `Mobile Money · ${w.phone}`} · {ugx(w.daily_rate)}/day</p></div>
                  <button onClick={() => removeWorker(w.id)} className="text-destructive p-2"><Trash2 size={16} /></button>
                </div>))}</div>
            )}
          </div>
        </div>
      )}

      {tab === "attendance" && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <select className={`${input} max-w-xs`} value={selWorker} onChange={(e) => setSelWorker(e.target.value)}>
              {workers.map((w) => <option key={w.id} value={w.id}>{w.full_name}</option>)}
            </select>
            <MonthNav />
          </div>
          {!sel ? <p className="text-sm text-muted-foreground">Add a worker first.</p> : (<>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-2">{cal.map((d, i) => {
              if (!d) return <div key={i} />;
              const k = ymd(d); const on = att.some((a) => a.worker_id === selWorker && a.work_date === k);
              return <button key={k} onClick={() => toggleDay(k)} className={`h-12 rounded-xl text-sm transition-all ${on ? "bg-primary text-primary-foreground font-semibold" : "glass hover:text-primary"}`}>{d.getDate()}</button>;
            })}</div>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Tap a day to mark present. {daysFor(sel.id)} day(s) × {ugx(sel.daily_rate)}</span><span className="font-semibold">{ugx(daysFor(sel.id) * Number(sel.daily_rate))}</span></div>
          </>)}
        </div>
      )}

      {tab === "pay" && (
        <div className="space-y-4">
          <section className="payroll-print-area overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <PrintHeading title="Payroll Register" subtitle={`Pay period: ${monthLabel}`} />
            <div className="print-hidden flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h3 className="font-serif text-lg font-semibold">Payroll register</h3>
                <p className="text-xs text-muted-foreground">{workers.length} workers · {monthLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <MonthNav />
                <Button variant="outline" size="sm" onClick={() => printSection("payroll")} title="Print payroll or save as PDF">
                  <Printer /> Print PDF
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-xs">
                <thead className="bg-muted/60 text-left text-[10px] uppercase text-muted-foreground">
                  <tr><th className="px-4 py-2 font-semibold">Worker</th><th className="px-3 py-2 font-semibold">Payout method</th><th className="px-3 py-2 text-right font-semibold">Days</th><th className="px-3 py-2 text-right font-semibold">Daily rate</th><th className="px-3 py-2 text-right font-semibold">Gross pay</th><th className="print-hidden w-20 px-4 py-2" /></tr>
                </thead>
                <tbody>{workers.map((w) => { const d = daysFor(w.id); return (
                  <tr key={w.id} className="border-t border-border/70 hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-medium">{w.full_name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{w.payout_method === "bank" ? `Bank · ${w.bank_name ?? "Account"}` : "Mobile Money"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{d}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{ugx(w.daily_rate)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{ugx(d * Number(w.daily_rate))}</td>
                    <td className="print-hidden px-4 py-1.5 text-right"><Button size="sm" className="h-7 px-3 text-xs" disabled={!!paying || d === 0} onClick={() => payWorker(w)}>{paying === w.id ? <Loader2 className="animate-spin" /> : "Pay"}</Button></td>
                  </tr>); })}</tbody>
                <tfoot className="border-t-2 border-foreground/70 bg-muted/40">
                  <tr><td colSpan={4} className="px-4 py-3 text-right font-serif text-sm font-semibold">Total payroll</td><td className="px-3 py-3 text-right font-serif text-base font-semibold tabular-nums">{ugx(payrollTotal)}</td><td className="print-hidden" /></tr>
                </tfoot>
              </table>
            </div>
            {workers.length === 0 && <p className="px-4 py-8 text-center text-sm text-muted-foreground">No workers have been added.</p>}
            <div className="hidden print:grid grid-cols-2 gap-16 pt-16 text-xs">
              <div className="border-t border-foreground pt-2">Prepared by</div><div className="border-t border-foreground pt-2">Approved by</div>
            </div>
          </section>

          <section className="history-print-area overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <PrintHeading title="Payroll Payment History" subtitle="Payout record for the latest transactions" />
            <div className="print-hidden flex items-center justify-between border-b border-border px-4 py-3">
              <div><h3 className="font-serif text-lg font-semibold">Payment history</h3><p className="text-xs text-muted-foreground">Latest {pays.length} payroll payouts</p></div>
              <Button variant="outline" size="sm" onClick={() => printSection("history")} title="Print payment history or save as PDF"><Printer /> Print PDF</Button>
            </div>
            {pays.length === 0 ? <p className="px-4 py-8 text-center text-sm text-muted-foreground">No payouts yet.</p> : (
              <div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-xs">
                <thead className="bg-muted/60 text-left text-[10px] uppercase text-muted-foreground"><tr><th className="px-4 py-2">Date</th><th className="px-3 py-2">Worker</th><th className="px-3 py-2">Period</th><th className="px-3 py-2 text-right">Days</th><th className="px-3 py-2">Method</th><th className="px-3 py-2 text-right">Amount</th><th className="px-4 py-2 text-right">Status</th></tr></thead>
                <tbody>{pays.map((p) => (
                  <tr key={p.id} className="border-t border-border/70">
                    <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td><td className="px-3 py-2.5 font-medium">{workers.find((w) => w.id === p.worker_id)?.full_name ?? "Worker"}</td><td className="px-3 py-2.5 text-muted-foreground">{p.period_start.slice(0, 7)}</td><td className="px-3 py-2.5 text-right tabular-nums">{p.days}</td><td className="px-3 py-2.5 capitalize text-muted-foreground">{p.method.replace("_", " ")}</td><td className="px-3 py-2.5 text-right font-semibold tabular-nums">{ugx(p.amount)}</td><td className={`px-4 py-2.5 text-right font-medium capitalize ${p.status === "failed" ? "text-destructive" : "text-primary"}`}>{p.status}</td>
                  </tr>))}</tbody>
              </table></div>
            )}
          </section>
        </div>
      )}

      {tab === "admins" && (
        <div className="glass-card rounded-2xl p-5 max-w-2xl">
          <h3 className="font-semibold mb-1">Admins</h3>
          <p className="text-xs text-muted-foreground mb-4">{isOwner ? "Only you (the owner) can invite or revoke admins." : "Only the business owner can invite or revoke admins."}</p>
          {isOwner && (
            <div className="flex gap-2 mb-4"><input className={input} placeholder="admin@email.com" value={invite} onChange={(e) => setInvite(e.target.value)} /><button className={btn} onClick={inviteAdmin}>Invite</button></div>
          )}
          {members.length === 0 ? <p className="text-sm text-muted-foreground">No admins yet.</p> : members.map((m) => (
            <div key={m.id} className="glass rounded-xl p-3 mb-2 flex items-center justify-between">
              <div><p className="text-sm">{m.email}</p><p className="text-xs text-muted-foreground capitalize">{m.status}</p></div>
              {isOwner && (<div className="flex gap-2">
                {m.status === "revoked"
                  ? <button className="glass px-3 py-1.5 rounded-lg text-xs" onClick={() => setMember(m, "invited")}><ShieldCheck size={12} className="inline mr-1" />Restore</button>
                  : <button className="glass px-3 py-1.5 rounded-lg text-xs text-destructive" onClick={() => setMember(m, "revoked")}><ShieldOff size={12} className="inline mr-1" />Revoke</button>}
                <button className="text-destructive p-1.5" onClick={() => setMember(m, "delete")}><Trash2 size={14} /></button>
              </div>)}
            </div>))}
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
