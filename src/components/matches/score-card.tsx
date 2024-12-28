"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMatch } from "@/contexts/match-context";
import { OVERS_FOR_FORMAT } from "@/lib/constants";
import {
  getRequiredRunRate,
  getCurrentRunRate,
} from "@/lib/utils";

const ScoreCard = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;

  const currentInnings = match.innings;
  const currentOver = match.over;
  const lastBall = currentOver.balls.length > 0 ? currentOver.balls[currentOver.balls.length - 1] : null;

  const extras = currentInnings.extras;

  const getBattingTeamName = () => {
    return currentInnings.team_id === match.team1.team_id
      ? match.team1.name
      : match.team2.name;
  };

  const getBowlingTeamName = () => {
    return currentInnings.team_id !== match.team1.team_id
      ? match.team1.name
      : match.team2.name;
  };

  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2 mb-4 text-sm font-semibold uppercase">
        <h2 className="text-primary">{getBattingTeamName()}</h2>
        <span>v</span>
        <h2 className="text-primary">{getBowlingTeamName()}</h2>
      </div>
      {/* Main Score */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold">
          {currentInnings.total_runs || 0} / {currentInnings.total_wickets || 0}
        </div>
        <div className="text-lg text-muted-foreground">
          {currentOver.over_number - 1}.
          {lastBall ? (lastBall.ball_number || 0) % 6 : 0} Overs
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
                currentInnings.total_runs || 0,
                (currentInnings.total_overs || 1) * 6 +
                  (lastBall?.ball_number || 0)
              )}
            </span>
          </div>
        </div>
        {currentInnings.number === 2 &&
          match.competition.format !== "Test" && (
            <div className="text-center">
              <div className="space-x-2">
                <span className="text-sm text-muted-foreground">
                  Required Run Rate:{" "}
                </span>
                <span className="text-lg font-semibold">
                  {getRequiredRunRate(
                    (currentInnings.target_score || 0) -
                      (currentInnings.total_runs || 0),
                    OVERS_FOR_FORMAT[match.competition.format || "T20"] -
                      currentInnings.total_overs || 0
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
          <span className="text-muted-foreground font-semibold">Extras {extras.total_count || 0}</span>
          <span className="text-xs text-muted-foreground ml-1 font-semibold">
            {`${extras.nb_count || 0}nb ${extras.wd_count || 0}wd ${extras.b_count || 0}b ${extras.lb_count || 0}lb ${extras.p_count || 0}p`}
          </span>
        </div>
        {/* TODO: Add partnership information for current batsmen  */}
        {/* {match.batsmen && (
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
