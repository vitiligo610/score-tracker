import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MatchInputCardSkeleton = () => {
  return (
    <Card className="p-6 mt-6 bg-card shadow-md rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-24" />
        
        {/* Ball Circles */}
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-9 h-9 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Runs Input Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {[...Array(7)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 rounded-md"
          />
        ))}
      </div>

      {/* Extras and Wicket Controls */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-6 w-[75px] rounded-md"
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-6 w-[75px] rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
    </Card>
  );
};

export default MatchInputCardSkeleton;