"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PLAYER_ROLES, BATTING_STYLES, BOWLING_STYLES } from "@/lib/constants";

const FilterPlayers = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Temporary state for filter selections
  const [tempFilters, setTempFilters] = useState({
    roles: searchParams.getAll("role"),
    battingStyles: searchParams.getAll("batting"),
    bowlingStyles: searchParams.getAll("bowling"),
  })

  const [appliedFilters, setAppliedFilters] = useState({
    roles: searchParams.getAll("role"),
    battingStyles: searchParams.getAll("batting"),
    bowlingStyles: searchParams.getAll("bowling"),
  })

  // Count based on applied filters
  const activeFiltersCount = 
    appliedFilters.roles.length + 
    appliedFilters.battingStyles.length + 
    appliedFilters.bowlingStyles.length

  const updateTempFilters = (
    category: "roles" | "battingStyles" | "bowlingStyles",
    value: string,
    checked: boolean
  ) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }))
  }

  const applyFilters = () => {
    setAppliedFilters(tempFilters)
    const params = new URLSearchParams(searchParams)
    params.delete("role")
    params.delete("batting")
    params.delete("bowling")
    params.set("page", "1")

    tempFilters.roles.forEach((role) => params.append("role", role))
    tempFilters.battingStyles.forEach((style) => params.append("batting", style))
    tempFilters.bowlingStyles.forEach((style) => params.append("bowling", style))

    replace(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const emptyFilters = {
      roles: [],
      battingStyles: [],
      bowlingStyles: [],
    }
    setTempFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    
    const params = new URLSearchParams(searchParams)
    params.delete("role")
    params.delete("batting")
    params.delete("bowling")
    params.set("page", "1")
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0">
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Player Roles</h4>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {PLAYER_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={tempFilters.roles.includes(role)}
                    onCheckedChange={(checked) =>
                      updateTempFilters("roles", role, checked as boolean)
                    }
                  />
                  <label htmlFor={role} className="text-sm">
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Batting Style</h4>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {BATTING_STYLES.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={style}
                    checked={tempFilters.battingStyles.includes(style)}
                    onCheckedChange={(checked) =>
                      updateTempFilters(
                        "battingStyles",
                        style,
                        checked as boolean
                      )
                    }
                  />
                  <label htmlFor={style} className="text-sm">
                    {style}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Bowling Style</h4>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {BOWLING_STYLES.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={style}
                    checked={tempFilters.bowlingStyles.includes(style)}
                    onCheckedChange={(checked) =>
                      updateTempFilters(
                        "bowlingStyles",
                        style,
                        checked as boolean
                      )
                    }
                  />
                  <label htmlFor={style} className="text-sm">
                    {style}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={clearFilters}
              disabled={activeFiltersCount === 0}
            >
              Clear All
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPlayers;
