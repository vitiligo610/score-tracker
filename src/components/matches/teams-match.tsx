"use client";

import MatchHeader from "@/components/matches/match-header";
import BattingTeamCard from "@/components/matches/batting-team-card";
import BowlingTeamCard from "@/components/matches/bowling-team-card";
import ScoreCard from "@/components/matches/score-card";
import MatchInputCard from "@/components/matches/match-input-card";
import { useMatch } from "@/contexts/match-context";
import TeamsMatchSkeleton from "@/components/ui/skeletons/teams-match-skeleton";

const TeamsMatch = () => {
  const { loading } = useMatch();

  return loading ? (
    <TeamsMatchSkeleton />
  ) : (
    <div className="flex flex-col">
      <MatchHeader />
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BattingTeamCard />
          <ScoreCard />
          <BowlingTeamCard />
        </div>
        <MatchInputCard />
      </div>
    </div>
  );
};

export default TeamsMatch;
