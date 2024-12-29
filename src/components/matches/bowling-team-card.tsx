"use client";

import BowlersStats from "@/components/matches/bowlers-stats";
import { Card } from "@/components/ui/card";
import { useMatch } from "@/contexts/match-context";
import { formatNumber } from "@/lib/utils";
import { Target } from "lucide-react";

const BowlingTeamCard = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;
  const currentBowler = match.bowlers.find(
    (bowler) => bowler.player_id === match.over.bowler_id
  );
  const nextBowler = match.bowlers.find(bowler => bowler.bowling_order > currentBowler!.bowling_order) ?? match.bowlers[0];

  return (
    <Card className="p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bowling</h3>
        <BowlersStats />
      </div>

      {currentBowler && (
        <div className="flex flex-col justify-between flex-1">
          {/* Current Bowler Stats */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">{currentBowler.name || currentBowler.first_name + " " + currentBowler.last_name}</h4>
              </div>
              <span className="text-muted-foreground text-sm">
                {currentBowler.bowling_style}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">OVERS</p>
                <p className="font-semibold">
                  {formatNumber(currentBowler.overs_bowled, 1)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">RUNS</p>
                <p className="font-semibold">{currentBowler.runs_conceded}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">WICKETS</p>
                <p className="font-semibold">{currentBowler.wickets_taken}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">ECON</p>
                <p className="font-semibold">
                  {formatNumber(currentBowler.economy_rate, 2)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center justify-end gap-2">
              <span>Next Bowler: {nextBowler.name || nextBowler.first_name + " " + nextBowler.last_name}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BowlingTeamCard;
