import { Skeleton } from "@/components/ui/skeleton";
import PlayerInfoSkeleton from "@/components/ui/skeletons/player-info-skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlayerInfoSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Loading;