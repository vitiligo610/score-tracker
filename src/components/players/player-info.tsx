import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Player } from "@/lib/definitons";
import { CalendarDays, EditIcon, ShirtIcon, User2 } from "lucide-react";
import DeletePlayerButton from "./delete-player-button";
import PlayerFormDialog from "./player-form-dialog";

interface PlayerInfoProps {
  player: Player;
}

export function PlayerInfo({ player }: PlayerInfoProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{`${player.first_name} ${player.last_name}`}</h2>
            <p className="text-muted-foreground">#{player.jersey_number}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <PlayerFormDialog player={player}>
            <Button variant="default" size="icon">
              <EditIcon />
            </Button>
          </PlayerFormDialog>
          <DeletePlayerButton player_id={player.player_id} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-start space-x-4 text-sm">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span>{player.date_of_birth.toLocaleDateString()}</span>
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Player Role</span>
            <Badge variant="secondary" className="font-semibold">
              {player.player_role}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Batting Style</span>
            <Badge variant="outline" className="font-semibold">
              {player.batting_style}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bowling Style</span>
            <Badge variant="outline" className="font-semibold">
              {player.bowling_style}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-4">
          <ShirtIcon className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold text-primary">#{player.jersey_number}</span>
        </div>
      </CardContent>
    </Card>
  );
}