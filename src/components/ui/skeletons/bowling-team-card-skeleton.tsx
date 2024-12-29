import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BowlingTeamCardSkeleton = () => {
  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Current Bowler Section */}
      <div className="space-y-7">
        <div className="bg-primary/5 rounded-lg p-4">
          {/* Bowler Name and Style */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {['OVERS', 'RUNS', 'WKTS', 'ECON'].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-12 mx-auto" />
                <Skeleton className="h-5 w-8 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 text-sm text-muted-foreground border-t pt-3">
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-6 w-36" />
        </div>
      </div>
    </Card>
  );
};

export default BowlingTeamCardSkeleton;