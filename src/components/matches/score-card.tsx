"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMatch } from "@/contexts/match-context";
import { getRequiredRunRate, getCurrentRunRate } from "@/lib/utils";

const ScoreCard = () => {
  const { matchDetails: match } = useMatch();
  const currentInnings = match?.innings;

  const lastSixBalls = match?.balls?.slice(-6) || [];
  const extras = match?.extras || { wides: 0, noBalls: 0, byes: 0, legByes: 0 };

  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      {/* Main Score */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold">
          {currentInnings?.total_runs || 0}/{currentInnings?.total_wickets || 0}
        </div>
        <div className="text-lg text-muted-foreground">
          {Math.floor((currentInnings?.balls || 0) / 6)}.
          {(currentInnings?.balls || 0) % 6} Overs
        </div>
      </div>

      {/* Run Rates */}
      <div className="mb-4">
        <div className="text-center">
          <div className="space-x-2">
            <span className="text-sm text-muted-foreground">
              Current Run Rate:{" "}
            </span>
            <span className="text-lg font-semibold">
              {getCurrentRunRate(
                currentInnings?.total_runs || 0,
                currentInnings?.total_overs || 1 * 6
              )}
            </span>
          </div>
        </div>
        {currentInnings?.number === 2 && (
          <div className="text-center">
            <div className="space-x-2">
              <span className="text-sm text-muted-foreground">
                Current Run Rate:{" "}
              </span>
              <span className="text-lg font-semibold">
                {getRequiredRunRate(
                  currentInnings.target_score -
                    (currentInnings.total_runs || 0),
                  (match?.over?.over_number ?? 1) * 6 -
                    (currentInnings.balls || 0)
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />
      {/* Extras & Partnership */}
      <div className="w-full space-y-2 text-sm px-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Extras 5</span>
          <span className="text-xs text-muted-foreground ml-1">
            (W{extras.wides} NB{extras.noBalls} B{extras.byes} LB
            {extras.legByes})
          </span>
        </div>
        {/* {match?.batsmen && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Partnership</span>
            <span>
              {match.batsmen.reduce((acc, b) => acc + (b.partnership_runs || 0), 0)}
              ({match.batsmen.reduce((acc, b) => acc + (b.partnership_balls || 0), 0)} balls)
            </span>
          </div>
        )} */}
      </div>
    </Card>
  );
};

export default ScoreCard;
