import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month: "Jan", current: 200, last: 150 },
  { month: "Feb", current: 350, last: 200 },
  { month: "Mar", current: 300, last: 280 },
  { month: "Apr", current: 500, last: 300 },
  { month: "May", current: 400, last: 350 },
  { month: "Jun", current: 600, last: 400 },
  { month: "Jul", current: 550, last: 420 },
  { month: "Aug", current: 700, last: 500 },
  { month: "Sep", current: 650, last: 480 },
  { month: "Oct", current: 800, last: 550 },
  { month: "Nov", current: 750, last: 600 },
  { month: "Dec", current: 900, last: 650 },
];

const EarningsChart = () => (
  <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between mb-1">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Dashboard</h3>
        <p className="text-xs text-muted-foreground">Overview of Latest Month</p>
      </div>
      <div className="flex gap-1 text-xs">
        {["Daily", "Weekly", "Monthly", "Yearly"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              i === 2
                ? "bg-primary text-primary-foreground"
                : "glass-input text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
    <p className="text-3xl font-bold text-foreground mb-1">$3,468.96</p>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-sm text-foreground font-semibold">+12.5%</span>
      <span className="text-xs text-muted-foreground">Current Month Earning</span>
    </div>
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(210 100% 50%)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(210 100% 50%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(260 60% 55%)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="hsl(260 60% 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220 10% 45%)" }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "hsl(0 0% 100% / 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid hsl(0 0% 100% / 0.35)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        />
        <Area type="monotone" dataKey="current" stroke="hsl(210 100% 50%)" fill="url(#gradBlue)" strokeWidth={2} />
        <Area type="monotone" dataKey="last" stroke="hsl(260 60% 55%)" fill="url(#gradPurple)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default EarningsChart;
