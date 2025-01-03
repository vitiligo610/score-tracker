import { Ball, OngoingMatch } from "@/lib/definitions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBattingTeamName, getBowlingTeamName, toOrdinal } from "@/lib/utils";

interface InningsEndDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isMatchEnd: boolean;
  lastBall: Ball | null;
  onNextInnings: () => Promise<void>;
  match: OngoingMatch;
}

const InningsEndDialog = ({
  isOpen,
  onClose,
  lastBall,
  isMatchEnd,
  onNextInnings,
  match,
}: InningsEndDialogProps) => {
  const { innings } = match;
  const currentOvers = `${innings.total_overs}.${
    lastBall ? (lastBall.ball_number || 0) % 6 : 0
  }`;
  const isSecondInnings = innings.number % 2 === 0;
  const target = innings.target_score;

  const battingTeamName = getBattingTeamName(innings, match.team1, match.team2);
  const bowlingTeamName = getBowlingTeamName(innings, match.team1, match.team2);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center space-y-1 mb-2">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase">
              <h2 className="text-primary">{battingTeamName}</h2>
              <span>v</span>
              <h2 className="text-primary">{bowlingTeamName}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {toOrdinal(innings.number)} Innings Complete
            </p>
          </AlertDialogTitle>
          <Card className="border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-around">
                <p className="text-lg text-primary">{battingTeamName}</p>
                <div className="text-center space-y-1">
                  <p className="text-3xl font-bold">
                    {innings.total_runs}
                    {innings.total_wickets < 10 && `/${innings.total_wickets}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentOvers} Overs
                  </p>
                </div>
              </div>

              {!isSecondInnings ? (
                <div className="text-center space-y-1 pt-2">
                  <Separator className="my-2 mb-4" />
                  <p className="text-sm">Target: {innings.total_runs + 1}</p>
                  <p className="text-sm text-muted-foreground">
                    {bowlingTeamName} needs {innings.total_runs + 1} runs to win
                  </p>
                </div>
              ) : (
                isMatchEnd && (
                  <div className="text-center space-y-1 pt-2">
                    <Separator className="my-2 mb-4" />
                    {innings.total_runs >= target! ? (
                      <p className="text-primary">
                        <span className="font-semibold">{battingTeamName}</span>{" "}
                        won by {10 - innings.total_wickets} wickets
                      </p>
                    ) : (
                      <p className="text-primary">
                        {bowlingTeamName} won by{" "}
                        {target! - innings.total_runs - 1} runs
                      </p>
                    )}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </AlertDialogHeader>

        <AlertDialogFooter className="">
          <AlertDialogAction asChild>
            <Button className="w-full" size="lg" onClick={onNextInnings}>
              {isMatchEnd ? "Show Match Summary" : "Start Next Innings"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InningsEndDialog;
