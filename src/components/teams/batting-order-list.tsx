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
import { updateTeamBattingOrder } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface BattingOrderListProps {
  players: PlayerWithTeam[];
  teamId: string;
  captainId?: string;
}

const BattingOrderList = ({
  players,
  teamId,
  captainId,
}: BattingOrderListProps) => {
  const [sortedPlayers, setSortedPlayers] = useState(
    players.sort((a, b) => (a.batting_order || 0) - (b.batting_order || 0))
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
          batting_order: index + 1,
        }));

        setSortedPlayers(newItems);
        await updateTeamBattingOrder(teamId, updatedOrders);
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
    <div className="mt-8 w-full lg:w-1/2">
      <h2 className="text-2xl font-semibold mb-4">Batting Order</h2>
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
                context="batting"
                isCaptain={player.player_id === captainId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BattingOrderList;
