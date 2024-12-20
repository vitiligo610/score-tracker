import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchCardSkeleton() {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-6">
            <div className="flex-1 text-center">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto mt-2" />
            </div>

            <div className="px-4">
              <Skeleton className="h-6 w-8" />
            </div>

            <div className="flex-1 text-center">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto mt-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
}