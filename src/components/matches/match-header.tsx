"use client";

import { Match } from "@/lib/definitons";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { toOrdinal } from "@/lib/utils";
import { useMatch } from "@/contexts/match-context";

const MatchHeader = () => {
  const { matchDetails: match } = useMatch();
  const currentInningsNumber = match?.innings?.number;
  const firstInningsScore = match?.innings?.target_score;

  console.log("match from context is ", match);

  const getRequiredRuns = () => {
    if (currentInningsNumber !== 2 || !firstInningsScore) return null;
    return firstInningsScore + 1;
  };

  return (
    <div className="w-full bg-card border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col space-y-1">
          {/* Tournament/Series Name */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              {match?.competition?.name || "Regular Match"}
            </h2>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{match?.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {match?.match_date
                    ? format(new Date(match?.match_date), "PPP")
                    : "---"}
                </span>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="flex flex-wrap items-center gap-x-6 text-sm text-muted-foreground">
            <span className="font-medium">
              {match?.competition?.format.toUpperCase()} Match
            </span>

            <Separator orientation="vertical" className="h-4" />

            <span>{toOrdinal(currentInningsNumber || 1)} Innings</span>

            <Separator orientation="vertical" className="h-4" />

            {currentInningsNumber === 1 ? (
              <span>
                Toss:{" "}
                {match?.toss_winner_id === match?.team1?.team_id
                  ? match?.team1?.name
                  : match?.team2?.name}{" "}
                <span className="text-xs capitalize">
                  ({match?.toss_decision})
                </span>
              </span>
            ) : (
              <span className="text-primary font-medium">
                Target: {getRequiredRuns()} runs
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
