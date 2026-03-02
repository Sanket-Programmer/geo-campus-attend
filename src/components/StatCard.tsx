import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "accent";
}

const variantStyles = {
  default: "bg-card shadow-card",
  success: "bg-success/10 border-success/20",
  warning: "bg-warning/10 border-warning/20",
  destructive: "bg-destructive/10 border-destructive/20",
  accent: "bg-accent/10 border-accent/20",
};

const iconVariantStyles = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
  accent: "bg-accent/20 text-accent",
};

const StatCard = ({ title, value, subtitle, icon, variant = "default" }: StatCardProps) => {
  return (
    <div className={`rounded-xl border p-4 md:p-5 transition-all hover:shadow-elevated ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariantStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
