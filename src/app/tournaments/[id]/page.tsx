import { fetchTournamentById, fetchTournamentMatches } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchSchedule from "@/components/matches/matches-schedule";
import { Suspense } from "react";
import TournamentHeaderSkeleton from "@/components/ui/skeletons/tournament-header-skeleton";
import MatchScheduleSkeleton from "@/components/ui/skeletons/match-schedule-skeleton";

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
    <Suspense
      fallback={
        <div className="container mx-auto py-8 space-y-8">
          <TournamentHeaderSkeleton />
          <MatchScheduleSkeleton />
        </div>
      }
    >
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
