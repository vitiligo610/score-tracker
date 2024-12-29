"use client";

import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getBattingTeamId, getBowlingTeamId, toOrdinal } from "@/lib/utils";
import { useMatch } from "@/contexts/match-context";
import { OVERS_FOR_FORMAT } from "../../lib/constants";

const MatchHeader = () => {
  const { matchDetails: match } = useMatch();
  if (!match) return null;

  const currentInningsNumber = match.innings.number;
  const targetScore = match.innings.target_score;

  const getRequiredRuns = () => {
    if (currentInningsNumber % 2 !== 0 || !targetScore) return null;
    return targetScore;
  };

  const battingTeamId = getBattingTeamId(match.innings, match.team1, match.team2);
  const bowlingTeamId = getBowlingTeamId(match.innings, match.team1, match.team2);

  const lastBall = match.over.balls.at(-1);

  return (
    <div className="w-full bg-card border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col space-y-1">
          {/* Tournament/Series Name */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              {match.competition.name || "Regular Match"}
            </h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {match.match_date
                    ? format(new Date(match.match_date), "PPP")
                    : "---"}
                </span>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="flex flex-wrap items-center gap-x-6 text-sm text-muted-foreground">
            <span className="font-medium">
              {match.competition.format} Match
            </span>

            <Separator orientation="vertical" className="h-4" />

            <span>{toOrdinal(currentInningsNumber || 1)} Innings</span>

            <Separator orientation="vertical" className="h-4" />

            {currentInningsNumber === 1 ? (
              <span>
                Toss:{" "}
                {match.toss_winner_id === match.team1.team_id
                  ? match.team1.name
                  : match.team2.name}{" "}
                <span className="text-xs capitalize">
                  ({match.toss_decision})
                </span>
              </span>
            ) : (
              <span className="text-primary font-medium">
                Target: {getRequiredRuns() || 0} runs
                {match.competition.format !== "Test" &&
                  OVERS_FOR_FORMAT[match.competition.format] -
                    match.innings.total_overs <=
                    5 && (
                    <span className="ml-2">
                      ({targetScore - match.innings.total_runs} runs needed in{" "}
                      {
                        lastBall
                          ? (OVERS_FOR_FORMAT[match.competition.format] - lastBall.over_number) * 6 + (6 - lastBall.ball_number)
                          : (OVERS_FOR_FORMAT[match.competition.format] - match.innings.total_overs) * 6
                      }
                        {" "} balls)
                    </span>
                  )}
                {match.competition.format === "Test" && match.innings.number !== 1 && (
                  <span className="ml-2 text-muted-foreground text-xs font-normal">
                    {match.innings.target_score ? (
                      match.innings.total_runs >= match.innings.target_score ? (
                        // Current batting team leads
                        match.team1.team_id === battingTeamId ? (
                          `${match.team1.name} leads by ${
                            match.innings.total_runs - match.innings.target_score
                          } runs`
                        ) : (
                          `${match.team2.name} leads by ${
                            match.innings.total_runs - match.innings.target_score
                          } runs`
                        )
                      ) : (
                        // Current bowling team leads
                        match.team1.team_id === bowlingTeamId ? (
                          `${match.team1.name} leads by ${
                            match.innings.target_score - match.innings.total_runs
                          } runs`
                        ) : (
                          `${match.team2.name} leads by ${
                            match.innings.target_score - match.innings.total_runs
                          } runs`
                        )
                      )
                    ) : (
                      "Scores are level."
                    )}
                  </span>
                )}

              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
