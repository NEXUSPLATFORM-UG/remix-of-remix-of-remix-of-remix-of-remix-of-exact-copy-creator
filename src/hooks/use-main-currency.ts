import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export const currencies = [
  { code: "UGX", name: "Ugandan Shilling", symbol: "UGX " },
  { code: "KES", name: "Kenyan Shilling", symbol: "KES " },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TZS " },
  { code: "RWF", name: "Rwandan Franc", symbol: "RWF " },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

export const countryCurrency: Record<string, string> = {
  Uganda: "UGX", Kenya: "KES", Tanzania: "TZS", Rwanda: "RWF", Nigeria: "NGN", Ghana: "GHS", "South Africa": "ZAR",
};

const KEY = "livra_currency";
let current = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) || "UGX";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const setLocal = (c: string) => { current = c; localStorage.setItem(KEY, c); emit(); };

let loaded = false;
const loadFromDb = async () => {
  if (loaded) return; loaded = true;
  const { data } = await supabase.auth.getUser();
  if (!data.user) { loaded = false; return; }
  const { data: b } = await supabase.from("businesses").select("main_currency").eq("user_id", data.user.id).maybeSingle();
  const c = (b as { main_currency?: string } | null)?.main_currency;
  if (c && c !== current) setLocal(c);
};
supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN") { loaded = false; loadFromDb(); } });

/** Save the main currency on this device and to the user's business record. */
export const saveMainCurrency = async (c: string) => {
  setLocal(c);
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  const { error } = await supabase.from("businesses").update({ main_currency: c }).eq("user_id", data.user.id);
  if (error) throw error;
};

const TOKEN = /(UGX|KES|TZS|RWF|NGN|GHS|ZAR|USD|EUR|GBP)\s?|[$€£₦]|GH₵/;

export const useMainCurrency = () => {
  const code = useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current);
  useEffect(() => { loadFromDb(); }, []);
  const cur = currencies.find((c) => c.code === code) ?? currencies[0];
  const format = (n: number) => `${cur.symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  /** Swap any currency sign in a sample text amount (e.g. "-$15.99") for the main currency. */
  const cx = (s: string) => s.replace(TOKEN, cur.symbol);
  return { code, symbol: cur.symbol, name: cur.name, format, cx, setCurrency: saveMainCurrency };
};
