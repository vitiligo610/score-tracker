import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BattingTeamCardSkeleton = () => {
  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="space-y-4">
        {/* Two batsmen slots */}
        {[1, 2].map((i) => (
          <div key={i} className="p-2 py-4 rounded-md bg-primary/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="ml-2 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}

        {/* Next Batsman */}
        {/* <div className="mt-4 pt-2 border-t">
          <Skeleton className="h-4 w-40" />
        </div> */}
      </div>
    </Card>
  );
};

export default BattingTeamCardSkeleton;