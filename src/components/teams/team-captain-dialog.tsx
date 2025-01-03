"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlayerWithTeam } from "@/lib/definitions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateTeamCaptain } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface TeamCaptainDialogProps {
  players: PlayerWithTeam[];
  teamId: number;
  captainId?: number;
}

const TeamCaptainDialog = ({
  players,
  teamId,
  captainId,
}: TeamCaptainDialogProps) => {
  const [open, setOpen] = useState(false);
  const [captain, setCaptain] = useState(captainId || undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async () => {
    if (!captain) return;
    try {
      setIsSubmitting(true);
      await updateTeamCaptain(teamId, captain);
      toast({
        description: "Updated team captain successfully!",
      });
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">Select Team Captain</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Team Captain</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Team Captain:</label>
          <Select
            value={String(captain)}
            onValueChange={(value) => setCaptain(Number(value))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select captain" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem
                  key={player.player_id}
                  value={String(player.player_id)}
                >
                  {player.first_name} {player.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleClick} disabled={isSubmitting || !captain}>
            {isSubmitting && <Loader className="animate-spin" />} Set Captain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TeamCaptainDialog;
