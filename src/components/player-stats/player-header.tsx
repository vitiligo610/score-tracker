import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@/lib/definitions";
import { CalendarDays, Blend, Hash, User } from "lucide-react";

interface PlayerHeaderProps {
  player: Player;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const initials = `${player.first_name[0]}${player.last_name[0]}`;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
      <Avatar className="w-24 h-24">
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-4 flex-1">
        <div>
          <h1 className="text-3xl font-bold">
            {player.first_name} {player.last_name}
          </h1>
          <p className="text-muted-foreground">{player.player_role}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Blend className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{player.batting_style}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Blend className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{player.bowling_style}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">#{player.jersey_number}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(player.date_of_birth).toLocaleDateString()}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
