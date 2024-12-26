import { Match } from "@/lib/definitons";
import MatchHeader from "@/components/matches/match-header";
import { MatchProvider } from "@/contexts/match-context";
import BattingTeamCard from "@/components/matches/batting-team-card";

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
            {/* Scorecard */}
            <div className="bg-card rounded-lg border p-4">
              {/* Scorecard content will go here */}
            </div>
            {/* Batting Team Card */}
            <BattingTeamCard />
            {/* Bowling Team Card */}
            <div className="bg-card rounded-lg border p-4">
              {/* Bowling team content will go here */}
            </div>
          </div>
        </div>
      </div>
    </MatchProvider>
  )
};

export default TeamsMatch;