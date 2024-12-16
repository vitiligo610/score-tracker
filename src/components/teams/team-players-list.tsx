import { PlayerWithTeam } from "@/lib/definitons";
import RemovePlayerButton from "./remove-player-button";

interface TeamPlayersListProps {
  players: PlayerWithTeam[];
}

const TeamPlayersList = ({ players }: TeamPlayersListProps) => {
  return (
    <div className="mt-8 overflow-hidden">
      <h2 className="text-xl font-semibold mb-6">Team Players</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {players.map((player) => (
          <div
            key={player.player_id}
            className="relative snap-start flex-none w-72 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
          >
            
            <div className="relative">
              <div className="absolute -left-4 top-4 bg-primary text-white py-2 px-6 rounded-r-full shadow-md">
                #{player.jersey_number}
              </div>
              <div className="absolute right-4 top-5">
                <RemovePlayerButton
                  player_id={player.player_id}
                  team_id={player.team_id}
                />
              </div>
            </div>
            <div className="p-6 pt-16">
              <h3 className="text-lg font-bold">
                {player.first_name} {player.last_name}
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">Role:</span>
                  <span className="font-medium">
                    {player.player_role.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">Batting:</span>
                  <span className="font-medium">
                    {player.batting_style.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">Bowling:</span>
                  <span className="font-medium">
                    {player.bowling_style.split("_").join(" ")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">DOB:</span>
                  <span className="font-medium">
                    {new Date(player.date_of_birth).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPlayersList;
