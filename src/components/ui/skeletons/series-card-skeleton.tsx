import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SeriesCardSkeleton = () => {
  return (
    <Card className="overflow-hidden h-[280px] flex flex-col">
      <div className="relative z-10 h-full flex flex-col space-y-3">
        <CardHeader className="space-y-2 pb-4 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" /> {/* Type Badge */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-64" /> {/* Title line 1 */}
              </div>
            </div>
            <Skeleton className="h-6 w-20" /> {/* Format Badge */}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between flex-grow">
          <div className="space-y-4">
            {/* Timeline */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" /> {/* Calendar Icon */}
              <Skeleton className="h-6 w-48" /> {/* Date Range */}
            </div>

            {/* Teams */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" /> {/* Users Icon */}
              <Skeleton className="h-6 w-48" /> {/* Teams Count */}
            </div>

            {/* Locations */}
            <div className="flex items-start gap-3">
              <Skeleton className="h-6 w-6" /> {/* Map Icon */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SeriesCardSkeleton;
