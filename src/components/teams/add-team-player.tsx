"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addPlayersToTeam, fetchAllPlayers } from "@/lib/actions";
import { PlayerWithTeam } from "@/lib/definitions";
import { PLAYER_ROLES } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface AddTeamPlayerProps {
  userId: string;
  teamId: string;
  existingPlayerIds: string[];
}

export default function AddTeamPlayer({
  userId,
  teamId,
  existingPlayerIds,
}: AddTeamPlayerProps) {
  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const { toast } = useToast();
  const router = useRouter();

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const { allPlayers } = await fetchAllPlayers(userId);
      setPlayers(allPlayers);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to load players",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setAdding(true);
      await addPlayersToTeam(teamId, selectedPlayers);
      toast({
        description: "Players added successfully",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add players",
      });
    } finally {
      setAdding(false);
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = `${player.first_name} ${player.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "ALL" || player.player_role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) loadPlayers();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Players
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Players to Team</DialogTitle>
          <DialogDescription>
            Select players to add to your team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {PLAYER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div
                    key={n}
                    className="h-14 bg-muted animate-pulse rounded-md"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => {
                  const isInTeam = existingPlayerIds.includes(player.player_id);
                  const isInOtherTeam =
                    player.team_id !== null && player.team_id !== teamId;

                  return (
                    <div
                      key={player.player_id}
                      className={`flex items-center justify-between p-2 rounded-lg border
                        ${isInOtherTeam ? "bg-muted/20 opacity-75" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          disabled={isInTeam || isInOtherTeam}
                          checked={selectedPlayers.includes(player.player_id)}
                          onCheckedChange={(checked) => {
                            setSelectedPlayers((prev) =>
                              checked
                                ? [...prev, player.player_id]
                                : prev.filter((id) => id !== player.player_id)
                            );
                          }}
                        />
                        <div>
                          <p className="font-medium">
                            {player.first_name} {player.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {player.player_role.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      {isInTeam ? (
                        <Badge variant="secondary">Already in team</Badge>
                      ) : isInOtherTeam ? (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          In another team
                        </Badge>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedPlayers.length === 0 || adding}
            onClick={handleSubmit}
          >
            {adding && <Loader className="animate-spin" />} Add Selected Players
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
