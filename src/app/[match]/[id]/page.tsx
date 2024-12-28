import MatchToss from "@/components/matches/match-toss";
import TeamsMatch from "@/components/matches/teams-match";
import { MatchProvider } from "@/contexts/match-context";
import { fetchMatchById } from "@/lib/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match",
};

interface Props {
  params: {
    id: string;
  }
};

const MatchPage = async ({ params }: Props) => {
  const p = await params;
  const match_id = Number(p.id);
  const { match } = await fetchMatchById(match_id);
  // console.log("match is ", match);

  return (
    <div>
      {match.status === "scheduled" && <MatchToss match={match} />}
      {match.status === "started" && (
        <MatchProvider match_id={match_id}>
          <TeamsMatch />
        </MatchProvider>
      )}
    </div>
  )
}

export default MatchPage;