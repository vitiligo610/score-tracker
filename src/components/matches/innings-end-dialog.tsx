import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface InningsEndDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isMatchEnd: boolean;
  inningsScore: number;
  inningsWickets: number;
  inningsOvers: number;
  onNextInnings: () => Promise<void>;
}

const InningsEndDialog = ({
  isOpen,
  onClose,
  isMatchEnd,
  inningsScore,
  inningsWickets,
  inningsOvers,
  onNextInnings,
}: InningsEndDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isMatchEnd ? "Match Completed" : "Innings Completed"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Final Score: {inningsScore}/{inningsWickets} ({inningsOvers} overs)
            </p>
            {isMatchEnd ? (
              <p className="font-medium text-primary">
                Match has ended. View scorecard for details.
              </p>
            ) : (
              <p>Ready to start second innings?</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!isMatchEnd && (
            <AlertDialogAction asChild>
              <Button onClick={onNextInnings}>Start Next Innings</Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InningsEndDialog;