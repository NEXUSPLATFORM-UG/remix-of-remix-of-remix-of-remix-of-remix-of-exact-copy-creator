import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";

export type AuthMode = "login" | "register";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});
const loginSchema = registerSchema.pick({ email: true, password: true });

export const goAfterAuth = async (navigate: (p: string) => void) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data } = await supabase.from("businesses").select("id").eq("user_id", user.id).maybeSingle();
  navigate(data ? "/dashboard" : "/onboarding");
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8.1z"/>
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z"/>
    <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.2a11 11 0 0 0 0 9.9l3.6-2.8z"/>
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z"/>
  </svg>
);

interface Props { open: boolean; mode: AuthMode; onModeChange: (m: AuthMode) => void; onOpenChange: (o: boolean) => void; }

const AuthModal = ({ open, mode, onModeChange, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = (mode === "register" ? registerSchema : loginSchema).safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs); return;
    }
    setErrors({}); setLoading(true);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(), password: form.password,
          options: { emailRedirectTo: `${window.location.origin}/onboarding`, data: { first_name: form.firstName.trim(), last_name: form.lastName.trim() } },
        });
        if (error) throw error;
        if (data.session) { onOpenChange(false); navigate("/onboarding"); }
        else setSentTo(form.email.trim());
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
        if (error) throw error;
        onOpenChange(false);
        await goAfterAuth(navigate);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  const google = async () => {
    sessionStorage.setItem("postAuth", "1");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { sessionStorage.removeItem("postAuth"); toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    sessionStorage.removeItem("postAuth");
    onOpenChange(false);
    await goAfterAuth(navigate);
  };

  const field = (k: keyof typeof form, label: string, type = "text", auto?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} autoComplete={auto} value={form[k]} onChange={set(k)} className="h-11 rounded-xl bg-background/60" />
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSentTo(null); }}>
      <DialogContent className="glass-heavy rounded-3xl border-border/40 sm:max-w-md p-8">
        {sentTo ? (
          <div className="text-center py-4">
            <span className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center"><MailCheck size={26} /></span>
            <DialogTitle className="text-2xl font-bold mb-2">Check your email</DialogTitle>
            <DialogDescription>We sent a confirmation link to <b>{sentTo}</b>. Open it to continue to your business onboarding.</DialogDescription>
          </div>
        ) : (
          <>
            <div className="flex p-1 rounded-xl bg-muted/50 mb-2">
              {(["login", "register"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { onModeChange(m); setErrors({}); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === m ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                  {m === "login" ? "Log in" : "Register"}
                </button>
              ))}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</DialogTitle>
              <DialogDescription>{mode === "login" ? "Log in to your FinFlow wallet." : "Start moving money in minutes."}</DialogDescription>
            </div>
            <button type="button" onClick={google} className="w-full h-11 rounded-xl border border-border bg-background/70 flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted/50 transition-colors">
              <GoogleIcon /> Continue with Google
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <form onSubmit={submit} className="space-y-3">
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  {field("firstName", "First name", "text", "given-name")}
                  {field("lastName", "Last name", "text", "family-name")}
                </div>
              )}
              {field("email", "Email", "email", "email")}
              {field("password", "Password", "password", mode === "login" ? "current-password" : "new-password")}
              <button disabled={loading} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
