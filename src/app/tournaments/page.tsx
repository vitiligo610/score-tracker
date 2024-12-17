import { fetchTournaments } from "@/lib/actions";
import TournamentCard from "@/components/tournaments/tournament-card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateTournamentDialog from "@/components/tournaments/create-tournament-dialog";
import TournamentFilters from "@/components/tournaments/tournament-filteres";

const Tournaments = async ({
  searchParams,
}: {
  searchParams: { filter?: string };
}) => {
  const params = await searchParams;
  const { tournaments } = await fetchTournaments(params.filter || "all");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-start md:items-center">
        <h1 className="text-4xl lg:text-7xl text-primary font-bold">
          Tournaments
        </h1>
        <CreateTournamentDialog />
      </div>
      <TournamentFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard 
            key={tournament.tournament_id} 
            tournament={tournament}
          />
        ))}
      </div>
    </div>
  );
}

export default Tournaments;