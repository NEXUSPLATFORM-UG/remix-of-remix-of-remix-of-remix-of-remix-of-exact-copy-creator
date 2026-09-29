export const RELWORX_PRODUCTS_API = "https://api.livrauganda.workers.dev/api/products";

export interface RelworxProduct {
  name: string;
  code: string;
  category: string;
  has_price_list: boolean;
  has_choice_list: boolean;
  billable: boolean;
}

export interface RelworxPriceItem {
  code: string;
  name: string;
  price: number;
}

export interface RelworxChoiceItem {
  id: string;
  name: string;
}

const readJson = async (response: Response) => {
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "The payment service could not complete this request.");
  return data;
};

export const getBankTransferProducts = async (): Promise<RelworxProduct[]> => {
  const data = await readJson(await fetch(RELWORX_PRODUCTS_API));
  return Array.isArray(data.products)
    ? data.products.filter((product: RelworxProduct) => product.category === "BANK_TRANSFERS")
    : [];
};

export const getProductPriceList = async (code: string): Promise<RelworxPriceItem[]> => {
  const data = await readJson(await fetch(`${RELWORX_PRODUCTS_API}/price-list?code=${encodeURIComponent(code)}`));
  return Array.isArray(data.price_list) ? data.price_list : [];
};

export const getProductChoiceList = async (code: string): Promise<RelworxChoiceItem[]> => {
  const data = await readJson(await fetch(`${RELWORX_PRODUCTS_API}/choice-list?code=${encodeURIComponent(code)}`));
  return Array.isArray(data.choice_list) ? data.choice_list : [];
};

export const validateBankTransfer = async (body: Record<string, string | number>) =>
  readJson(await fetch(`${RELWORX_PRODUCTS_API}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));

export const purchaseBankTransfer = async (validationReference: string) =>
  readJson(await fetch(`${RELWORX_PRODUCTS_API}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ validation_reference: validationReference }),
  }));