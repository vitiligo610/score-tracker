import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { updateTeamBowlers } from "@/lib/actions";
import { PlayerWithTeam } from "@/lib/definitions";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SelectBowlersDialogProps {
  players: PlayerWithTeam[];
  bowlers: string[];
  teamId: string;
}

export function SelectBowlersDialog({
  players,
  bowlers,
  teamId,
}: SelectBowlersDialogProps) {
  const [selectedBowlers, setSelectedBowlers] = useState<string[]>([
    ...bowlers,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (selectedBowlers.length !== 5) {
      toast({
        title: "Error",
        description: "Please select exactly 5 bowlers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateTeamBowlers(teamId, selectedBowlers);
      toast({
        description: "Team bowlers updated successfully",
      });
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    setIsLoading(false);
  };

  const toggleBowler = (playerId: string) => {
    setSelectedBowlers((current) => {
      if (current.includes(playerId)) {
        return current.filter((id) => id !== playerId);
      }
      if (current.length >= 5) return current;
      return [...current, playerId];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Select Bowlers</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Select Team Bowlers</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select exactly 5 bowlers ({selectedBowlers.length}/5)
          </div>
          <ScrollArea className="h-96">
            <div className="grid gap-3 pr-2">
              {players.map((player) => (
                <Card
                  key={player.player_id}
                  className={`p-3 ${
                    selectedBowlers.length >= 5 &&
                    !selectedBowlers.includes(player.player_id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedBowlers.includes(player.player_id)}
                      onCheckedChange={() => toggleBowler(player.player_id)}
                      disabled={
                        selectedBowlers.length >= 5 &&
                        !selectedBowlers.includes(player.player_id)
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {player.first_name} {player.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {player.player_role} -{" "}
                        {player.bowling_style || "Bowling style not set"}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3">
            <DialogClose>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              disabled={selectedBowlers.length !== 5 || isLoading}
            >
              {isLoading && <Loader className="animate-spin" />}
              Save Bowlers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
