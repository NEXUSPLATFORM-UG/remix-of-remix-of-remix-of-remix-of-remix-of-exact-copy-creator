import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthModal, { AuthMode, goAfterAuth } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import MoneyFlowBackground from "@/components/MoneyFlowBackground";
import BrandLogo from "@/components/BrandLogo";
import SiteHeader from "@/components/SiteHeader";
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
import businessPetrolStationPhoto from "@/assets/business-petrol-station.jpg";
import businessRestaurantPhoto from "@/assets/business-restaurant.jpg";
import businessClinicPhoto from "@/assets/business-clinic.jpg";
import flagUg from "@/assets/countries/ug.png";
import flagKe from "@/assets/countries/ke.png";
import flagTz from "@/assets/countries/tz.png";
import flagRw from "@/assets/countries/rw.png";
import flagNg from "@/assets/countries/ng.png";
import flagGh from "@/assets/countries/gh.png";
import flagZa from "@/assets/countries/za.png";
import {
  ArrowRight, Shield, QrCode, Globe, CheckCircle2,
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

const countries = [
  { flag: flagUg, name: "Uganda" },
  { flag: flagKe, name: "Kenya" },
  { flag: flagTz, name: "Tanzania" },
  { flag: flagRw, name: "Rwanda" },
  { flag: flagNg, name: "Nigeria" },
  { flag: flagGh, name: "Ghana" },
  { flag: flagZa, name: "South Africa" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const openAuth = (m: AuthMode) => { setAuthMode(m); setAuthOpen(true); };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && sessionStorage.getItem("postAuth")) {
        sessionStorage.removeItem("postAuth");
        setTimeout(() => goAfterAuth(navigate), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
  <div className="min-h-screen liquid-gradient-bg text-foreground">
    {/* Nav */}
    <SiteHeader />

    {/* Hero */}
    <section className="relative isolate w-full px-6 lg:px-12 xl:px-20 pt-20 pb-24 min-h-[calc(100vh-5rem)] grid lg:grid-cols-2 gap-14 items-center">
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
          <button onClick={() => openAuth("register")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Open free account <ArrowRight size={16} />
          </button>
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
      <div className="relative flex justify-center lg:justify-end">
        <img src={featureVisual} alt="Livra payment methods floating around the globe" className="w-full max-w-xl object-contain drop-shadow-2xl" width={686} height={635} loading="eager" />
      </div>
    </section>

    {/* Stats */}
    <section className="w-full px-6 lg:px-12 xl:px-20 pb-20">
      <div className="glass rounded-3xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
        {[["50K+", "Active users"], ["$5 Trillion+", "Processed"], ["99.9%", "Uptime"], ["< 10s", "Avg. transfer"]].map(([v, l]) => (
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
        <p className="mt-4 text-muted-foreground">From the shop counter to the clinic door, LIVRA helps businesses of every size get paid.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { i: Store, title: "Supermarkets", text: "Ring up every till with instant Mobile Money and card payments at checkout.", photo: businessSupermarketPhoto },
            { i: Fuel, title: "Petrol Stations", text: "Serve drivers fast with contactless payments, day and night.", photo: businessPetrolStationPhoto },
            { i: UtensilsCrossed, title: "Restaurants", text: "Let diners pay their bill by MoMo, QR code or card in seconds.", photo: businessRestaurantPhoto },
            { i: Stethoscope, title: "Clinics", text: "Collect consultation and pharmacy payments without the queue.", photo: businessClinicPhoto },
        ].map(({ i: I, title, text, photo }) => (
          <div key={title} className="milk-card group relative rounded-2xl p-6 transition duration-500 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
            {photo && (
              <div className="photo-curve-frame absolute right-4 top-4 h-20 w-28 transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none">
                <img
                  src={photo}
                  alt={title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="photo-curve h-full w-full object-cover"
                />
              </div>
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

    {/* Available countries */}
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

    <section id="countries" className="w-full py-20">
      <div className="mx-auto mb-10 max-w-2xl px-6 text-center">
        <p className="mb-3 text-sm font-medium text-primary">Available countries</p>
        <h2 className="text-4xl font-bold tracking-tight">Live in seven countries, growing fast.</h2>
      </div>
      <div className="flag-marquee w-full overflow-hidden">
        <div className="flag-marquee-track gap-6 pr-6">
          {[...countries, ...countries, ...countries, ...countries].map(
            ({ flag, name }, index) => (
              <div
                key={`${name}-${index}`}
                aria-hidden={index >= countries.length * 2}
                className="milk-card h-20 w-32 shrink-0 overflow-hidden rounded-2xl p-1.5"
              >
                <img
                  src={flag}
                  alt={index < countries.length ? `${name} flag` : ""}
                  loading="lazy"
                  width={128}
                  height={72}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="w-full px-6 lg:px-12 xl:px-20 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground px-8 py-16 md:px-16 md:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden />
        <div className="absolute -left-20 -bottom-28 w-72 h-72 rounded-full bg-primary-foreground/10 blur-2xl" aria-hidden />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get started with LIVRA today</h2>
          <p className="opacity-85 max-w-xl text-lg">Create your account, verify your business and start receiving payments in minutes.</p>
        </div>
        <div className="relative flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:items-end xl:justify-end">
          <button onClick={() => openAuth("register")} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-background text-foreground font-medium hover:opacity-90 transition-opacity">
            Create free account <ArrowRight size={16} />
          </button>
          <button onClick={() => openAuth("login")} className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-primary-foreground/40 font-medium hover:bg-primary-foreground/10 transition-colors">
            Log in
          </button>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="w-full px-4 lg:px-8 pb-6">
      <div className="milk-card rounded-[2rem] backdrop-blur-xl">
      <div className="w-full px-6 lg:px-12 xl:px-16 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" aria-label="LIVRA home" className="mb-4 inline-flex items-center">
            <BrandLogo className="h-9 w-auto" />
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm">One wallet for Mobile Money, bank transfers, cards, bills and savings across Africa.</p>
        </div>
        {[
          { h: "Product", l: [["Features", "#features"], ["How it works", "#how"], ["Businesses", "#business"], ["Countries", "#countries"]] },
          { h: "Company", l: [["Security", "#security"], ["Developers", "/documentation"], ["Contact", "#"]] },
          { h: "Legal", l: [["Privacy policy", "#"], ["Terms of service", "#"], ["Compliance", "#"]] },
        ].map((c) => (
          <div key={c.h}>
            <p className="font-semibold mb-4 text-sm">{c.h}</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {c.l.map(([t, h]) => <li key={t}><a href={h} className="hover:text-foreground transition-colors">{t}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary/10">
        <div className="w-full px-6 lg:px-12 xl:px-16 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LIVRA. All rights reserved.</p>
          <p>Payments powered by licensed partners.</p>
        </div>
      </div>
      </div>
    </footer>

    <AuthModal open={authOpen} mode={authMode} onModeChange={setAuthMode} onOpenChange={setAuthOpen} />
  </div>
  );
};

export default LandingPage;
