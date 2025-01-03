"use client";

import { useState } from "react";
import { Match } from "@/lib/definitions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { updateMatchToss } from "@/lib/actions";
import { MapPin, Calendar, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface MatchTossProps {
  match: Match;
}

const MatchToss = ({ match }: MatchTossProps) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [tossDecision, setTossDecision] = useState<
    "batting" | "bowling" | null
  >(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedTeam || !tossDecision) return;

    setIsUpdating(true);
    await updateMatchToss(
      match.match_id,
      selectedTeam,
      tossDecision,
      match.team1?.team_id !== selectedTeam
        ? match.team1?.team_id
        : match.team2?.team_id
    );
    setIsUpdating(false);
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Teams Header */}
      <div className="text-center space-y-6">
        <div>
          <span className="text-secondary text-sm tracking-widest uppercase">
            Match Toss
          </span>
          <div className="flex items-center justify-center gap-4 text-3xl md:text-4xl font-bold">
            <span>{match.team1?.name}</span>
            <span className="text-primary">vs</span>
            <span>{match.team2?.name}</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex justify-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {match.match_date
                ? format(new Date(match.match_date), "PPP")
                : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* Toss Selection */}
      <div className="space-y-6">
        <h3 className="text-center text-xl font-semibold">Who won the toss?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[match.team1, match.team2].map((team) => (
            <Card
              key={team?.team_id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:scale-101",
                selectedTeam === team?.team_id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedTeam(team?.team_id || null)}
            >
              <h4 className="text-center text-lg font-medium">{team?.name}</h4>
            </Card>
          ))}
        </div>
      </div>

      {/* Toss Decision */}
      {selectedTeam && (
        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold">
            {match.team1?.team_id === selectedTeam
              ? match.team1?.name
              : match.team2?.name}{" "}
            elected for?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["batting", "bowling"].map((decision) => (
              <Card
                key={decision}
                className={cn(
                  "p-6 cursor-pointer transition-all hover:scale-101",
                  tossDecision === decision && "ring-2 ring-primary"
                )}
                onClick={() =>
                  setTossDecision(decision as "batting" | "bowling")
                }
              >
                <h4 className="text-center text-lg font-medium capitalize">
                  {decision}
                </h4>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          disabled={!selectedTeam || !tossDecision || isUpdating}
          onClick={handleContinue}
        >
          {isUpdating && <Loader className="animate-spin" />} Continue
        </Button>
      </div>
    </div>
  );
};

export default MatchToss;
