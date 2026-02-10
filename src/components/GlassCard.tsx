import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className }: GlassCardProps) => (
  <div className={cn("glass rounded-2xl p-5", className)}>
    {children}
  </div>
);

export default GlassCard;
