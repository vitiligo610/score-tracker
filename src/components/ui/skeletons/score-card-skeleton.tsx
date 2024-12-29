import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const ScoreCardSkeleton = () => {
  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2 mb-4 text-sm font-semibold uppercase">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-9" />
        <Skeleton className="h-5 w-24" />
      </div>
      
      {/* Main Score */}
      <div className="flex flex-col gap-2 justify-center items-center mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Run Rates */}
      <div className="gap-4 w-full mb-4">
        <div className="text-center flex items-center justify-center space-x-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Extras & Partnership */}
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default ScoreCardSkeleton;