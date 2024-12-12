import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TeamInfoSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-32" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 h-24">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

export default TeamInfoSkeleton;