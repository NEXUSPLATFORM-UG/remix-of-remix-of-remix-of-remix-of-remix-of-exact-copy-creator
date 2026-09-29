import { useEffect, useState } from "react";
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

export const useMainCurrency = () => {
  const [code, setCode] = useState<string>(() => localStorage.getItem("livra_currency") || "UGX");
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: b } = await supabase.from("businesses").select("main_currency").eq("user_id", data.user.id).maybeSingle();
      const c = (b as { main_currency?: string } | null)?.main_currency;
      if (c) { setCode(c); localStorage.setItem("livra_currency", c); }
    });
  }, []);
  const cur = currencies.find((c) => c.code === code) ?? currencies[0];
  const format = (n: number) => `${cur.symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return { code, symbol: cur.symbol, format };
};
