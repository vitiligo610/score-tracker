import { PlayerWithTeam } from "@/lib/definitons";
import TeamPlayerCard from "@/components/teams/team-player-card";

interface TeamPlayersListProps {
  players: PlayerWithTeam[];
}

const TeamPlayersList = ({ players }: TeamPlayersListProps) => {
  return (
    <div className="mt-8 overflow-hidden">
      <h2 className="text-xl font-semibold mb-6">
        Team Players ({players.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {players.map((player) => (
          <TeamPlayerCard key={player.player_id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default TeamPlayersList;
