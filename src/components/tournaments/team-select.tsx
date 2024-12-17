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
import { Team } from "@/lib/definitons";

interface TeamSelectProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const TeamSelect = ({ value, onChange }: TeamSelectProps) => {
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
            : `${value.length} teams selected`}
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
            <CommandGroup className="max-h-[300px] overflow-auto">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : (
                teams.map((team) => (
                  <CommandItem
                    key={team.team_id}
                    onSelect={() => {
                      onChange(
                        value.includes(team.team_id)
                          ? value.filter((id) => id !== team.team_id)
                          : [...value, team.team_id]
                      )
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        {team.name[0]}
                      </div>
                      <span>{team.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value.includes(team.team_id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TeamSelect;