import PlayerInfoSkeleton from "@/components/ui/skeletons/player-info-skeleton";

const PlayersSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <PlayerInfoSkeleton key={i} />
      ))}
    </div>
  );
}

export default PlayersSkeleton;