import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Building2, CheckCircle, ChevronRight, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getBankTransferProducts,
  getProductChoiceList,
  getProductPriceList,
  purchaseBankTransfer,
  RelworxChoiceItem,
  RelworxPriceItem,
  RelworxProduct,
  validateBankTransfer,
} from "@/lib/relworx";

type FlowStep = "products" | "form" | "review" | "success";

interface BankTransferFlowProps {
  fixedAmount?: string;
  requestCurrency?: string;
  description?: string;
}

const BankTransferFlow = ({ fixedAmount = "", requestCurrency = "UGX", description = "Payment" }: BankTransferFlowProps) => {
  const [products, setProducts] = useState<RelworxProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<RelworxProduct | null>(null);
  const [prices, setPrices] = useState<RelworxPriceItem[]>([]);
  const [choices, setChoices] = useState<RelworxChoiceItem[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<RelworxPriceItem | null>(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [amount, setAmount] = useState(fixedAmount);
  const [validationReference, setValidationReference] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [query, setQuery] = useState("");
  const [step, setStep] = useState<FlowStep>("products");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBankTransferProducts()
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const currencySupported = requestCurrency === "UGX";

  const selectProduct = async (product: RelworxProduct) => {
    setSelectedProduct(product);
    setSelectedPrice(null);
    setPrices([]);
    setChoices([]);
    setError("");
    setLoading(true);
    try {
      const [priceItems, choiceItems] = await Promise.all([
        product.has_price_list ? getProductPriceList(product.code) : Promise.resolve([]),
        product.has_choice_list ? getProductChoiceList(product.code) : Promise.resolve([]),
      ]);
      setPrices(priceItems);
      setChoices(choiceItems);
      if (priceItems.length === 0) setStep("form");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load this bank option.");
    } finally {
      setLoading(false);
    }
  };

  const choosePrice = (price: RelworxPriceItem) => {
    setSelectedPrice(price);
    setAmount(String(price.price));
    setStep("form");
  };

  const validate = async () => {
    if (!selectedProduct || !accountNumber || !contactPhone || !amount || !currencySupported) return;
    setSubmitting(true);
    setError("");
    try {
      const body: Record<string, string | number> = {
        msisdn: accountNumber,
        amount: Number(amount),
        product_code: selectedPrice?.code || selectedProduct.code,
        contact_phone: contactPhone,
        depositor_name: customerName || "LIVRA customer",
      };
      if (selectedChoice) body.location_id = selectedChoice;
      const data = await validateBankTransfer(body);
      setValidationReference(String(data.validation_reference || ""));
      setCustomerName(String(data.customer_name || customerName));
      setStep("review");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Validation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const purchase = async () => {
    if (!validationReference) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await purchaseBankTransfer(validationReference);
      setStep("success");
      toast({ title: "Bank payment submitted", description: data.message || "The transfer is being processed." });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The transfer failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currencySupported) {
    return (
      <div className="rounded-2xl bg-accent p-5 text-center">
        <Building2 className="mx-auto mb-3 text-primary" size={28} />
        <p className="font-semibold text-foreground">Bank Transfer supports UGX</p>
        <p className="mt-1 text-sm text-muted-foreground">This request is in {requestCurrency}. Choose Mobile Money, or ask the recipient for a UGX request.</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="py-6 text-center">
        <div className="stat-card-green mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground"><CheckCircle size={28} /></div>
        <p className="text-lg font-semibold text-foreground">Bank payment submitted</p>
        <p className="mt-1 text-sm text-muted-foreground">Your transfer is being processed.</p>
      </div>
    );
  }

  if (loading && products.length === 0) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {error && <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 shrink-0" size={16} />{error}</div>}

      {step === "products" && (
        <>
          <div className="glass-input flex items-center gap-2 rounded-xl px-3">
            <Search size={16} className="text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bank" className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto scrollbar-thin">
            {filtered.map((product) => (
              <div key={product.code}>
                <button onClick={() => selectProduct(product)} className="glass flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent">
                  <div className="stat-card-blue flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-primary-foreground"><Building2 size={16} /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{product.name}</p><p className="text-xs text-muted-foreground">{product.code}</p></div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
                {selectedProduct?.code === product.code && prices.length > 0 && (
                  <div className="ml-6 mt-2 space-y-2 border-l border-border pl-3">
                    {prices.map((price) => <button key={price.code} onClick={() => choosePrice(price)} className="glass flex w-full items-center justify-between rounded-xl p-3 text-left text-sm"><span>{price.name}</span><strong>UGX {price.price.toLocaleString()}</strong></button>)}
                  </div>
                )}
              </div>
            ))}
            {!loading && filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No bank transfer products found.</p>}
          </div>
        </>
      )}

      {step === "form" && selectedProduct && (
        <>
          <button onClick={() => setStep("products")} className="flex items-center gap-1 text-sm font-medium text-primary"><ArrowLeft size={15} /> Change bank</button>
          <div className="rounded-xl bg-accent p-3"><p className="text-sm font-semibold text-foreground">{selectedPrice?.name || selectedProduct.name}</p><p className="text-xs text-muted-foreground">{selectedPrice?.code || selectedProduct.code}</p></div>
          <div><label className="mb-1.5 block text-xs text-muted-foreground">MSISDN <span className="text-[10px]">(Recipient Bank Account Number)</span></label><input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} placeholder="Enter bank account number" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30" /></div>
          <div><label className="mb-1.5 block text-xs text-muted-foreground">Amount (UGX)</label><input type="number" readOnly={Boolean(fixedAmount || selectedPrice)} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30 read-only:opacity-70" /></div>
          <div><label className="mb-1.5 block text-xs text-muted-foreground">Contact Phone</label><input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="e.g. 0701234567" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30" /></div>
          <div><label className="mb-1.5 block text-xs text-muted-foreground">Depositor Name</label><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter depositor name" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary/30" /></div>
          {choices.length > 0 && <div><label className="mb-1.5 block text-xs text-muted-foreground">Location</label><select value={selectedChoice} onChange={(event) => setSelectedChoice(event.target.value)} className="glass-input w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none"><option value="">Select location</option>{choices.map((choice) => <option key={choice.id} value={choice.id}>{choice.name}</option>)}</select></div>}
          {description && <p className="text-xs text-muted-foreground">Payment for: {description}</p>}
          <button onClick={validate} disabled={submitting || !accountNumber || !contactPhone || !amount} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{submitting && <Loader2 size={16} className="animate-spin" />}Validate Bank Details</button>
        </>
      )}

      {step === "review" && selectedProduct && (
        <>
          <div className="rounded-2xl bg-accent p-5 text-center"><p className="text-sm text-muted-foreground">{selectedPrice?.name || selectedProduct.name}</p><p className="mt-1 text-3xl font-bold text-foreground">UGX {Number(amount).toLocaleString()}</p>{customerName && <p className="mt-1 text-xs text-muted-foreground">Customer: {customerName}</p>}</div>
          <div className="glass space-y-2 rounded-xl p-4 text-xs text-muted-foreground"><p>MSISDN: {accountNumber}</p><p>Contact Phone: {contactPhone}</p><p>Validation Reference: {validationReference}</p></div>
          <button onClick={purchase} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-60">{submitting && <Loader2 size={16} className="animate-spin" />}Confirm Bank Payment</button>
        </>
      )}
    </div>
  );
};

export default BankTransferFlow;