import {
  fetchTournamentById,
  fetchTournamentMatches,
  fetchTournamentNameById,
} from "@/lib/actions";
import { notFound } from "next/navigation";
import MatchSchedule from "@/components/matches-schedule/matches-schedule";
import { Suspense } from "react";
import CompetitionSkeleton from "@/components/ui/skeletons/competition-skeleton";
import { PageIdProps } from "@/lib/definitions";

export const generateMetadata = async ({ params }: PageIdProps) => {
  const tournament_id = (await params).id;

  const name = await fetchTournamentNameById(tournament_id);

  return {
    title: name,
  };
};

const TournamentPage = async ({ params }: PageIdProps) => {
  const tournament_id = (await params).id;

  const { tournament } = await fetchTournamentById(tournament_id);
  const { matches } = await fetchTournamentMatches(tournament_id);

  if (!tournament) {
    notFound();
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <span className="text-secondary text-sm tracking-widest uppercase">
            Tournament
          </span>
          <h1 className="text-4xl font-bold text-primary">{tournament.name}</h1>
        </div>
        <MatchSchedule tournament={tournament} matches={matches} />
      </div>
    </Suspense>
  );
};

export default TournamentPage;
