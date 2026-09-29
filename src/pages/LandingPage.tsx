import { Link } from "react-router-dom";
import MoneyFlowBackground from "@/components/MoneyFlowBackground";
import featureVisual from "@/assets/features-visual.png";
import bankTransferVisual from "@/assets/bank-transfer-3d.png";
import cardPaymentVisual from "@/assets/card-payment-3d.png";
import billsAirtimeVisual from "@/assets/bills-airtime-3d.png";
import savingsVisual from "@/assets/savings-3d.png";
import paypalLogo from "@/assets/paypal-3d.png";
import googlePayLogo from "@/assets/google-pay-3d.png";
import applePayLogo from "@/assets/apple-pay-3d.png";
import mtnMomoVisual from "@/assets/mtn-momo-local.png";
import airtelMoneyVisual from "@/assets/airtel-money-local.png";
import businessSupermarketPhoto from "@/assets/business-supermarket.jpg";
import {
  ArrowRight, Smartphone, Shield, QrCode, Globe, CheckCircle2, Send, Wallet,
  Store, Fuel, UtensilsCrossed, Stethoscope,
} from "lucide-react";


const features = [
  { title: "Mobile Money", text: "Deposit and withdraw instantly.", brands: [
    { src: mtnMomoVisual, alt: "MTN MoMo" },
    { src: airtelMoneyVisual, alt: "Airtel Money" },
  ] },
  { title: "Bank Transfers", text: "Send money straight to any local bank account.", logo: bankTransferVisual },
  { title: "Card Payments", text: "Top up with local and international cards.", logo: cardPaymentVisual },
  { title: "Bills & Airtime", text: "Pay for airtime, data, TV and electricity.", logo: billsAirtimeVisual },
  { title: "Payment Links & QR", text: "Create a link or QR code and get paid by anyone.", icon: QrCode },
  { title: "Savings Goals", text: "Set goals and move money aside automatically.", logo: savingsVisual },
  { title: "PayPal", text: "Send and receive payments worldwide.", logo: paypalLogo },
  { title: "Google Pay", text: "Pay quickly and securely from Android devices.", logo: googlePayLogo },
  { title: "Apple Pay", text: "Make private, contactless payments.", logo: applePayLogo },
];

const steps = [
  { n: "01", title: "Create your account", text: "Sign up in under two minutes with your phone number." },
  { n: "02", title: "Verify your business", text: "Confirm your details to unlock higher limits and business payments." },
  { n: "03", title: "Add money", text: "Fund your wallet with Mobile Money, card or bank transfer." },
  { n: "04", title: "Receive, send, save, exchange, transfer", text: "Do everything with your funded wallet — all in one place." },
];

const LandingPage = () => (
  <div className="min-h-screen liquid-gradient-bg text-foreground">
    {/* Nav */}
    <header className="sticky top-0 z-40 glass border-b border-border/40">
      <div className="w-full px-6 lg:px-12 xl:px-20 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">F</span>
          FinFlow
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          <Link to="/documentation" className="hover:text-foreground transition-colors">Developers</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="px-4 py-2 text-sm rounded-xl hover:bg-muted/50 transition-colors">Log in</Link>
          <Link to="/dashboard" className="px-4 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Get started
          </Link>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section className="relative isolate w-full px-6 lg:px-12 xl:px-20 pt-20 pb-24 min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 gap-14 items-center">
      <div className="absolute inset-0 -z-10"><MoneyFlowBackground /></div>
      <div>
        <span className="inline-flex items-center gap-2 glass px-3 py-1 rounded-full text-xs text-muted-foreground mb-6">
          <Globe size={12} className="text-primary" /> Built for Africa, ready for the world
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
          Money that moves <span className="text-primary">as fast as you do.</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          One wallet for Mobile Money, bank transfers, cards, bills and savings. Send, receive and get paid in seconds.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Open free account <ArrowRight size={16} />
          </Link>
          <a href="#features" className="px-6 py-3 rounded-xl glass font-medium hover:bg-muted/40 transition-colors">
            Explore features
          </a>
        </div>
        <div className="flex flex-wrap gap-6 mt-10 text-sm text-muted-foreground">
          {["No monthly fees", "Instant transfers", "Bank-grade security"].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-primary" />{t}</span>
          ))}
        </div>
      </div>

      {/* Hero visual */}
      <div className="relative">
        <div className="glass-heavy rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Wallet balance</p>
              <p className="text-3xl font-bold tracking-tight">UGX 4,567,530</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><Wallet size={18} /></span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{ i: Send, l: "Send" }, { i: Smartphone, l: "Deposit" }, { i: QrCode, l: "Receive" }].map(({ i: I, l }) => (
              <div key={l} className="glass rounded-2xl py-3 flex flex-col items-center gap-1.5 text-xs">
                <I size={18} className="text-primary" />{l}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { n: "MTN Mobile Money", a: "+ 250,000", s: "Deposit" },
              { n: "Stanbic Bank", a: "- 1,200,000", s: "Bank transfer" },
              { n: "UMEME Yaka", a: "- 50,000", s: "Electricity" },
            ].map((t) => (
              <div key={t.n} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{t.n}</p>
                  <p className="text-xs text-muted-foreground">{t.s}</p>
                </div>
                <p className={`text-sm font-semibold ${t.a.startsWith("+") ? "text-primary" : "text-foreground"}`}>{t.a}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 glass-heavy rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="text-primary" size={20} />
          <div>
            <p className="text-sm font-medium">Payment received</p>
            <p className="text-xs text-muted-foreground">UGX 75,000 via payment link</p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="w-full px-6 lg:px-12 xl:px-20 pb-20">
      <div className="glass rounded-3xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
        {[["50K+", "Active users"], ["UGX 12B+", "Processed"], ["99.9%", "Uptime"], ["< 10s", "Avg. transfer"]].map(([v, l]) => (
          <div key={l} className="p-6 text-center">
            <p className="text-3xl font-bold tracking-tight">{v}</p>
            <p className="text-sm text-muted-foreground mt-1">{l}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section id="features" className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <div className="relative">
        <div className="mb-10 max-w-2xl mx-auto text-center">
          <p className="mb-3 text-sm font-medium text-primary">Everything in one place</p>
          <h2 className="text-4xl font-bold tracking-tight">All the ways you move money, in one app.</h2>
        </div>
        <img src={featureVisual} alt="" aria-hidden="true" className="payment-visual-float pointer-events-none absolute right-[8%] top-1/2 z-0 hidden w-[42%] -translate-y-1/2 object-contain opacity-25 blur-[0.5px] lg:block" loading="lazy" width={686} height={635} />
        <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon: I, title, text, logo, brands }) => (
            <article key={title} className="milk-card group relative min-h-[210px] overflow-hidden rounded-2xl p-6 transition duration-500 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
              <div className="mb-5 flex h-14 items-center justify-start">
                {brands ? (
                  <div className="flex h-12 flex-row items-center justify-start gap-4">
                    {brands.map((brand) => (
                      <img key={brand.alt} src={brand.src} alt={brand.alt} className="h-8 w-auto object-contain" loading="lazy" width={72} height={32} />
                    ))}
                  </div>
                ) : logo ? (
                  <img src={logo} alt="" aria-hidden="true" className="h-14 w-16 object-contain object-left drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 motion-reduce:transform-none" loading="lazy" width={64} height={56} />
                ) : I ? (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/70 shadow-[var(--glass-shadow)]">
                    <I size={24} className="text-primary" strokeWidth={2.2} />
                  </span>
                ) : null}
              </div>
              <h3 className="mb-3 text-lg font-semibold">{title}</h3>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how" className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <h2 className="text-4xl font-bold tracking-tight mb-12 text-center">Get started in four steps</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="glass-heavy rounded-2xl p-8">
            <p className="text-5xl font-bold text-primary/30 mb-4">{s.n}</p>
            <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Business */}
    <section id="business" className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="mb-3 text-sm font-medium text-primary">Built for business</p>
        <h2 className="text-4xl font-bold tracking-tight">Accept payments wherever you do business.</h2>
        <p className="mt-4 text-muted-foreground">From the shop counter to the clinic door, FinFlow helps businesses of every size get paid.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { i: Store, title: "Supermarkets", text: "Ring up every till with instant Mobile Money and card payments at checkout.", photo: businessSupermarketPhoto },
          { i: Fuel, title: "Petrol Stations", text: "Serve drivers fast with contactless payments, day and night." },
          { i: UtensilsCrossed, title: "Restaurants", text: "Let diners pay their bill by MoMo, QR code or card in seconds." },
          { i: Stethoscope, title: "Clinics", text: "Collect consultation and pharmacy payments without the queue." },
        ].map(({ i: I, title, text, photo }) => (
          <div key={title} className="milk-card group relative rounded-2xl p-6 transition duration-500 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
            {photo && (
              <img
                src={photo}
                alt={title}
                loading="lazy"
                className="absolute right-4 top-4 h-20 w-28 rounded-3xl object-cover shadow-[var(--glass-shadow)] ring-4 ring-background/60 transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
              />
            )}
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/70 shadow-[var(--glass-shadow)]">
              <I size={24} className="text-primary" strokeWidth={2.2} />
            </span>
            <h3 className="mb-3 text-lg font-semibold">{title}</h3>
            <p className="text-base leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Security */}
    <section id="security" className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <div className="glass-heavy rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-5"><Shield size={22} /></span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your money, protected.</h2>
          <p className="text-muted-foreground">Encrypted end to end, monitored around the clock and backed by licensed payment partners.</p>
        </div>
        <ul className="space-y-4">
          {["256-bit encryption on every transaction", "Two-factor sign in", "Real-time fraud monitoring", "Licensed payment partners"].map((t) => (
            <li key={t} className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-sm">
              <CheckCircle2 size={18} className="text-primary shrink-0" />{t}
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* CTA */}
    <section className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <div className="rounded-3xl bg-primary text-primary-foreground p-12 md:p-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to move money smarter?</h2>
        <p className="opacity-80 mb-8 max-w-xl mx-auto">Join thousands who send, receive and save with FinFlow every day.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-background text-foreground font-medium hover:opacity-90 transition-opacity">
          Create free account <ArrowRight size={16} />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/40">
      <div className="w-full px-6 lg:px-12 xl:px-20 py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} FinFlow. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <Link to="/documentation" className="hover:text-foreground">Docs</Link>
          <a href="#security" className="hover:text-foreground">Security</a>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
