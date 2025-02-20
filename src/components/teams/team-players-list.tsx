import TeamPlayerCard from "@/components/teams/team-player-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlayerWithTeam } from "@/lib/definitions";
import TeamCaptainDialog from "@/components/teams/team-captain-dialog";

interface TeamPlayersListProps {
  players: PlayerWithTeam[];
  teamId: number;
  captainId?: number;
}

const TeamPlayersList = ({
  players,
  teamId,
  captainId,
}: TeamPlayersListProps) => {
  return (
    <div className="mt-8">
      <div className="flex items-start justify-start">
        <h2 className="text-2xl font-semibold mb-6">
          Team Players ({players.length})
        </h2>
        <TeamCaptainDialog
          players={players}
          teamId={teamId}
          captainId={captainId}
        />
      </div>
      <div className="px-8">
        {players.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {players.map((player) => (
                <CarouselItem
                  key={player.player_id}
                  className="pl-4 basis-1 md:basis-1/2 lg:basis-1/2 xl:basis-1/4"
                >
                  <TeamPlayerCard
                    player={player}
                    isCaptain={player.player_id === captainId}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <h1 className="text-center text-muted-foreground mt-12">
            No players added yet!
          </h1>
        )}
      </div>
    </div>
  );
};

export default TeamPlayersList;
