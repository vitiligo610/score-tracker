"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const FilterButton = ({
  value,
  label,
  currentFilter,
  handleClick,
}: {
  value: string;
  label: string;
  currentFilter: string;
  handleClick: () => void;
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn(
        currentFilter === value && "bg-accent"
      )}
    >
      {currentFilter === value && <CheckIcon />}
      {label}
    </Button>
  );
};

const TournamentFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <FilterButton
        value="all"
        label="All"
        currentFilter={currentFilter}
        handleClick={() => setFilter("all")}
      />
      <FilterButton
        value="ongoing"
        label="Ongoing"
        currentFilter={currentFilter}
        handleClick={() => setFilter("ongoing")}
      />
      <FilterButton
        value="finished"
        label="Finished"
        currentFilter={currentFilter}
        handleClick={() => setFilter("finished")}
      />
    </div>
  );
};

export default TournamentFilters;
