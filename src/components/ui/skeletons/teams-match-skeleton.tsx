import BattingTeamCardSkeleton from "@/components/ui/skeletons/batting-team-card-skeleton";
import BowlingTeamCardSkeleton from "@/components/ui/skeletons/bowling-team-card-skeleton";
import MatchHeaderSkeleton from "@/components/ui/skeletons/match-header-skeleton";
import MatchInputCardSkeleton from "@/components/ui/skeletons/match-input-card-skeleton";
import ScoreCardSkeleton from "@/components/ui/skeletons/score-card-skeleton";

const TeamsMatchSkeleton = () => {
  return (
    <div className="flex flex-col">
      <MatchHeaderSkeleton />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BattingTeamCardSkeleton />
          <ScoreCardSkeleton />
          <BowlingTeamCardSkeleton />
        </div>
        <MatchInputCardSkeleton />
      </div>
    </div>
  )
}

export default TeamsMatchSkeleton;