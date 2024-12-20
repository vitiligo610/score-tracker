import { Badge } from "@/components/ui/badge";
import { type MatchStatus } from "@/lib/definitons";
import { cn } from "@/lib/utils";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-500/10 text-blue-500" },
  started: { label: "In Progress", className: "bg-green-500/10 text-green-500" },
  completed: { label: "Completed", className: "bg-gray-500/10 text-gray-500" },
  tbd: { label: "TBD", className: "bg-yellow-500/10 text-yellow-700" },
};

const MatchStatusBadge = ({ status }: { status: MatchStatus }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};

export default MatchStatusBadge;