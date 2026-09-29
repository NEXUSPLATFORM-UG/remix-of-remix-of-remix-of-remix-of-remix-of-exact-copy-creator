import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const businessTypes: Record<string, string[]> = {
  Uganda: ["Sole Proprietorship", "Partnership", "Private Limited Company (Ltd)", "Public Limited Company (PLC)", "Company Limited by Guarantee", "NGO", "SACCO / Cooperative"],
  Kenya: ["Sole Proprietorship", "Partnership", "Limited Liability Partnership (LLP)", "Private Limited Company", "Public Limited Company", "NGO / Society", "SACCO / Cooperative"],
  Tanzania: ["Sole Proprietorship", "Partnership", "Private Company Limited", "Public Company Limited", "NGO", "Cooperative Society"],
  Rwanda: ["Sole Proprietorship", "Private Limited Company (Ltd)", "Public Limited Company", "Cooperative", "NGO"],
  Nigeria: ["Business Name (Sole / Partnership)", "Private Limited Company (Ltd)", "Public Limited Company (PLC)", "Limited Liability Partnership (LLP)", "Incorporated Trustees (NGO)"],
  Ghana: ["Sole Proprietorship", "Partnership", "Private Limited Company", "Public Limited Company", "Company Limited by Guarantee"],
  "South Africa": ["Sole Proprietor", "Partnership", "Private Company (Pty) Ltd", "Public Company (Ltd)", "Non-Profit Company (NPC)", "Personal Liability Company (Inc)"],
};

const schema = z.object({
  country: z.string().min(1, "Choose a country"),
  businessType: z.string().min(1, "Choose a business type"),
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  location: z.string().trim().min(2, "Enter your business location").max(200),
});

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ country: "", businessType: "", currency: "", businessName: "", location: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const stepsList = [
    { key: "country", title: "Where is your business?", hint: "Choose the country your business is registered in." },
    { key: "businessType", title: "What type of business?", hint: "Types available for your country." },
    { key: "currency", title: "Choose your main currency", hint: "Your dashboard balances and totals will show in this currency." },
    { key: "businessName", title: "What's your business called?", hint: "Use the registered name." },
    { key: "location", title: "Where are you located?", hint: "City and street or plot." },
    { key: "documents", title: "Upload business documents", hint: "We use these to verify your business." },
  ];
  const next = () => {
    const k = stepsList[step].key;
    if (k === "documents") { submit(); return; }
    const r = (schema.shape as Record<string, z.ZodTypeAny>)[k].safeParse(form[k as keyof typeof form]);
    if (!r.success) { setErrors({ [k]: r.error.issues[0].message }); return; }
    setErrors({}); setStep(step + 1);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/"); return; }
      setUserId(data.user.id);
    });
  }, [navigate]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const ok = Array.from(list).filter((f) => {
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} is larger than 10MB`); return false; }
      return true;
    });
    setFiles((p) => [...p, ...ok].slice(0, 5));
  };

  const submit = async () => {
    const parsed = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
    if (files.length === 0) errs.documents = "Upload at least one business document";
    setErrors(errs);
    if (Object.keys(errs).length || !userId) return;
    setLoading(true);
    try {
      const paths: string[] = [];
      for (const f of files) {
        const path = `${userId}/${Date.now()}-${f.name.replace(/[^\w.-]/g, "_")}`;
        const { error } = await supabase.storage.from("business-documents").upload(path, f);
        if (error) throw error;
        paths.push(path);
      }
      const { error } = await supabase.from("businesses").upsert({
        user_id: userId, country: form.country, business_type: form.businessType,
        business_name: form.businessName.trim(), location: form.location.trim(), document_paths: paths,
      }, { onConflict: "user_id" });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen liquid-gradient-bg text-foreground flex flex-col">
      <header className="w-full px-6 lg:px-12 h-16 flex items-center">
        <Link to="/" aria-label="LIVRA home" className="flex items-center">
          <BrandLogo eager className="h-8 w-auto" />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="glass-heavy rounded-3xl p-8 md:p-10 w-full max-w-xl">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
              <h1 className="text-2xl font-bold mb-2">Business submitted</h1>
              <p className="text-muted-foreground mb-6">We're reviewing your documents. You can start using your wallet now.</p>
              <button onClick={() => navigate("/dashboard")} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">Go to dashboard</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-6">
              <div>
                <p className="text-xs font-medium text-primary mb-2">Step {step + 1} of {stepsList.length}</p>
                <div className="flex gap-1.5 mb-5">
                  {stepsList.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />)}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{stepsList[step].title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{stepsList[step].hint}</p>
              </div>

              <div className="milk-card rounded-2xl p-5 space-y-2">
                {step === 0 && (<>
                  <Label>Country</Label>
                  <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v, businessType: "" })}>
                    <SelectTrigger className="h-12 rounded-xl bg-background/70"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>{Object.keys(businessTypes).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </>)}
                {step === 1 && (<>
                  <Label>Business type in {form.country}</Label>
                  <Select value={form.businessType} onValueChange={(v) => setForm({ ...form, businessType: v })}>
                    <SelectTrigger className="h-12 rounded-xl bg-background/70"><SelectValue placeholder="Select business type" /></SelectTrigger>
                    <SelectContent>{(businessTypes[form.country] ?? []).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </>)}
                {step === 2 && (<>
                  <Label htmlFor="bn">Business name</Label>
                  <Input id="bn" autoFocus value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="h-12 rounded-xl bg-background/70" />
                </>)}
                {step === 3 && (<>
                  <Label htmlFor="loc">Location</Label>
                  <Input id="loc" autoFocus placeholder="City, street / plot" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="h-12 rounded-xl bg-background/70" />
                </>)}
                {step === 4 && (<>
                  <Label>Business documents</Label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                    <UploadCloud className="text-primary" />
                    <span className="text-sm font-medium">Upload registration certificate, tax ID, licence</span>
                    <span className="text-xs text-muted-foreground">PDF, JPG or PNG · up to 10MB each · max 5 files</span>
                    <input type="file" multiple accept=".pdf,image/*" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                  </label>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-background/70 rounded-xl px-3 py-2">
                      <FileText size={16} className="text-primary" /><span className="flex-1 truncate">{f.name}</span>
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove"><X size={16} /></button>
                    </div>
                  ))}
                </>)}
                {errors[stepsList[step].key] && <p className="text-xs text-destructive">{errors[stepsList[step].key]}</p>}
              </div>

              <div className="flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => { setErrors({}); setStep(step - 1); }} className="h-12 px-5 rounded-xl milk-card font-medium flex items-center gap-1"><ChevronLeft size={16} /> Back</button>
                )}
                <button disabled={loading} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {step === stepsList.length - 1 ? "Submit" : <>Continue <ChevronRight size={16} /></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
