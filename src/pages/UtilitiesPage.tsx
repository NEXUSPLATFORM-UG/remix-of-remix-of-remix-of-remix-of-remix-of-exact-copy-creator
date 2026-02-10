import { Zap, Wifi, Phone, Droplets, Tv, CreditCard, X, Loader2, ShoppingCart, CheckCircle, AlertCircle, ChevronRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";

const API_BASE = "https://api.livrauganda.workers.dev/api/products";

interface Product {
  name: string;
  code: string;
  category: string;
  has_price_list: boolean;
  has_choice_list: boolean;
  billable: boolean;
}

interface PriceItem {
  code: string;
  name: string;
  price: number;
}

interface ChoiceItem {
  id: string;
  name: string;
}

const categoryConfig: Record<string, { icon: typeof Zap; gradient: string; label: string }> = {
  AIRTIME: { icon: Phone, gradient: "stat-card-orange", label: "Airtime" },
  INTERNET: { icon: Wifi, gradient: "stat-card-blue", label: "Internet" },
  TV: { icon: Tv, gradient: "stat-card-pink", label: "TV" },
  UTILITIES: { icon: Zap, gradient: "stat-card-cyan", label: "Utilities" },
  OTHERS: { icon: CreditCard, gradient: "stat-card-purple", label: "Others" },
};

const UtilitiesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("AIRTIME");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceList, setPriceList] = useState<PriceItem[]>([]);
  const [choiceList, setChoiceList] = useState<ChoiceItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Purchase flow
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceItem | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [validating, setValidating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [validationRef, setValidationRef] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [purchaseStep, setPurchaseStep] = useState<"form" | "validated" | "success" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(() => toast({ title: "Error", description: "Failed to load products", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setPriceList([]);
    setChoiceList([]);
    setLoadingDetails(true);

    const promises: Promise<void>[] = [];

    if (product.has_price_list) {
      promises.push(
        fetch(`${API_BASE}/price-list?code=${product.code}`)
          .then(res => res.json())
          .then(data => { if (data.success) setPriceList(data.price_list); })
      );
    }
    if (product.has_choice_list) {
      promises.push(
        fetch(`${API_BASE}/choice-list?code=${product.code}`)
          .then(res => res.json())
          .then(data => { if (data.success) setChoiceList(data.choice_list); })
      );
    }

    await Promise.all(promises).catch(() => {});
    setLoadingDetails(false);
  };

  const openPurchase = (priceItem?: PriceItem) => {
    setSelectedPrice(priceItem || null);
    if (priceItem) setAmount(String(priceItem.price));
    else setAmount("");
    setPhoneNumber("");
    setContactPhone("");
    setSelectedChoice("");
    setValidationRef("");
    setCustomerName("");
    setPurchaseStep("form");
    setErrorMsg("");
    setShowPurchaseModal(true);
  };

  const handleValidate = async () => {
    if (!phoneNumber || !amount || !selectedProduct) return;
    setValidating(true);
    setErrorMsg("");
    try {
      const body: Record<string, string | number> = {
        msisdn: phoneNumber,
        amount: parseFloat(amount),
        product_code: selectedPrice?.code || selectedProduct.code,
        contact_phone: contactPhone || phoneNumber,
      };
      if (selectedChoice) body.location_id = selectedChoice;

      const res = await fetch(`${API_BASE}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setValidationRef(data.validation_reference);
        setCustomerName(data.customer_name || "");
        setPurchaseStep("validated");
      } else {
        setErrorMsg(data.message || "Validation failed");
        setPurchaseStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setPurchaseStep("error");
    } finally {
      setValidating(false);
    }
  };

  const handlePurchase = async () => {
    if (!validationRef) return;
    setPurchasing(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validation_reference: validationRef }),
      });
      const data = await res.json();
      if (data.success) {
        setPurchaseStep("success");
        toast({ title: "Success", description: data.message || "Purchase in progress" });
      } else {
        setErrorMsg(data.message || "Purchase failed");
        setPurchaseStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setPurchaseStep("error");
    } finally {
      setPurchasing(false);
    }
  };

  const categories = Object.keys(categoryConfig);
  const filteredProducts = products
    .filter(p => p.category === selectedCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const RadioDot = ({ selected }: { selected: boolean }) => (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-secondary" : "border-muted-foreground/30"}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
    </div>
  );

  return (
    <>
      <PageHeader title="Utilities" subtitle="Buy airtime, data, TV, utilities & more" />

      {/* Category selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {categories.map(cat => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          const isActive = selectedCategory === cat;
          const count = products.filter(p => p.category === cat).length;
          return (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setSelectedProduct(null); setSearchQuery(""); }}
              className={`glass rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${isActive ? "ring-2 ring-secondary" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${config.gradient}`}>
                <Icon size={18} />
              </div>
              <span className="text-sm font-medium text-foreground">{config.label}</span>
              <span className="text-[10px] text-muted-foreground">{count} products</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Products list */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{categoryConfig[selectedCategory]?.label} Products</h3>
              <span className="text-xs text-muted-foreground">{filteredProducts.length} available</span>
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..."
                className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredProducts.map(p => {
                const isSelected = selectedProduct?.code === p.code;
                return (
                  <button key={p.code} onClick={() => handleSelectProduct(p)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${isSelected ? "ring-2 ring-secondary bg-[hsl(0_0%_100%/0.4)]" : "glass hover:bg-[hsl(0_0%_100%/0.5)]"}`}>
                    <div className="flex items-center gap-3">
                      <RadioDot selected={isSelected} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p.has_price_list && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium">Packages</span>}
                          {p.has_choice_list && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-chart-orange/10 text-chart-orange font-medium">Options</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                );
              })}
              {filteredProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No products found</p>
              )}
            </div>
          </div>

          {/* Product details / price list / purchase */}
          <div className="glass rounded-2xl p-5">
            {!selectedProduct ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingCart size={32} className="text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Select a product to see details</p>
              </div>
            ) : loadingDetails ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-muted-foreground" size={24} />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${categoryConfig[selectedProduct.category]?.gradient || "stat-card-blue"}`}>
                    {(() => { const Icon = categoryConfig[selectedProduct.category]?.icon || CreditCard; return <Icon size={18} />; })()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{selectedProduct.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedProduct.category} • {selectedProduct.code}</p>
                  </div>
                </div>

                {/* If product has price list, show packages */}
                {priceList.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Available Packages</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                      {priceList.map(item => (
                        <button key={item.code} onClick={() => openPurchase(item)}
                          className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-[hsl(0_0%_100%/0.5)] transition-all text-left">
                          <p className="text-sm font-medium text-foreground flex-1 mr-3">{item.name}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-bold text-foreground">UGX {item.price.toLocaleString()}</span>
                            <ShoppingCart size={14} className="text-secondary" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* If no price list, show direct purchase */}
                {priceList.length === 0 && (
                  <button onClick={() => openPurchase()}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <ShoppingCart size={16} /> Buy {selectedProduct.name}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowPurchaseModal(false)}>
          <div className="glass-heavy rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {purchaseStep === "success" ? "Purchase Complete" : purchaseStep === "validated" ? "Confirm Purchase" : "Purchase"}
              </h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {purchaseStep === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full stat-card-green flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-primary-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Purchase in Progress</p>
                <p className="text-sm text-muted-foreground mb-4">Your {selectedProduct.name} purchase is being processed.</p>
                <button onClick={() => setShowPurchaseModal(false)}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90">
                  Done
                </button>
              </div>
            ) : purchaseStep === "validated" ? (
              <div className="space-y-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">{selectedPrice?.name || selectedProduct.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">UGX {parseFloat(amount).toLocaleString()}</p>
                  {customerName && <p className="text-xs text-muted-foreground mt-1">Customer: {customerName}</p>}
                </div>
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Phone: {phoneNumber}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ref: {validationRef}</p>
                </div>
                <button onClick={handlePurchase} disabled={purchasing}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {purchasing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : "Confirm Purchase"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPrice && (
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">{selectedPrice.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">UGX {selectedPrice.price.toLocaleString()}</p>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Recipient Number (MSISDN / Meter No.)</label>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g. 0701234567"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Contact Phone (for SMS notification)</label>
                  <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="e.g. 0701234567"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                </div>

                {!selectedPrice && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Amount (UGX)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000"
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30" />
                  </div>
                )}

                {choiceList.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Location</label>
                    <select value={selectedChoice} onChange={e => setSelectedChoice(e.target.value)}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 appearance-none">
                      <option value="">Select location...</option>
                      {choiceList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}

                <button onClick={handleValidate} disabled={validating || !phoneNumber || !amount}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {validating ? <><Loader2 size={16} className="animate-spin" /> Validating...</> : "Validate & Continue"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UtilitiesPage;
