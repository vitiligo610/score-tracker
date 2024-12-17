import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TournamentCardSkeleton = () => {
  return (
    <div className="block">
      <Card className="overflow-hidden h-[270px] flex flex-col">
        <Skeleton className="h-2" />

        <CardHeader className="space-y-1 flex-shrink-0">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-2 min-h-[4rem]">
              <Skeleton className="h-7 w-[200px]" />
              <Skeleton className="h-7 w-[160px]" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 flex-grow">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[200px]" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[100px]" />
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TournamentCardSkeleton;