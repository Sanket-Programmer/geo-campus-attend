import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "eligible" | "not-eligible" | "present" | "absent" | "active" | "inactive" | "pending" | "blocked";
}

const styles: Record<StatusBadgeProps["status"], string> = {
  eligible: "bg-success/15 text-success border-success/30 hover:bg-success/20",
  "not-eligible": "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20",
  present: "bg-success/15 text-success border-success/30 hover:bg-success/20",
  absent: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20",
  active: "bg-accent/15 text-accent border-accent/30 hover:bg-accent/20",
  inactive: "bg-muted text-muted-foreground border-border hover:bg-muted",
  pending: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20",
  blocked: "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20",
};

const labels: Record<StatusBadgeProps["status"], string> = {
  eligible: "Eligible",
  "not-eligible": "Not Eligible",
  present: "Present",
  absent: "Absent",
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  blocked: "Blocked",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant="outline" className={`lg:text-xs font-medium ${styles[status]} text-[9px] leading-4`}>
      {labels[status]}
    </Badge>
  );
};

export default StatusBadge;
