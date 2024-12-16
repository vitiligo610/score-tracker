"use client";

import { XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { removePlayerFromTeam } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  player_id: number;
  team_id: number;
}

const RemovePlayerButton = ({ player_id, team_id }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async () => {
    try {
      await removePlayerFromTeam(team_id, player_id);
      router.refresh();
      toast({
        description: "Player successfully removed from team.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <XIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove player</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Player</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this player from the team? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await handleClick();
              setOpen(false);
            }}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemovePlayerButton;
