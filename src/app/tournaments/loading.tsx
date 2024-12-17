import { Skeleton } from "@/components/ui/skeleton";
import TournamentCardSkeleton from "@/components/ui/skeletons/tournament-card-skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
        <Skeleton className="h-12 w-64 sm:h-14 sm:w-80 lg:h-16 lg:w-96" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, i) => (
          <TournamentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Loading;