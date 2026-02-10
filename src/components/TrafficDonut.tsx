import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Desktop", value: 55, color: "hsl(210 100% 50%)" },
  { name: "Tablet", value: 33, color: "hsl(260 60% 55%)" },
  { name: "Mobile", value: 12, color: "hsl(330 75% 60%)" },
];

const TrafficDonut = () => (
  <div className="glass rounded-2xl p-5">
    <h3 className="text-sm font-semibold text-foreground mb-4">Traffic</h3>
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-6">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-xl font-bold text-foreground">{item.value}%</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TrafficDonut;
