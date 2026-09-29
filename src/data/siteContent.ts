import {
  Smartphone, CreditCard, Apple, Link2, QrCode, Receipt, Send, Monitor, Store,
  Users, PiggyBank, ShoppingCart, Info, Handshake, Newspaper, Mail, Briefcase,
  type LucideIcon,
} from "lucide-react";
import flagUg from "@/assets/countries/ug.png";
import flagKe from "@/assets/countries/ke.png";
import flagTz from "@/assets/countries/tz.png";
import flagRw from "@/assets/countries/rw.png";
import flagNg from "@/assets/countries/ng.png";
import flagGh from "@/assets/countries/gh.png";
import flagZa from "@/assets/countries/za.png";

export type Product = {
  slug: string; title: string; short: string; icon: LucideIcon;
  headline: string; intro: string; features: { title: string; text: string }[];
  steps: string[]; useCases: string[];
};

export const products: Product[] = [
  { slug: "mobile-money", title: "Mobile Money", icon: Smartphone, short: "Collect and pay out via MTN, Airtel & more.",
    headline: "Accept Mobile Money from every network.", intro: "Receive and send payments across MTN MoMo, Airtel Money, M-Pesa and more — with instant confirmation and one simple wallet.",
    features: [{ title: "Instant collections", text: "Customers approve on their phone and funds land in seconds." }, { title: "Multi-network", text: "One integration covers every major operator in your country." }, { title: "Automatic reconciliation", text: "Every payment is matched and tracked in your dashboard." }],
    steps: ["Enter the customer's phone number and amount", "Customer approves the prompt on their phone", "Funds arrive in your LIVRA wallet instantly"], useCases: ["Shops & supermarkets", "School fees", "Utility collections", "Deliveries"] },
  { slug: "card-payments", title: "Card Payments", icon: CreditCard, short: "Visa, Mastercard and local cards.",
    headline: "Take card payments, local and international.", intro: "Accept Visa, Mastercard and local debit cards online or in person with secure 3-D Secure checkout.",
    features: [{ title: "Global cards", text: "Get paid by customers anywhere in the world." }, { title: "3-D Secure", text: "Bank-grade authentication reduces fraud and chargebacks." }, { title: "Fast settlement", text: "Settle to your wallet or bank account on schedule." }],
    steps: ["Customer enters card details", "Bank verifies with OTP or 3-D Secure", "Payment settles to your account"], useCases: ["Hotels & travel", "Online stores", "Subscriptions", "Clinics"] },
  { slug: "apple-google-pay", title: "Apple & Google Pay", icon: Apple, short: "One-tap contactless wallet payments.",
    headline: "One tap. Paid.", intro: "Let customers pay with Apple Pay and Google Pay on their phone or watch — fast, private and secure.",
    features: [{ title: "Contactless", text: "Tap-to-pay at your counter or checkout." }, { title: "Tokenised security", text: "Card numbers are never shared with you or stored." }, { title: "Higher conversion", text: "Fewer steps means more completed payments." }],
    steps: ["Customer selects Apple Pay or Google Pay", "They confirm with Face ID, fingerprint or PIN", "Payment is complete"], useCases: ["Cafés", "E-commerce", "Ride & delivery apps", "Events"] },
  { slug: "payment-links", title: "Payment Links", icon: Link2, short: "Share a link, get paid anywhere.",
    headline: "Get paid with just a link.", intro: "Create a payment link in seconds and share it on WhatsApp, SMS, email or social media. No website needed.",
    features: [{ title: "No code", text: "Create links from your dashboard in seconds." }, { title: "Any method", text: "Customers pay by Mobile Money, card or wallet." }, { title: "Track everything", text: "See who paid and when, in real time." }],
    steps: ["Set the amount and description", "Share the link with your customer", "Receive the payment instantly"], useCases: ["Freelancers", "Social sellers", "Invoices", "Donations"] },
  { slug: "qr-barcode", title: "QR & Barcode Scan", icon: QrCode, short: "Scan-to-pay at the counter.",
    headline: "Scan, pay, done.", intro: "Display a static or dynamic QR code, or scan barcodes, and let customers pay from any phone.",
    features: [{ title: "Static & dynamic QR", text: "Print once or generate per transaction." }, { title: "Barcode scanning", text: "Scan product and invoice barcodes to charge instantly." }, { title: "No hardware", text: "Works from any smartphone." }],
    steps: ["Show your QR or scan the barcode", "Customer confirms on their phone", "Get notified instantly"], useCases: ["Markets", "Restaurants", "Taxis & boda", "Retail"] },
  { slug: "bills-airtime", title: "Bills, Airtime & Subscriptions", icon: Receipt, short: "Airtime, data, TV, power & more.",
    headline: "Pay every bill from one place.", intro: "Buy airtime and data, pay electricity, water and TV, and manage recurring subscriptions from your wallet.",
    features: [{ title: "All billers", text: "UMEME, NWSC, DStv, GOtv, and all networks." }, { title: "Recurring", text: "Automate monthly subscriptions and never miss a payment." }, { title: "Resell & earn", text: "Businesses earn commission on every sale." }],
    steps: ["Choose the biller or network", "Enter account or phone number", "Pay and receive a token or receipt"], useCases: ["Households", "Agents & resellers", "Offices", "Landlords"] },
  { slug: "payouts", title: "Payouts", icon: Send, short: "Bulk pay to wallets and banks.",
    headline: "Send money to thousands at once.", intro: "Pay suppliers, agents, customers and partners in bulk to Mobile Money or any bank account.",
    features: [{ title: "Bulk upload", text: "Upload a spreadsheet and pay everyone in one go." }, { title: "Any destination", text: "Mobile Money wallets and all local banks." }, { title: "API ready", text: "Automate payouts from your own systems." }],
    steps: ["Upload recipients or call the API", "Approve the batch", "Recipients receive funds instantly"], useCases: ["Suppliers", "Agents", "Refunds", "Commissions"] },
  { slug: "pos-machine", title: "POS Machine Payment", icon: Monitor, short: "Smart card terminals for your counter.",
    headline: "Smart POS terminals for every counter.", intro: "Accept card, tap, QR and Mobile Money on one Android POS machine with a built-in receipt printer.",
    features: [{ title: "All-in-one", text: "Card, NFC, QR and Mobile Money on one device." }, { title: "Works offline", text: "Queue transactions when the network is down." }, { title: "Receipt printer", text: "Print receipts instantly for every sale." }],
    steps: ["Order your POS machine", "We deliver and activate it", "Start accepting payments the same day"], useCases: ["Supermarkets", "Petrol stations", "Pharmacies", "Hotels"] },
  { slug: "pos-system", title: "POS System & Installation", icon: Store, short: "Full point-of-sale setup for your business.",
    headline: "A complete POS system, installed for you.", intro: "Inventory, sales, staff and payments in one system — our team installs, configures and trains your staff on site.",
    features: [{ title: "Inventory & sales", text: "Track stock, sales and profits in real time." }, { title: "On-site installation", text: "Our engineers set up hardware and software for you." }, { title: "Staff training", text: "We train your team and support you 24/7." }],
    steps: ["Book a free consultation", "We install hardware and software", "Train your staff and go live"], useCases: ["Supermarkets", "Restaurants", "Bars & lounges", "Hardware shops"] },
  { slug: "payroll", title: "Payroll System", icon: Users, short: "Pay staff on time, every time.",
    headline: "Run payroll in minutes.", intro: "Calculate salaries, deductions and taxes, then pay your whole team to Mobile Money or bank in one click.",
    features: [{ title: "Automatic calculations", text: "PAYE, NSSF and deductions handled for you." }, { title: "One-click pay", text: "Pay every employee to wallet or bank instantly." }, { title: "Payslips", text: "Employees receive digital payslips automatically." }],
    steps: ["Add your employees", "Review the payroll run", "Approve and pay everyone"], useCases: ["SMEs", "Schools", "Farms", "Security companies"] },
  { slug: "savings-saccos", title: "Savings & SACCOs", icon: PiggyBank, short: "Goals, groups and SACCO management.",
    headline: "Save smarter, together.", intro: "Personal savings goals, group savings and full SACCO management — contributions, loans and member statements.",
    features: [{ title: "Savings goals", text: "Set targets and save automatically." }, { title: "SACCO tools", text: "Manage members, contributions and loans." }, { title: "Transparent statements", text: "Every member sees their balance in real time." }],
    steps: ["Create a goal or register your SACCO", "Members contribute via Mobile Money or bank", "Track growth and withdraw when ready"], useCases: ["Individuals", "Village groups", "SACCOs", "Workplace savings"] },
  { slug: "online-ecommerce", title: "Online & E-commerce", icon: ShoppingCart, short: "Checkout, plugins and APIs.",
    headline: "Sell online with a checkout that converts.", intro: "Add LIVRA checkout to your website or app with plugins and APIs — accept every payment method your customers use.",
    features: [{ title: "Hosted checkout", text: "A beautiful, secure checkout page ready to go." }, { title: "Plugins", text: "WooCommerce, Shopify and custom sites." }, { title: "Developer APIs", text: "Full REST APIs and webhooks." }],
    steps: ["Create your account and get API keys", "Install a plugin or integrate the API", "Start selling online"], useCases: ["Online stores", "SaaS", "Marketplaces", "Booking sites"] },
];

export type CompanyPage = { slug: string; title: string; short: string; icon: LucideIcon };
export const companyPages: CompanyPage[] = [
  { slug: "about", title: "About Us", short: "Our mission and story.", icon: Info },
  { slug: "partners", title: "Partners", short: "Banks, networks and platforms we work with.", icon: Handshake },
  { slug: "blog", title: "Blog", short: "News, guides and insights.", icon: Newspaper },
  { slug: "contact", title: "Contact Us", short: "Talk to our team.", icon: Mail },
  { slug: "careers", title: "Careers", short: "Join us building Africa's payments.", icon: Briefcase },
];

export type Country = {
  code: string; name: string; flag: string; currency: string; status: "Live" | "Coming soon";
  methods: string[];
  pricing: { method: string; fee: string }[];
};

const basePricing = (cur: string) => [
  { method: "Mobile Money collection", fee: "1.5%" },
  { method: "Mobile Money payout", fee: `1% (min ${cur} 500)` },
  { method: "Local card", fee: "2.9%" },
  { method: "International card", fee: "3.8%" },
  { method: "Apple & Google Pay", fee: "3.5%" },
  { method: "Bank transfer", fee: `${cur} 1,000 flat` },
  { method: "Bills & Airtime", fee: "Free" },
  { method: "Payment links & QR", fee: "1.5%" },
];

export const countries: Country[] = [
  { code: "UG", name: "Uganda", flag: flagUg, currency: "UGX", status: "Live", methods: ["MTN MoMo", "Airtel Money", "Visa", "Mastercard", "Bank transfer", "Apple Pay", "Google Pay", "QR"], pricing: basePricing("UGX") },
  { code: "KE", name: "Kenya", flag: flagKe, currency: "KES", status: "Live", methods: ["M-Pesa", "Airtel Money", "Visa", "Mastercard", "Bank transfer", "Apple Pay", "Google Pay"], pricing: basePricing("KES") },
  { code: "TZ", name: "Tanzania", flag: flagTz, currency: "TZS", status: "Live", methods: ["M-Pesa", "Tigo Pesa", "Airtel Money", "Visa", "Mastercard", "Bank transfer"], pricing: basePricing("TZS") },
  { code: "RW", name: "Rwanda", flag: flagRw, currency: "RWF", status: "Live", methods: ["MTN MoMo", "Airtel Money", "Visa", "Mastercard", "Bank transfer"], pricing: basePricing("RWF") },
  { code: "NG", name: "Nigeria", flag: flagNg, currency: "NGN", status: "Live", methods: ["Bank transfer", "USSD", "Visa", "Mastercard", "Verve", "Apple Pay", "Google Pay"], pricing: basePricing("NGN") },
  { code: "GH", name: "Ghana", flag: flagGh, currency: "GHS", status: "Live", methods: ["MTN MoMo", "Telecel Cash", "AirtelTigo Money", "Visa", "Mastercard", "Bank transfer"], pricing: basePricing("GHS") },
  { code: "ZA", name: "South Africa", flag: flagZa, currency: "ZAR", status: "Live", methods: ["Visa", "Mastercard", "EFT", "Apple Pay", "Google Pay", "QR"], pricing: basePricing("ZAR") },
];
