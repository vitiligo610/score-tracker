import { Skeleton } from "@/components/ui/skeleton";

const TeamPlayerCardSkeleton = () => {
  return (
    <div className="relative snap-start flex-none w-72 bg-card rounded-xl shadow-lg border border-primary overflow-hidden">
      <div className="relative">
        <div className="absolute -left-4 top-4">
          <Skeleton className="h-8 w-16 rounded-r-full" />
        </div>
      </div>
      
      <div className="p-6 pt-16">
        <Skeleton className="h-6 w-48 mb-4" />
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 ml-2" />
          </div>
          
          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 ml-2" />
          </div>
          
          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 ml-2" />
          </div>
          
          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPlayerCardSkeleton;