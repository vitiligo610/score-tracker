"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { removePlayerFromTeam } from "@/lib/actions";

interface Props {
  player_id: string;
  team_id: string;
}

const RemovePlayerButton = ({ player_id, team_id }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRemove = async () => {
    try {
      await removePlayerFromTeam(team_id, player_id);
      setOpen(false);
      toast({
        description: "Player successfully removed from team.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
      {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild> */}
                <Button size="icon" variant="ghost">
                  <XIcon />
                </Button>
            {/* </TooltipTrigger>
            <TooltipContent>
              <p>Remove player</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Player</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this player from the team? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>
            Remove Player
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemovePlayerButton;
