import { Search } from "lucide-react";

const orders = [
  { id: "TXN-2386", customer: "Alice Johnson", type: "Transfer", price: "$249", status: "Completed", statusColor: "stat-card-green" },
  { id: "TXN-2387", customer: "Maria Santos", type: "Deposit", price: "$2,412", status: "Pending", statusColor: "stat-card-orange" },
  { id: "TXN-2388", customer: "David Chen", type: "Send", price: "$439", status: "Failed", statusColor: "bg-destructive" },
  { id: "TXN-2389", customer: "Sarah Kim", type: "Convert", price: "$820", status: "Completed", statusColor: "stat-card-green" },
  { id: "TXN-2390", customer: "James Park", type: "Transfer", price: "$1,423", status: "Pending", statusColor: "stat-card-orange" },
];

const OrdersTable = () => (
  <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
        <p className="text-xs text-muted-foreground">Recent activity overview</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {["All", "Completed", "Pending"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                i === 0 ? "bg-primary text-primary-foreground" : "glass-input text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="glass-input pl-8 pr-3 py-1.5 text-xs rounded-xl w-32 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2 font-semibold text-muted-foreground">ID</th>
          <th className="text-left py-2 font-semibold text-muted-foreground">NAME</th>
          <th className="text-left py-2 font-semibold text-muted-foreground">TYPE</th>
          <th className="text-left py-2 font-semibold text-muted-foreground">AMOUNT</th>
          <th className="text-left py-2 font-semibold text-muted-foreground">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border last:border-0">
            <td className="py-2.5 text-foreground">{order.id}</td>
            <td className="py-2.5 text-foreground">{order.customer}</td>
            <td className="py-2.5 text-muted-foreground">{order.type}</td>
            <td className="py-2.5 text-foreground font-medium">{order.price}</td>
            <td className="py-2.5">
              <span className={`px-2.5 py-1 rounded-xl text-primary-foreground text-[10px] font-medium ${order.statusColor}`}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
