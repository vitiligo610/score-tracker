import { Skeleton } from "@/components/ui/skeleton";
import MatchScheduleSkeleton from "@/components/ui/skeletons/match-schedule-skeleton";

const CompetitionSkeleton = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-[300px]" />
      </div>
      <MatchScheduleSkeleton />
    </div>
  );
};

export default CompetitionSkeleton;
