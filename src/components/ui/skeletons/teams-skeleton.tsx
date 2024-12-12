import TeamInfoSkeleton from "@/components/ui/skeletons/team-info-skeleton";

const TeamsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <TeamInfoSkeleton key={i} />
      ))}
    </div>
  );
}

export default TeamsSkeleton;