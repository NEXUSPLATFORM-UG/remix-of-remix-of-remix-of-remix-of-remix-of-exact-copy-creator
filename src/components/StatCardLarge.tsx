import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatCardLargeProps {
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
  data: { v: number }[];
}

const StatCardLarge = ({ title, value, subtitle, gradient, data }: StatCardLargeProps) => (
  <div className={`rounded-2xl p-5 text-primary-foreground ${gradient} shadow-lg`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium opacity-90">{title}</span>
      <TrendingUp size={18} className="opacity-70" />
    </div>
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={data}>
            <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default StatCardLarge;
