import { Skeleton } from "@/components/ui/skeleton";
import TeamPlayersListSkeleton from "@/components/ui/skeletons/team-players-list-skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-3 sm:flex-row justify-between items-start sm:items-center">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <TeamPlayersListSkeleton />
    </div>
  );
}

export default Loading;