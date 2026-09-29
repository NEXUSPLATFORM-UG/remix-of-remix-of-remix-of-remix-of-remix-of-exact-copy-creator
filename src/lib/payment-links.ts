import { currencies } from "@/hooks/use-main-currency";

export type PaymentLinkData = {
  amount: string;
  description: string;
  id: string;
  currency: string;
};

const fallback: PaymentLinkData = { amount: "", description: "", id: "", currency: "UGX" };

const isCurrency = (value: unknown): value is string =>
  typeof value === "string" && currencies.some((currency) => currency.code === value);

export const createPaymentLinkData = (
  amount: string,
  description: string,
  currency: string,
): PaymentLinkData => ({
  amount,
  description,
  currency: isCurrency(currency) ? currency : "UGX",
  id: `PAY-${Date.now()}`,
});

export const encodePaymentLinkData = (data: PaymentLinkData) => {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

export const decodePaymentLinkData = (encoded: string | null): PaymentLinkData => {
  if (!encoded) return fallback;
  try {
    const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    return {
      amount: typeof parsed.amount === "string" && Number.isFinite(Number(parsed.amount)) ? parsed.amount : "",
      description: typeof parsed.description === "string" ? parsed.description.slice(0, 240) : "",
      id: typeof parsed.id === "string" ? parsed.id.slice(0, 80) : "",
      currency: isCurrency(parsed.currency) ? parsed.currency : "UGX",
    };
  } catch {
    return fallback;
  }
};

export const buildPaymentUrl = (data: PaymentLinkData) =>
  `${window.location.origin}/pay?data=${encodeURIComponent(encodePaymentLinkData(data))}`;

export const formatPaymentAmount = (amount: string, currencyCode: string) => {
  const currency = currencies.find((item) => item.code === currencyCode) ?? currencies[0];
  const value = Number(amount);
  return `${currency.symbol}${Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"}`;
};