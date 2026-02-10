interface StatCardSmallProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

const StatCardSmall = ({ icon, label, value, gradient }: StatCardSmallProps) => (
  <div className="glass rounded-2xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground ${gradient}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default StatCardSmall;
