import TeamPlayerCardSkeleton from "@/components/ui/skeletons/team-player-card-skeleton";
import { Skeleton } from "../skeleton";

const TeamPlayersListSkeleton = () => {
  return (
    <div className="mt-8 overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          <Skeleton className="h-4 w-16 mb-2" />
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <TeamPlayerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default TeamPlayersListSkeleton;