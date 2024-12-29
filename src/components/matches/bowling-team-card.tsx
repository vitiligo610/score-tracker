"use client";

import BowlersStats from "@/components/matches/bowlers-stats";
import { Card } from "@/components/ui/card";
import { useMatch } from "@/contexts/match-context";
import { Target } from "lucide-react";

const BowlingTeamCard = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;
  const currentBowler = match.bowlers.find(
    (bowler) => bowler.player_id === match.over.bowler_id
  );
  const nextBowler = match.bowlers.find(bowler => bowler.bowling_order > currentBowler!.bowling_order) ?? match.bowlers[0];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bowling</h3>
        <BowlersStats />
      </div>

      {currentBowler && (
        <div className="space-y-6">
          {/* Current Bowler Stats */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">{currentBowler.name}</h4>
              </div>
              <span className="text-muted-foreground text-sm">
                {currentBowler.bowling_style}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">OVERS</p>
                <p className="font-semibold">
                  {currentBowler.overs_bowled.toFixed(1)}
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
                  {currentBowler.economy_rate.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Current Over */}
          {/* <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">This Over</h4>
            <div className="flex gap-2">
              {currentOver?.balls?.map((ball, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    ball.is_wicket ? "bg-red-100 text-red-700" :
                    ball.runs_scored === 0 ? "bg-slate-100" :
                    ball.runs_scored === 4 ? "bg-blue-100 text-blue-700" :
                    ball.runs_scored === 6 ? "bg-purple-100 text-purple-700" :
                    "bg-primary/10"
                  )}
                >
                  {ball.is_wicket ? "W" : ball.runs_scored}
                </div>
              ))}
            </div>
          </div> */}

          {/* Next Bowler */}
          <div className="text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center justify-end gap-2">
              <span>Next Bowler: {nextBowler.name}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BowlingTeamCard;
