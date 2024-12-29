"use client";

import { User2, Target } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useMatch } from "@/contexts/match-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const BatsmenStats = () => {
  const { matchDetails: match, battingTeamPlayers } = useMatch();
  if (!match) return null;

  const currentBatsmen = match.batsmen;
  const currentBatsmenIds = currentBatsmen.map((b) => b.player_id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">
          <User2 className="h-4 w-4 mr-2" />
          Batting Stats
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-1">
          <SheetTitle>Batting Analysis</SheetTitle>
          <Separator />
        </SheetHeader>
        <ScrollArea className="h-[80vh] mt-4 pr-4">
          <div className="space-y-4">
            {/* Current & Dismissed Batsmen */}
            {battingTeamPlayers.map((player) => {
              const isCurrentBatsman = currentBatsmenIds.includes(player.player_id);
              const isDismissed = player.dismissal_id !== null;

              if (!isCurrentBatsman && !isDismissed) return null;

              return (
                <div
                  key={player.player_id}
                  className={cn(
                    "rounded-lg border p-4 transition-colors",
                    isCurrentBatsman && "bg-primary/5 border-primary",
                    isDismissed && "opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{player.name || player.first_name + " " + player.last_name}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Runs</p>
                      <p className="font-medium">{player.runs_scored}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Balls</p>
                      <p className="font-medium">{player.balls_faced}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">SR</p>
                      <p className="font-medium">{formatNumber(player.strike_rate, 2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">4s/6s</p>
                      <p className="font-medium">{player.fours}/{player.sixes}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next Batsmen */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Next to Bat</h3>
              <div className="space-y-2">
                {battingTeamPlayers
                  .filter(p => !currentBatsmenIds.includes(p.player_id) && !p.dismissal_id)
                  .map(player => (
                    <div
                      key={player.player_id}
                      className="rounded-lg border p-3 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-start gap-2">
                        <User2 className="h-4 w-4" />
                        <span>{player.name || player.first_name + " " + player.last_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{player.batting_style}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BatsmenStats;