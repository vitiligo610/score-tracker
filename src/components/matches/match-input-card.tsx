"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMatch } from "@/contexts/match-context";
import { cn } from "@/lib/utils";

const MatchInputCard = () => {
  const { matchDetails: match } = useMatch();
  const currentOver = Math.floor(match?.over?.over_number || 0);
  const currentBall = (match?.over?.balls?.length || 0) % 6;

  const [selectedExtra, setSelectedExtra] = useState<string | null>(null);
  const [dismissalType, setDismissalType] = useState<string | null>(null);
  const [isWicket, setIsWicket] = useState(false);

  const handleRunScored = async (runs: number) => {
    if (!match) return;

    const ballData = {
      runs,
      is_extra: Boolean(selectedExtra),
      extra_type: selectedExtra,
      is_wicket: isWicket,
      dismissal_type: dismissalType,
    };

    // TODO: Update backend
    setSelectedExtra(null);
    setIsWicket(false);
    setDismissalType(null);
  };

  return (
    <Card className="p-6 mt-6 bg-card shadow-md rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Over: {currentOver}</h3>
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                i < currentBall && "bg-primary/10 border-primary",
                i === currentBall && "border-primary animate-pulse",
                i > currentBall && "border-muted"
              )}
            >
              {i < currentBall &&
                (match?.over?.balls?.[currentOver * 6 + i]?.runs_scored || "·")}
            </div>
          ))}
        </div>
      </div>

      {/* Score Input */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-2">Select Runs</h4>
        <div className="grid grid-cols-7 gap-2">
          {["·", 1, 2, 3, 4, 5, 6].map((runs, index) => (
            <Button
              key={index}
              variant={runs === 4 || runs === 6 ? "default" : "outline"}
              className={cn(
                "h-12 text-lg font-semibold",
                runs === 0 && "col-span-1"
              )}
              onClick={() => handleRunScored(Number(runs) || 0)}
            >
              {runs}
            </Button>
          ))}
        </div>
      </div>

      {/* Extras and Dismissals */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="w-1/2">
          <h4 className="text-md font-medium mb-2">Extras</h4>
          <div className="flex gap-2 flex-wrap">
            {["wide", "no-ball", "bye", "leg-bye", "penalty"].map((extra) => (
              <Badge
                key={extra}
                variant={selectedExtra === extra ? "default" : "outline"}
                className={cn("cursor-pointer text-sm px-4 py-1")}
                onClick={() =>
                  setSelectedExtra(selectedExtra === extra ? null : extra)
                }
              >
                {extra}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-1/2">
          <h4 className="text-md font-medium mb-2">Dismissals</h4>
          <div className="flex gap-2 flex-wrap">
            {["bowled", "caught", "run-out", "lbw", "stumped"].map(
              (dismissal) => (
                <Badge
                  key={dismissal}
                  variant={dismissalType === dismissal ? "default" : "outline"}
                  className={cn("cursor-pointer text-sm px-4 py-1")}
                  onClick={() =>
                    setDismissalType(
                      dismissalType === dismissal ? null : dismissal
                    )
                  }
                >
                  {dismissal}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>

      {/* Wicket Toggle and Submit */}
      <div className="flex items-center justify-between">
        <Button
          variant={isWicket ? "destructive" : "outline"}
          onClick={() => setIsWicket(!isWicket)}
        >
          {isWicket ? "Cancel Wicket" : "Mark as Wicket"}
        </Button>
        <Button variant="default" onClick={() => handleRunScored(0)}>
          Submit Ball
        </Button>
      </div>
    </Card>
  );
};

export default MatchInputCard;
