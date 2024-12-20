import { fetchTournaments } from "@/lib/actions";
import TournamentCard from "@/components/tournaments/tournament-card";

const AllTournaments = async ({ filter }: { filter?: string }) => {
  const { tournaments } = await fetchTournaments(filter || "all");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.tournament_id}
            tournament={tournament}
          />
        ))}
      </div>

      {tournaments.length == 0 && (
        <div className="h-40 w-full flex items-center justify-center">
          <span className="text-muted-foreground text-2xl">
            No tournaments found!
          </span>
        </div>
      )}
    </>
  );
};

export default AllTournaments;
