import { Wallet, TrendingUp, DollarSign, Award } from "lucide-react";
import EarningsChart from "@/components/EarningsChart";
import TrafficDonut from "@/components/TrafficDonut";
import StatCardSmall from "@/components/StatCardSmall";
import StatCardLarge from "@/components/StatCardLarge";
import RecentActivities from "@/components/RecentActivities";
import OrdersTable from "@/components/OrdersTable";
import PageHeader from "@/components/PageHeader";

const sparkData1 = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 60 }, { v: 45 }, { v: 70 }, { v: 55 }];
const sparkData2 = [{ v: 30 }, { v: 50 }, { v: 25 }, { v: 55 }, { v: 40 }, { v: 65 }, { v: 50 }];
const sparkData3 = [{ v: 15 }, { v: 35 }, { v: 45 }, { v: 30 }, { v: 55 }, { v: 40 }, { v: 60 }];
const sparkData4 = [{ v: 40 }, { v: 25 }, { v: 50 }, { v: 35 }, { v: 60 }, { v: 45 }, { v: 70 }];

const Index = () => {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's your financial overview." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        <TrafficDonut />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardSmall icon={<Wallet size={18} />} label="Wallet Balance" value="$4,567.53" gradient="stat-card-blue" />
        <StatCardSmall icon={<TrendingUp size={18} />} label="Total Sent" value="$1,689.00" gradient="stat-card-cyan" />
        <StatCardSmall icon={<DollarSign size={18} />} label="Total Received" value="$2,851.00" gradient="stat-card-orange" />
        <StatCardSmall icon={<Award size={18} />} label="Savings" value="$52,567.29" gradient="stat-card-pink" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCardLarge title="Revenue" value="$432" subtitle="This month" gradient="stat-card-blue" data={sparkData1} />
        <StatCardLarge title="Transfers" value="128" subtitle="This month" gradient="stat-card-cyan" data={sparkData2} />
        <StatCardLarge title="Deposits" value="$8.2K" subtitle="This month" gradient="stat-card-orange" data={sparkData3} />
        <StatCardLarge title="Conversions" value="47" subtitle="This month" gradient="stat-card-purple" data={sparkData4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RecentActivities />
        <div className="lg:col-span-2">
          <OrdersTable />
        </div>
      </div>
    </>
  );
};

export default Index;
