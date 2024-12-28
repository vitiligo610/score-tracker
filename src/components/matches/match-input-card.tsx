"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMatch } from "@/contexts/match-context";
import { cn } from "@/lib/utils";
import { Ball, CurrentBall, DismissalType, ExtrasType } from "@/lib/definitons";
import { Check, Loader } from "lucide-react";
import { DISMISSAL_TYPES, EXTRAS_TYPES } from "@/lib/constants";
import PlayerSelect from "@/components/matches/player-select";
import { useToast } from "@/hooks/use-toast";

const DISMISSAL_TYPES_WITH_FIELDER: DismissalType[] = [
  "Caught",
  "Stumped",
  "Run Out",
];

const defaultCurrentBall: CurrentBall = {
  is_legal: true,
  is_wicket: false,
  runs_scored: 0,
  extra: {
    type: null,
    runs: 0,
  },
  dismissal: {
    type: null,
    dismissed_batsman_id: null,
    fielder_id: null,
  },
};

const MatchInputCard = () => {
  const {
    matchDetails: match,
    bowlingTeamPlayers,
    submitBall,
    submitting,
  } = useMatch();
  const [currentBall, setCurrentBall] = useState<CurrentBall>({
    ...defaultCurrentBall,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  if (!match) return null;

  const currentOver = match.over;
  const overBalls = match.over.balls || [];
  const lastBallNumber =
    overBalls.length > 0 ? overBalls[overBalls.length - 1].ball_number : 0;
  const remainingBalls = 6 - lastBallNumber;

  const getBallDisplay = (ball: Ball) => {
    if (!ball) return "";
    if (!ball.is_legal)
      return `${ball?.extra?.runs || 1}${(ball?.extra_type || ball?.extra?.type || "")?.charAt(0).toUpperCase()}`;
    if (ball.is_wicket) return "W";
    if (ball.runs_scored === 0) return "0";
    return ball.runs_scored.toString();
  };

  const getBallStyle = (ball: Ball) => {
    if (!ball) return "border-muted-foreground";
    if (!ball.is_legal) return "border-accent bg-accent text-accent-foreground";
    if (ball.runs_scored === 4)
      return "border-secondary bg-secondary text-secondary-foreground";
    if (ball.runs_scored === 6)
      return "border-primary bg-primary text-primary-foreground";
    if (ball.is_wicket)
      return "border-destructive bg-destructive text-destructive-foreground";
    return "border-primary/5 bg-primary/20";
  };

  const handleSubmit = async () => {
    if (!match) return;

    if (!validateBall()) {
      errors.forEach((error) => {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error,
        });
      });
      return;
    }

    // TODO: Update backend
    await submitBall(currentBall);
    setCurrentBall({
      ...defaultCurrentBall,
    });
  };

  const handleExtraSelect = (extra: ExtrasType) => {
    setCurrentBall((prev) => ({
      ...prev,
      extra: {
        type: currentBall.extra?.type === extra ? null : extra,
        runs: 1,
      },
      is_legal: prev.extra.type === extra,
    }));

    if (extra !== null) {
      setCurrentBall((prev) => ({
        ...prev,
        is_wicket: false,
        dismissal: {
          type: null,
          dismissed_batsman_id: null,
          fielder_id: null,
        },
      }));
    }
  };

  const handleDismissalSelect = (dismissal: DismissalType) => {
    if (currentBall.extra.type) return;
    if (dismissal) {
      setCurrentBall((prev) => ({
        ...prev,
        is_wicket: true,
      }));
    }
    if (currentBall.dismissal?.type === dismissal) {
      setCurrentBall((prev) => ({
        ...prev,
        is_wicket: false,
      }));
    }
    setCurrentBall((prev) => ({
      ...prev,
      dismissal: {
        ...prev.dismissal,
        type: currentBall.dismissal.type === dismissal ? null : dismissal,
        dismissed_batsman_id: match.striker_player_id,
      },
      runs_scored: dismissal !== "Run Out" ? 0 : prev.runs_scored,
    }));
  };

  const handleWicketSelect = () => {
    if (currentBall.is_wicket) {
      setCurrentBall((prev) => ({
        ...prev,
        is_wicket: false,
        dismissal: {
          type: null,
          dismissed_batsman_id: null,
          fielder_id: null,
        },
      }));
      return;
    }
    setCurrentBall((prev) => ({
      ...prev,
      is_wicket: !prev.is_wicket,
      dismissal: {
        ...prev.dismissal,
        type: prev.dismissal.type === null ? "Bowled" : prev.dismissal.type,
        dismissed_batsman_id: match.striker_player_id,
      },
    }));
  };

  const validateBall = (): boolean => {
    const newErrors: string[] = [];

    if (currentBall.is_wicket) {
      if (!currentBall.dismissal.type) {
        newErrors.push("Dismissal type is required for wicket");
      }

      if (
        currentBall.dismissal.type === "Run Out" &&
        !currentBall.dismissal.dismissed_batsman_id
      ) {
        newErrors.push("Please select the dismissed batsman");
      }

      if (
        currentBall.dismissal.type &&
        DISMISSAL_TYPES_WITH_FIELDER.includes(currentBall.dismissal.type) &&
        !currentBall.dismissal.fielder_id
      ) {
        newErrors.push("Fielder is required for selected dismissal type");
      }

      if (
        currentBall.dismissal.type &&
        currentBall.dismissal.type !== "Run Out" &&
        currentBall.runs_scored > 0
      ) {
        newErrors.push(
          "Runs cannot be scored on a wicket ball (except for Run Out)"
        );
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const isSubmitDisabled = (): boolean => {
    if (currentBall.is_wicket) {
      return (
        !currentBall.dismissal.type ||
        (currentBall.dismissal.type === "Run Out" &&
          !currentBall.dismissal.dismissed_batsman_id) ||
        (DISMISSAL_TYPES_WITH_FIELDER.includes(currentBall.dismissal.type) &&
          !currentBall.dismissal.fielder_id)
      );
    }
    return false;
  };

  const renderDismissalControls = () => {
    if (!currentBall.is_wicket) return null;

    const needsFielder =
      currentBall.dismissal.type &&
      DISMISSAL_TYPES_WITH_FIELDER.includes(currentBall.dismissal.type);
    const isRunOut = currentBall.dismissal.type === "Run Out";

    if (!needsFielder && !isRunOut) return null;

    return (
      <div className="space-y-4 mt-4">
        {isRunOut && (
          <div className="flex items-center justify-center gap-4">
            <p className="whitespace-nowrap text-sm w-1/2">
              Select dismissed batsman
            </p>
            <PlayerSelect
              players={match?.batsmen || []}
              placeholder="Select dismissed batsman"
              onChange={(player_id) => {
                setCurrentBall((prev) => ({
                  ...prev,
                  dismissal: {
                    ...prev.dismissal,
                    dismissed_batsman_id: player_id,
                  },
                }));
              }}
              value={currentBall.dismissal.dismissed_batsman_id}
            />
          </div>
        )}

        {needsFielder && (
          <div className="flex items-center justify-center gap-4">
            <p className="whitespace-nowrap text-sm w-1/2">
              Select contributing fielder
            </p>
            <PlayerSelect
              players={
                bowlingTeamPlayers.map((player) => ({
                  name: player.first_name + " " + player.last_name,
                  player_id: player.player_id,
                })) || []
              }
              placeholder="Select fielder"
              onChange={(player_id) => {
                setCurrentBall((prev) => ({
                  ...prev,
                  dismissal: {
                    ...prev.dismissal,
                    fielder_id: player_id,
                  },
                }));
              }}
              value={currentBall.dismissal.fielder_id}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 mt-6 bg-card shadow-md rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Over: {currentOver.over_number}
        </h3>
        {/* Past Balls */}
        <div className="flex gap-3">
          {overBalls.map((ball, i) => (
            <div
              key={i}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center",
                "text-sm font-medium border-2 transition-colors",
                getBallStyle(ball)
              )}
            >
              {getBallDisplay(ball)}
            </div>
          ))}

          {/* Future Balls */}
          {Array.from({ length: remainingBalls }).map((_, i) => (
            <div
              key={`future-${i}`}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center",
                "text-sm font-medium border-2 border-dashed border-muted-foreground",
                i === 0 && "border-solid border-primary animate-pulse"
              )}
            />
          ))}
        </div>
      </div>

      {/* Score Input Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
          <div
            key={runs}
            onClick={() =>
              setCurrentBall((prev) => ({
                ...prev,
                runs_scored: runs,
              }))
            }
            className={cn(
              "relative h-12 rounded-md flex items-center justify-center",
              "cursor-pointer transition-all duration-200",
              "hover:bg-primary/15 active:scale-95",
              "border border-muted",
              currentBall.runs_scored === runs
                ? "border-primary bg-primary/10"
                : "border-muted-foreground",
              runs === 4 &&
                "border-primary/90 hover:border-primary/90 bg-secondary hover:bg-secondary/90",
              runs === 6 &&
                "border-primary hover:border-primary bg-primary hover:bg-primary/90"
            )}
          >
            {currentBall.runs_scored === runs && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <span
              className={cn(
                "text-lg font-semibold",
                runs === 4 && "text-secondary-foreground",
                runs === 6 && "text-primary-foreground"
              )}
            >
              {runs}
            </span>
          </div>
        ))}
      </div>

      {/* Extras and Dismissals */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="w-1/2">
          <h4 className="text-md font-medium mb-2">Extras</h4>
          <div className="flex gap-2 flex-wrap">
            {EXTRAS_TYPES.map((extra) => (
              <Badge
                key={extra}
                variant={
                  currentBall.extra.type === extra ? "default" : "outline"
                }
                className={cn("cursor-pointer text-xs px-4 py-1")}
                onClick={() => handleExtraSelect(extra)}
              >
                {extra}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-1/2">
          <h4 className="text-md font-medium mb-2">Dismissals</h4>
          <div className="flex gap-2 flex-wrap">
            {DISMISSAL_TYPES.map((dismissal) => (
              <Badge
                key={dismissal}
                variant={
                  currentBall.dismissal?.type === dismissal
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "cursor-pointer text-xs px-4 py-1",
                  currentBall.extra.type !== null &&
                    "cursor-not-allowed opacity-55"
                )}
                onClick={() => handleDismissalSelect(dismissal)}
              >
                {dismissal}
              </Badge>
            ))}
          </div>
          {renderDismissalControls()}
        </div>
      </div>

      {/* Wicket Toggle and Submit */}
      <div className="flex items-center justify-between">
        <Button
          variant={currentBall.is_wicket ? "destructive" : "outline"}
          onClick={handleWicketSelect}
          disabled={currentBall.extra.type !== null}
        >
          {currentBall.is_wicket ? "Cancel Wicket" : "Mark as Wicket"}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled() || submitting}
        >
          {submitting && <Loader className="animate-spin" />} Submit Ball
        </Button>
      </div>
    </Card>
  );
};

export default MatchInputCard;
