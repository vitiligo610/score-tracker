"use client";

import { Card } from "@/components/ui/card";
import { useMatch } from "@/contexts/match-context";
import { cn, formatNumber } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import BatsmenStats from "@/components/matches/batsmen-stats";

const BattingTeamCard = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Batting</h3>
        <BatsmenStats />
      </div>

      <div className="space-y-4">
        {/* Current Batsmen */}
        {match.batsmen.map((batsman) => (
          <div
            key={batsman.player_id}
            className={cn(
              "p-2 py-4 rounded-md bg-primary/5",
              match.striker_player_id === batsman.player_id &&
                "border border-primary"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative px-2 flex gap-2">
                  {match.striker_player_id === batsman.player_id && (
                    <ChevronRight className="text-primary" />
                  )}
                  <span className="font-medium">
                    {batsman.name ||
                      batsman.first_name + " " + batsman.last_name}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-semibold">{batsman.runs_scored} </span>
                <span className="text-muted-foreground">
                  ({batsman.balls_faced})
                </span>
              </div>
            </div>
            <div className="ml-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>{batsman.batting_style}</span>
              <span>SR {formatNumber(batsman.strike_rate, 2)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BattingTeamCard;
