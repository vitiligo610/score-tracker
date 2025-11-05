"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllTeams } from "@/lib/actions";
import { Team } from "@/lib/definitions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeamSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxTeams?: number;
}

const TeamSelect = ({ value, onChange, maxTeams }: TeamSelectProps) => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const { allTeams } = await fetchAllTeams();
      setTeams(allTeams);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value.length === 0
            ? "Select teams..."
            : `${value.length}${
                maxTeams ? ` / ${maxTeams}` : ""
              } teams selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList>
            <CommandEmpty>No teams found.</CommandEmpty>
          </CommandList>
          <CommandList>
            <CommandGroup>
              <ScrollArea className="flex max-h-[300px] flex-col overflow-y-auto">
                {loading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ))
                  : teams.map((team) => {
                      const isSelected = value.includes(team.team_id);
                      const isDisabled =
                        (team.players_count || 0) < 11 || // Disable if less than 11 players
                        (maxTeams && value.length >= maxTeams && !isSelected); // Disable if max teams reached

                      if (team.players_count && team.players_count < 11) {
                        console.log("heree ", team.name);
                      }

                      return (
                        <CommandItem
                          key={team.team_id}
                          onSelect={() => {
                            if (isDisabled) return;
                            onChange(
                              isSelected
                                ? value.filter((id) => id !== team.team_id)
                                : [...value, team.team_id]
                            );
                          }}
                          disabled={Boolean(isDisabled)}
                          className={cn(
                            isDisabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-1 flex gap-3">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                {team.name[0]}
                              </div>
                              <span>
                                {team.name}{" "}
                                {(team.players_count || 0) < 11 &&
                                  "- Atleast 11 players required"}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </div>
                        </CommandItem>
                      );
                    })}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeamSelect;
