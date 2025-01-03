import { Match } from "@/lib/definitions";
import SummaryHeader from "./summary-header";
import InningsTab from "./innings-tab";

interface MatchSummaryProps {
  match: Match;
}

const MatchSummary = ({ match }: MatchSummaryProps) => {
  return (
    <div className="space-y-6">
      <SummaryHeader
        competitionName={match.series_name || match.tournament_name}
        team1={match.team1!}
        team2={match.team2!}
        tossWinnerId={match.toss_winner_id!}
        matchWinnerId={match.winner_team_id!}
      />
      <InningsTab match_id={Number(match.match_id)} />
    </div>
  );
};

export default MatchSummary;
