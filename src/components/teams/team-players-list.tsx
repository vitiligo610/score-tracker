import TeamPlayerCard from "@/components/teams/team-player-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlayerWithTeam } from "@/lib/definitons";

interface TeamPlayersListProps {
  players: PlayerWithTeam[];
}

const TeamPlayersList = ({ players }: TeamPlayersListProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">
        Team Players ({players.length})
      </h2>
      <div className="px-8">
        <Carousel>
          <CarouselContent>
            {players.map((player) => (
              <CarouselItem key={player.player_id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <TeamPlayerCard player={player} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TeamPlayersList;
