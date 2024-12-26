"use client"

import { Card } from "@/components/ui/card";
import { useMatch } from "@/contexts/match-context";
import { MatchBatsman } from "@/lib/definitons";
import { cn } from "@/lib/utils";

interface BattingTeamCardProps {
  nextBatsman?: {
    name: string;
  };
}

const BattingTeamCard = ({ nextBatsman }: BattingTeamCardProps) => {
  const { matchDetails: match } = useMatch();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Batting</h3>
      
      <div className="space-y-4">
        {/* Current Batsmen */}
        {match?.batsmen?.map((batsman) => (
          <div
            key={batsman.player_id}
            className={cn(
              "flex items-center justify-between p-2 rounded-md",
              match?.striker_player_id === batsman.player_id && "bg-primary/10"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="relative px-4">
                {match?.striker_player_id === batsman.player_id && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 text-primary">
                    •
                  </span>
                )}
                <span className="font-medium">{batsman.name}</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold">{batsman.runs_scored}</span>
              <span className="text-muted-foreground">
                ({batsman.balls_faced})
              </span>
            </div>
          </div>
        ))}

        {/* Next Batsman */}
        {nextBatsman && (
          <div className="text-sm text-muted-foreground mt-4 pt-2 border-t">
            Up next: {nextBatsman.name}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BattingTeamCard;