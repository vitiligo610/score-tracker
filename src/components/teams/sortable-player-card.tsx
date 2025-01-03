"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { PlayerWithTeam } from "@/lib/definitions";
import { cn } from "@/lib/utils";

interface SortablePlayerCardProps {
  player: PlayerWithTeam;
  isCaptain?: boolean;
  order: number;
  context: "batting" | "bowling";
}

const SortablePlayerCard = ({
  player,
  isCaptain,
  order,
  context,
}: SortablePlayerCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.player_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 select-none",
        isDragging && "opacity-50",
        "hover:bg-accent/50 transition-colors"
      )}
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="w-8 text-center font-mono text-muted-foreground">
          #{order}
        </div>
        <div className="flex-1">
          <div className="font-semibold">
            {player.first_name} {player.last_name} {isCaptain && "(c)"}
          </div>
          <div className="text-sm text-muted-foreground">
            {player.player_role} •{" "}
            {context === "batting"
              ? player.batting_style
              : player.bowling_style}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Jersey #{player.jersey_number}
        </div>
      </div>
    </Card>
  );
};

export default SortablePlayerCard;
