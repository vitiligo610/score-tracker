import MatchSummary from "@/components/match-summary/match-summary";
import MatchToss from "@/components/matches/match-toss";
import TeamsMatch from "@/components/matches/teams-match";
import { MatchProvider } from "@/contexts/match-context";
import { fetchMatch } from "@/lib/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match",
};

interface Props {
  params: {
    id: number;
  }
};

const MatchPage = async ({ params }: Props) => {
  const p = await params;
  const match_id = p.id;
  const { match } = await fetchMatch(match_id);
  // console.log("match is ", match);

  return (
    <div>
      {match.status === "scheduled" && <MatchToss match={match} />}
      {match.status === "started" && (
        <MatchProvider match_id={match_id}>
          <TeamsMatch />
        </MatchProvider>
      )}
      {match.status === "completed" && <MatchSummary match={match} />}
    </div>
  )
}

export default MatchPage;