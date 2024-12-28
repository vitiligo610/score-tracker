import { Match } from "@/lib/definitons";
import MatchHeader from "@/components/matches/match-header";
import { MatchProvider } from "@/contexts/match-context";
import BattingTeamCard from "@/components/matches/batting-team-card";
import BowlingTeamCard from "@/components/matches/bowling-team-card";
import ScoreCard from "@/components/matches/score-card";
import MatchInputCard from "@/components/matches/match-input-card";

interface TeamsMatchProps {
  match_id: number;
  match: Match;
}

const TeamsMatch = ({ match_id, match }: TeamsMatchProps) => {
  return (
    <MatchProvider match_id={match_id}>
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
    </MatchProvider>
  )
};

export default TeamsMatch;