"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SortablePlayerCard from "@/components/teams/sortable-player-card";
import { PlayerWithTeam } from "@/lib/definitions";
import { updateTeamBowlingOrder } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { SelectBowlersDialog } from "./select-bowlers-dialog";

interface BowlingOrderList {
  players: PlayerWithTeam[];
  bowlers: PlayerWithTeam[];
  teamId: string;
  captainId?: string;
}

const BowlingOrderList = ({
  players,
  bowlers,
  teamId,
  captainId,
}: BowlingOrderList) => {
  const [sortedPlayers, setSortedPlayers] = useState(
    bowlers.sort((a, b) => (a.bowling_order || 0) - (b.bowling_order || 0))
  );
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      try {
        const oldIndex = sortedPlayers.findIndex(
          (item) => item.player_id === active.id
        );
        const newIndex = sortedPlayers.findIndex(
          (item) => item.player_id === over.id
        );

        const newItems = arrayMove(sortedPlayers, oldIndex, newIndex);

        const updatedOrders = newItems.map((player, index) => ({
          player_id: player.player_id,
          bowling_order: index + 1,
        }));

        setSortedPlayers(newItems);
        await updateTeamBowlingOrder(teamId, updatedOrders);
      } catch (error: any) {
        setSortedPlayers([...sortedPlayers]);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="mt-8 flex-1">
      <div className="flex items-start justify-start">
        <h2 className="text-2xl font-semibold mb-4">Bowling Order</h2>
        <SelectBowlersDialog
          players={players}
          bowlers={bowlers.map((bowler) => bowler.player_id)}
          teamId={teamId}
        />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedPlayers.map((p) => p.player_id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <SortablePlayerCard
                key={player.player_id}
                player={player}
                order={index + 1}
                context="bowling"
                isCaptain={player.player_id === captainId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BowlingOrderList;
