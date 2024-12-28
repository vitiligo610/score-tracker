"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useMatch } from "@/contexts/match-context";
import { cn } from "@/lib/utils";
import { Activity, Target } from "lucide-react";

const BowlersStats = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;

  const currentBowler = match.bowlers.find(
    (bowler) => bowler.player_id === match.over.bowler_id
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link">
          <Activity className="h-4 w-4 mr-2" />
          Bowling Stats
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-1">
          <SheetTitle>Bowling Analysis</SheetTitle>
          <Separator />
        </SheetHeader>
        <ScrollArea className="h-[80vh] mt-4 pr-4">
          <div className="space-y-4">
            {match.bowlers.map((bowler) => (
              <div
                key={bowler.player_id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  currentBowler?.player_id === bowler.player_id &&
                    "bg-primary/5 border-primary"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {currentBowler?.player_id === bowler.player_id && (
                      <Target className="h-4 w-4 text-primary" />
                    )}
                    <div>
                      <h4 className="font-medium">{bowler.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bowler.bowling_style}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {bowler.wickets_taken}-{bowler.runs_conceded}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bowler.overs_bowled.toFixed(1)} overs
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Economy</p>
                    <p className="font-medium">
                      {bowler.economy_rate.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Dots</p>
                    <p className="font-medium">{bowler.dot_balls || 0}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Maidens</p>
                    <p className="font-medium">{bowler.maidens || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default BowlersStats;