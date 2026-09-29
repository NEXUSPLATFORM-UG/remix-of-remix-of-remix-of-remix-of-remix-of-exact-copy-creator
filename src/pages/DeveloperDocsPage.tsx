import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Copy, Check, Terminal, BookOpen, Webhook, ShieldCheck,
  ArrowRight, Smartphone, Banknote, Receipt, Link2, Radar, Zap, Globe,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const API_BASE = "https://api.livrauganda.workers.dev/api";

/* ---------- Code block with copy ---------- */
const CodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#0d1424] text-left">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-xs font-medium text-white/60">{title}</span>
        <button
          onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex items-center gap-1.5 text-xs text-white/60 transition hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-emerald-200/90"><code>{code}</code></pre>
    </div>
  );
};

/* ---------- Endpoint component ---------- */
const MethodBadge = ({ method }: { method: string }) => (
  <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide ${
    method === "GET" ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary"
  }`}>{method}</span>
);

const ParamTable = ({ rows }: { rows: [string, string, string][] }) => (
  <div className="overflow-x-auto rounded-2xl border border-border/60">
    <table className="w-full text-left text-sm">
      <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
        <tr><th className="px-4 py-3">Field</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Description</th></tr>
      </thead>
      <tbody>
        {rows.map(([f, t, d]) => (
          <tr key={f} className="border-t border-border/50">
            <td className="px-4 py-3 font-mono text-[13px] font-semibold text-foreground">{f}</td>
            <td className="px-4 py-3 text-muted-foreground">{t}</td>
            <td className="px-4 py-3 text-muted-foreground">{d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Endpoint = ({ method, path, desc, params, request, response, note }: {
  method: string; path: string; desc: string;
  params?: [string, string, string][];
  request?: { title: string; code: string };
  response?: { title: string; code: string };
  note?: string;
}) => (
  <div className="milk-card scroll-mt-28 rounded-3xl p-6 md:p-8" id={path.replace(/[^a-z]+/gi, "-").toLowerCase()}>
    <div className="mb-2 flex flex-wrap items-center gap-3">
      <MethodBadge method={method} />
      <code className="text-base font-semibold text-foreground md:text-lg">{path}</code>
    </div>
    <p className="mb-6 text-muted-foreground">{desc}</p>
    {params && <><h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Request parameters</h4><div className="mb-6"><ParamTable rows={params} /></div></>}
    <div className="grid gap-4 lg:grid-cols-2">
      {request && <CodeBlock title={request.title} code={request.code} />}
      {response && <CodeBlock title={response.title} code={response.code} />}
    </div>
    {note && <p className="mt-4 text-sm text-muted-foreground">{note}</p>}
  </div>
);

/* ---------- Content data ---------- */
const navSections = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quick start" },
  { id: "authentication", label: "Authentication" },
  { id: "mobile-money", label: "Mobile Money deposit" },
  { id: "request-status", label: "Check status" },
  { id: "products", label: "Available products" },
  { id: "validate", label: "Validate purchase" },
  { id: "purchase", label: "Complete purchase" },
  { id: "lifecycle", label: "Payment lifecycle" },
  { id: "errors", label: "Errors" },
  { id: "limits", label: "Rate limits" },
  { id: "sdks", label: "Libraries & tools" },
];

const errorCodes: [string, string, string][] = [
  ["400", "bad_request", "A required field is missing or malformed — check msisdn format (256XXXXXXXXX) and amount."],
  ["401", "unauthorized", "Missing or invalid API credentials on the request."],
  ["402", "payment_required", "The customer declined the prompt, entered a wrong PIN, or has insufficient funds."],
  ["404", "not_found", "Unknown internal_reference or product_code."],
  ["409", "conflict", "The validation_reference was already used or has expired — validate again."],
  ["429", "too_many_requests", "You exceeded the rate limit. Retry with exponential backoff."],
  ["500", "server_error", "Something failed on our side or at the provider. Retry the same request idempotently."],
];

const quickTabs = {
  cURL: `curl -X POST ${API_BASE}/deposit \\
  -H "Content-Type: application/json" \\
  -d '{
    "msisdn": "256770000000",
    "amount": 50000,
    "description": "Wallet top-up"
  }'`,
  Node: `const res = await fetch("${API_BASE}/deposit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    msisdn: "256770000000",   // customer phone, country code + number
    amount: 50000,            // in UGX
    description: "Wallet top-up",
  }),
});
const charge = await res.json();
// charge.internal_reference -> poll /request-status until success`,
  Python: `import requests

res = requests.post("${API_BASE}/deposit", json={
    "msisdn": "256770000000",
    "amount": 50000,
    "description": "Wallet top-up",
})
charge = res.json()
# charge["internal_reference"] -> poll /request-status until success`,
};

const DeveloperDocsPage = () => {
  const [active, setActive] = useState("overview");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<keyof typeof quickTabs>("cURL");
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Developer Docs | LIVRA";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );
    navSections.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const filterMatch = useMemo(() => {
    if (!q.trim()) return null;
    const needle = q.toLowerCase();
    return navSections.filter((s) => s.label.toLowerCase().includes(needle));
  }, [q]);

  const Section = ({ id, icon: Icon, title, intro, children }: { id: string; icon: any; title: string; intro?: string; children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-28">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon size={22} /></span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {intro && <p className="mt-1 max-w-3xl text-muted-foreground">{intro}</p>}
        </div>
      </div>
      {children}
    </section>
  );

  return (
    <div className="min-h-screen liquid-gradient-bg text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="w-full px-6 pb-10 pt-16 text-center lg:px-12 xl:px-20">
        <p className="mb-3 text-sm font-medium text-primary">Developers</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight leading-[1.05] md:text-6xl">LIVRA Developer Documentation</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Everything you need to accept Mobile Money, bank transfers, bills and airtime payments through the LIVRA API — real endpoints, real fields, copy-paste samples.
        </p>
        <div className="milk-card mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl px-5">
          <Search className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the docs — deposit, products, webhooks…"
            className="w-full bg-transparent py-4 text-lg outline-none"
          />
        </div>
        {filterMatch && (
          <div className="milk-card mx-auto mt-3 max-w-xl rounded-2xl p-2 text-left">
            {filterMatch.length ? filterMatch.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition hover:bg-primary/10">
                <BookOpen size={14} className="text-primary" /> {s.label}
              </a>
            )) : <p className="px-4 py-2.5 text-sm text-muted-foreground">No sections match “{q}”.</p>}
          </div>
        )}
      </section>

      {/* Body: sidebar + content */}
      <main className="w-full px-6 pb-24 lg:px-12 xl:px-20">
        <div className="mx-auto flex max-w-[1400px] gap-10">
          {/* Sidebar */}
          <aside className="sticky top-28 hidden h-fit w-64 shrink-0 lg:block">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documentation</p>
            <nav className="space-y-1">
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    active === s.id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="milk-card mt-6 rounded-2xl p-4">
              <p className="text-sm font-semibold">Need help?</p>
              <p className="mt-1 text-xs text-muted-foreground">Our integration team replies within one business day.</p>
              <Link to="/support" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Contact support <ArrowRight size={14} /></Link>
            </div>
          </aside>

          {/* Content */}
          <div ref={mainRef} className="min-w-0 flex-1 space-y-16">
            <Section id="overview" icon={Globe} title="Overview" intro="The LIVRA API is organized around REST. All requests use JSON bodies over HTTPS, and every money-moving operation follows the same three-step rhythm: initiate, confirm, verify.">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { i: Smartphone, t: "Mobile Money", d: "Collect payments from MTN and Airtel wallets with a single deposit request and status polling." },
                  { i: Banknote, t: "Bank transfers", d: "Move money to banks across the products catalog using validate → purchase." },
                  { i: Receipt, t: "Bills & airtime", d: "Pay utilities and sell airtime with the same product purchase flow." },
                ].map(({ i: I, t, d }) => (
                  <div key={t} className="milk-card rounded-2xl p-5">
                    <I className="mb-3 text-primary" size={24} />
                    <h3 className="font-semibold">{t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
              <div className="milk-card mt-4 flex flex-wrap items-center gap-3 rounded-2xl p-5">
                <span className="text-sm font-semibold">Base URL</span>
                <code className="rounded-xl bg-primary/10 px-3 py-1.5 font-mono text-sm text-primary">{API_BASE}</code>
                <span className="text-sm text-muted-foreground">— all endpoints below are relative to this base.</span>
              </div>
            </Section>

            <Section id="quickstart" icon={Zap} title="Quick start" intro="Collect your first Mobile Money payment in under a minute. Pick your language, run the snippet, then poll for the result.">
              <div className="mb-4 flex gap-2">
                {(Object.keys(quickTabs) as (keyof typeof quickTabs)[]).map((k) => (
                  <button key={k} onClick={() => setTab(k)} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "milk-card hover:text-primary"}`}>{k}</button>
                ))}
              </div>
              <CodeBlock title={`${tab} — request a Mobile Money deposit`} code={quickTabs[tab]} />
            </Section>

            <Section id="authentication" icon={ShieldCheck} title="Authentication" intro="Every request is scoped to your merchant account. Keep credentials server-side and never expose them in a browser or mobile app.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="milk-card rounded-2xl p-5">
                  <h3 className="font-semibold">Keep keys secret</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Call the API from your own backend so keys never reach the client. Requests from LIVRA's own pages are already scoped to the merchant account.</p>
                </div>
                <div className="milk-card rounded-2xl p-5">
                  <h3 className="font-semibold">Rotate immediately on leak</h3>
                  <p className="mt-1 text-sm text-muted-foreground">If a key is ever exposed, contact support to revoke and reissue it. Old keys stop working the moment a new one is issued.</p>
                </div>
              </div>
            </Section>

            <Section id="mobile-money" icon={Smartphone} title="Mobile Money deposit" intro="Request a payment from a customer's MTN or Airtel Mobile Money wallet. The customer receives a PIN prompt on their phone.">
              <Endpoint
                method="POST"
                path="/api/deposit"
                desc="Initiates a Mobile Money collection. Returns immediately with an internal_reference you use to track the charge."
                params={[
                  ["msisdn", "string", "Customer phone number in international format without +, e.g. 256770000000. Required."],
                  ["amount", "number", "Amount to collect, in UGX. Required."],
                  ["description", "string", "Short narrative shown to the customer, e.g. \"Wallet top-up\". Optional."],
                ]}
                request={{ title: "Request", code: `POST ${API_BASE}/deposit\nContent-Type: application/json\n\n{\n  "msisdn": "256770000000",\n  "amount": 50000,\n  "description": "Wallet top-up"\n}` }}
                response={{ title: "Response — 200", code: `{\n  "success": true,\n  "internal_reference": "LIV-7f3a91c2",\n  "request_status": "pending",\n  "provider": "MTN",\n  "message": "Payment request sent to customer"\n}` }}
                note="success with an internal_reference means the prompt was dispatched — not that money moved. Always confirm with the status endpoint."
              />
            </Section>

            <Section id="request-status" icon={Radar} title="Check request status" intro="Poll this endpoint until the charge settles. LIVRA's own apps poll every 5 seconds and stop on a final state.">
              <Endpoint
                method="GET"
                path="/api/request-status"
                desc="Returns the latest state of a Mobile Money request. Treat request_status values success and failed as final and stop polling."
                params={[["internal_reference", "string", "The reference returned by /api/deposit, passed as a query parameter. Required."]]}
                request={{ title: "Request", code: `GET ${API_BASE}/request-status?internal_reference=LIV-7f3a91c2` }}
                response={{ title: "Response — 200", code: `{\n  "request_status": "success",\n  "internal_reference": "LIV-7f3a91c2",\n  "provider": "MTN",\n  "provider_transaction_id": "MP240929.1432.A12345",\n  "charge": 750,\n  "amount": 50000,\n  "msisdn": "256770000000"\n}` }}
                note="Recommended pattern: poll every 5 seconds, cap at ~2 minutes, then surface a timeout to the customer."
              />
            </Section>

            <Section id="products" icon={BookOpen} title="Available products" intro="Bank transfers, bills and airtime all flow through the products catalog. Each product carries its category, codes and live price list.">
              <Endpoint
                method="GET"
                path="/api/products"
                desc="Lists every purchasable product with its category (for example BANK_TRANSFERS or utilities categories), product codes and price options."
                request={{ title: "Request", code: `GET ${API_BASE}/products` }}
                response={{ title: "Response — 200 (trimmed)", code: `{\n  "success": true,\n  "categories": [\n    {\n      "category": "BANK_TRANSFERS",\n      "products": [\n        {\n          "code": "bank_transfer_mtn",\n          "name": "Bank Transfer",\n          "priceList": [\n            { "code": "UGX_50000", "amount": 50000 }\n          ]\n        }\n      ]\n    }\n  ]\n}` }}
                note="Filter client-side for the category you need — LIVRA's Transfer page, for example, shows only BANK_TRANSFERS."
              />
            </Section>

            <Section id="validate" icon={ShieldCheck} title="Validate purchase" intro="Before any money moves, validate the purchase. The API confirms the recipient, prices the transaction and returns a single-use validation_reference.">
              <Endpoint
                method="POST"
                path="/api/products/validate"
                desc="Validates a product purchase and reserves it. The response may include a resolved customer_name you can show for confirmation."
                params={[
                  ["msisdn", "string", "Recipient account or phone number, depending on the product. Required."],
                  ["amount", "number", "Transaction amount in UGX. Required."],
                  ["product_code", "string", "The code from the products catalog or a selected price-list entry. Required."],
                  ["contact_phone", "string", "Phone that receives the SMS notification. Optional — defaults to msisdn."],
                  ["depositor_name", "string", "Name of the depositor for bank transfer products. Optional."],
                  ["location_id", "string", "Selected branch/location choice when the product exposes options. Optional."],
                ]}
                request={{ title: "Request", code: `POST ${API_BASE}/products/validate\nContent-Type: application/json\n\n{\n  "msisdn": "256770000000",\n  "amount": 50000,\n  "product_code": "bank_transfer_mtn",\n  "contact_phone": "256770000000"\n}` }}
                response={{ title: "Response — 200", code: `{\n  "success": true,\n  "validation_reference": "VAL-3b81d0e4",\n  "customer_name": "JOHN OKELLO"\n}` }}
                note="A validation_reference is single-use and short-lived — present the confirmation, then complete the purchase promptly."
              />
            </Section>

            <Section id="purchase" icon={Terminal} title="Complete purchase" intro="Exchange the validation_reference to execute the transaction. Nothing is charged until this call succeeds.">
              <Endpoint
                method="POST"
                path="/api/products/purchase"
                desc="Executes the validated purchase. Use the same single validation_reference exactly once."
                params={[["validation_reference", "string", "The reference returned by /api/products/validate. Required."]]}
                request={{ title: "Request", code: `POST ${API_BASE}/products/purchase\nContent-Type: application/json\n\n{\n  "validation_reference": "VAL-3b81d0e4"\n}` }}
                response={{ title: "Response — 200", code: `{\n  "success": true,\n  "message": "Purchase in progress",\n  "transaction_ref": "TXN-9d21ba77"\n}` }}
                note="A success here means the purchase was accepted for processing — record the transaction_ref for reconciliation."
              />
            </Section>

            <Section id="lifecycle" icon={Webhook} title="Payment lifecycle" intro="Every integration follows the same happy path — initiate, confirm, verify.">
              <div className="milk-card rounded-3xl p-6 md:p-8">
                <ol className="space-y-6">
                  {[
                    ["Initiate", "POST /api/deposit or /api/products/validate — send the real fields (msisdn, amount, product_code, description)."],
                    ["Confirm", "The customer approves the Mobile Money prompt, or you review the validated details (customer_name, amount) before purchasing."],
                    ["Verify", "Poll GET /api/request-status every 5 seconds until request_status is success or failed, then record provider_transaction_id."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                      <div>
                        <p className="font-semibold">{t}</p>
                        <p className="text-sm text-muted-foreground">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Section>

            <Section id="errors" icon={BookOpen} title="Errors" intro="LIVRA uses conventional HTTP status codes. The body carries a message you can surface directly to customers.">
              <div className="overflow-x-auto rounded-2xl border border-border/60">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr><th className="px-4 py-3">Status</th><th className="px-4 py-3">Meaning</th><th className="px-4 py-3">What to do</th></tr>
                  </thead>
                  <tbody>
                    {errorCodes.map(([code, name, d]) => (
                      <tr key={code} className="border-t border-border/50">
                        <td className="px-4 py-3 font-mono font-semibold text-foreground">{code}</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-primary">{name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="limits" icon={Radar} title="Rate limits" intro="Be a good citizen — back off on 429s rather than retrying in a tight loop.">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Deposit requests", "Max 1 per msisdn per 30 seconds", "Duplicate prompts confuse customers — wait for the first to settle."],
                  ["Status polling", "Every 5 seconds per reference", "Stop immediately on success or failed."],
                  ["Catalog reads", "Cache for 5 minutes", "Product prices change rarely; caching cuts latency and load."],
                ].map(([t, r, d]) => (
                  <div key={t} className="milk-card rounded-2xl p-5">
                    <h3 className="font-semibold">{t}</h3>
                    <p className="mt-1 font-mono text-sm text-primary">{r}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="sdks" icon={Link2} title="Libraries & tools" intro="Work directly over HTTPS — every endpoint above works with any HTTP client.">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { i: Terminal, t: "Plain HTTP / fetch", d: "The code samples in this page are complete — no SDK needed for server-side integration." },
                  { i: Webhook, t: "Status polling helper", d: "A 5-second poller with a 2-minute cap is the recommended pattern; see Check request status." },
                  { i: Link2, t: "Payment links", d: "Build shareable pay links and QR codes on top of the deposit endpoint — see the Receive page in the app." },
                  { i: ShieldCheck, t: "Go-live checklist", d: "Server-side keys, 5s polling cap, idempotent retries, provider_transaction_id logging." },
                ].map(({ i: I, t, d }) => (
                  <div key={t} className="milk-card flex items-start gap-4 rounded-2xl p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><I size={20} /></span>
                    <div>
                      <h3 className="font-semibold">{t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="milk-card mt-6 flex flex-col items-center gap-4 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold">Ready to build?</h3>
                <p className="max-w-xl text-muted-foreground">Start with the Quick start snippet, or talk to our integration team about your use case.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="#quickstart" className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90">Run the quick start</a>
                  <Link to="/support" className="milk-card rounded-xl px-6 py-3 font-medium transition hover:text-primary">Contact support</Link>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default DeveloperDocsPage;
