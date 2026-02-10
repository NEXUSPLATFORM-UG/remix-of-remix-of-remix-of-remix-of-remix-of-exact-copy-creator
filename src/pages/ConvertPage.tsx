import { RefreshCw, ArrowDown, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCardSmall from "@/components/StatCardSmall";

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];

const rateData: Record<string, { v: number }[]> = {
  "USD/EUR": [{ v: 0.91 }, { v: 0.92 }, { v: 0.915 }, { v: 0.925 }, { v: 0.92 }, { v: 0.918 }, { v: 0.921 }, { v: 0.923 }, { v: 0.919 }, { v: 0.922 }, { v: 0.92 }, { v: 0.9215 }],
  "USD/GBP": [{ v: 0.78 }, { v: 0.785 }, { v: 0.79 }, { v: 0.788 }, { v: 0.792 }, { v: 0.789 }, { v: 0.791 }, { v: 0.787 }, { v: 0.79 }, { v: 0.788 }, { v: 0.789 }, { v: 0.7891 }],
  "USD/JPY": [{ v: 148 }, { v: 149 }, { v: 148.5 }, { v: 150 }, { v: 149.5 }, { v: 150.2 }, { v: 149.8 }, { v: 150.5 }, { v: 149.2 }, { v: 150.1 }, { v: 149.9 }, { v: 149.82 }],
};

const exchangeHistory = [
  { date: "Feb 10", pair: "USD → EUR", from: "$500.00", to: "€460.75", rate: "0.9215" },
  { date: "Feb 9", pair: "EUR → GBP", from: "€1,000.00", to: "£856.20", rate: "0.8562" },
  { date: "Feb 8", pair: "USD → JPY", from: "$200.00", to: "¥29,964", rate: "149.82" },
  { date: "Feb 7", pair: "GBP → USD", from: "£500.00", to: "$633.50", rate: "1.2670" },
  { date: "Feb 6", pair: "USD → CAD", from: "$1,000.00", to: "CA$1,354.20", rate: "1.3542" },
  { date: "Feb 5", pair: "USD → EUR", from: "$2,500.00", to: "€2,303.75", rate: "0.9215" },
];

const liveRates = [
  { pair: "USD/EUR", rate: "0.9215", change: "+0.12%" },
  { pair: "USD/GBP", rate: "0.7891", change: "-0.08%" },
  { pair: "USD/JPY", rate: "149.82", change: "+0.34%" },
  { pair: "USD/CAD", rate: "1.3542", change: "+0.05%" },
  { pair: "EUR/GBP", rate: "0.8562", change: "-0.03%" },
  { pair: "EUR/JPY", rate: "162.53", change: "+0.21%" },
];

const chartTimeLabels = ["12am", "4am", "8am", "12pm", "4pm", "8pm", "12am", "", "", "", "", "Now"];

const ConvertPage = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState("");
  const [selectedPair, setSelectedPair] = useState("USD/EUR");

  const rate = liveRates.find(r => r.pair === selectedPair)?.rate || "1.0000";
  const toAmount = fromAmount ? (parseFloat(fromAmount) * parseFloat(rate)).toFixed(2) : "";

  const chartData = (rateData[selectedPair] || rateData["USD/EUR"]).map((d, i) => ({
    time: chartTimeLabels[i] || "",
    rate: d.v,
  }));

  return (
    <>
      <PageHeader title="Convert" subtitle="Exchange currencies at live rates" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<RefreshCw size={18} />} label="Total Converted" value="$15,230" gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="This Month" value="$4,700" gradient="stat-card-green" />
        <StatCardSmall icon={<ArrowUpRight size={18} />} label="Exchanges" value="47" gradient="stat-card-purple" />
        <StatCardSmall icon={<ArrowDownLeft size={18} />} label="Saved in Fees" value="$89.50" gradient="stat-card-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Live Rate Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Live Exchange Rate</h3>
              <p className="text-2xl font-bold text-foreground mt-1">1 {selectedPair.split("/")[0]} = {rate} {selectedPair.split("/")[1]}</p>
            </div>
            <select value={selectedPair} onChange={e => setSelectedPair(e.target.value)}
              className="glass-input px-3 py-2 rounded-xl text-xs text-foreground focus:outline-none appearance-none">
              {liveRates.map(r => <option key={r.pair} value={r.pair}>{r.pair}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(220 10% 45%)" }} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 100% / 0.7)", backdropFilter: "blur(20px)", border: "1px solid hsl(0 0% 100% / 0.35)", borderRadius: "12px" }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(210 100% 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Converter */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Currency Converter</h3>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
            <div className="flex gap-2 mb-3">
              <select value={fromCurrency} onChange={e => { setFromCurrency(e.target.value); setSelectedPair(`${e.target.value}/${toCurrency}`); }}
                className="glass-input px-3 py-3 rounded-xl text-sm text-foreground focus:outline-none appearance-none w-20">
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} placeholder="0.00"
                className="glass-input flex-1 px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="flex justify-center my-2">
              <button onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity">
                <ArrowDown size={18} />
              </button>
            </div>

            <label className="text-xs text-muted-foreground mb-1.5 block">To</label>
            <div className="flex gap-2 mb-4">
              <select value={toCurrency} onChange={e => { setToCurrency(e.target.value); setSelectedPair(`${fromCurrency}/${e.target.value}`); }}
                className="glass-input px-3 py-3 rounded-xl text-sm text-foreground focus:outline-none appearance-none w-20">
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
              <input readOnly value={toAmount} placeholder="0.00"
                className="glass-input flex-1 px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-muted/30" />
            </div>

            <button className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <RefreshCw size={16} /> Convert Now
            </button>
          </div>
        </div>
      </div>

      {/* Live Rates & Recent Exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Live Rates</h3>
          <div className="space-y-3">
            {liveRates.map(r => (
              <button key={r.pair} onClick={() => setSelectedPair(r.pair)}
                className={`w-full flex items-center justify-between py-2 border-b border-border last:border-0 px-2 rounded-lg transition-colors hover:bg-[hsl(0_0%_100%/0.3)] ${selectedPair === r.pair ? "bg-primary/5" : ""}`}>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{r.pair}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground">{r.rate}</span>
                  <span className={`text-xs ml-2 ${r.change.startsWith("+") ? "text-chart-green" : "text-destructive"}`}>{r.change}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Exchanges</h3>
          <div className="space-y-3">
            {exchangeHistory.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.pair}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} • Rate: {tx.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{tx.to}</p>
                  <p className="text-xs text-muted-foreground">from {tx.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConvertPage;
