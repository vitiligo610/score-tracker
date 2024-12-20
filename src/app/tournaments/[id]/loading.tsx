import TournamentHeaderSkeleton from "@/components/ui/skeletons/tournament-header-skeleton";
import MatchScheduleSkeleton from "@/components/ui/skeletons/match-schedule-skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <TournamentHeaderSkeleton />
      <MatchScheduleSkeleton />
    </div>
  );
}

export default Loading;