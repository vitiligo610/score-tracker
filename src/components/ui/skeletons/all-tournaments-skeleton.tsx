import TournamentCardSkeleton from "@/components/ui/skeletons/tournament-card-skeleton";

const AllTournamentsSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <TournamentCardSkeleton key={i} />
          ))}
      </div>
    </div>
  );
};

export default AllTournamentsSkeleton;
