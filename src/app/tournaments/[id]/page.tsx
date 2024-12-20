import { fetchTournamentById, fetchTournamentMatches } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchSchedule from "@/components/matches/matches-schedule";

export const metadata: Metadata = {
  title: "Tournament",
};

const TournamentPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const p = await params;
  const tournament_id = Number(p.id);
  const { tournament } = await fetchTournamentById(tournament_id);
  const { matches } = await fetchTournamentMatches(tournament_id);

  if (!tournament) {
    notFound();
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{tournament.name}</h1>
      <MatchSchedule 
        tournament={tournament}
        matches={matches}
      />
    </div>
  );
};

export default TournamentPage;