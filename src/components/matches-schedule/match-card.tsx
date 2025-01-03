import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Match } from "@/lib/definitions";
import EditMatchDialog from "@/components/matches-schedule/edit-match-dialog";
import MatchStatusBadge from "@/components/matches-schedule/match-status-badge";
import { Activity, CalendarDays, MapPin, PlayIcon } from "lucide-react";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import Link from "next/link";

interface MatchCardProps {
  match: Match;
  startDate: Date;
  endDate: Date;
  locations: string[];
}

const MatchCard = ({
  match,
  startDate,
  endDate,
  locations,
}: MatchCardProps) => {
  const isTBD = !match.team1?.team_id && !match.team2?.team_id;
  const canStart =
    match.status !== "tbd" && match.team1?.team_id && match.team2?.team_id;

  const getButtonLabel = (status: string) => {
    switch (status) {
      case "tbd":
      case "scheduled":
        return "Start Match";
      case "started":
        return "Continue Match";
      default:
        return "Show Match Summary";
    }
  };

  return (
    <Card className="relative hover:shadow-lg transition-all">
      <CardContent className="px-6 py-3">
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-6">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {match.team1 ? getInitials(match.team1.name) : "TBD"}
                </span>
              </div>
              <p className="mt-2 font-semibold line-clamp-1">
                {match.team1?.name || "TBD"}
              </p>
            </div>

            <div className="px-4">
              <span className="text-2xl font-bold text-primary">VS</span>
            </div>

            <div className="flex-1 text-center">
              <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {match.team2 ? getInitials(match.team2.name) : "TBD"}
                </span>
              </div>
              <p className="mt-2 font-semibold line-clamp-1">
                {match.team2?.name || "TBD"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 xl:flex-row justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 min-w-[24px]">
                <CalendarDays className="h-4 w-4" />
              </div>
              <span>
                {match.match_date
                  ? format(new Date(match.match_date), "PP")
                  : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 min-w-[24px]">
                <MapPin className="h-4 w-4" />
              </div>
              <span>{match.location || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 min-w-[24px]">
                <Activity className="h-4 w-4" />
              </div>
              <MatchStatusBadge status={match.status} />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 p-4 flex gap-2">
        <Button className="w-full gap-2" disabled={!canStart}>
          <Link
            href={`/match/${match.match_id}`}
            className="flex gap-2 items-center justify-center"
          >
            <PlayIcon className="h-4 w-4" />
            {getButtonLabel(match.status)}
          </Link>
        </Button>
        <EditMatchDialog
          match={match}
          startDate={startDate}
          endDate={endDate}
          locations={locations}
        >
          <Button variant="secondary" disabled={isTBD}>
            <EditIcon className="h-4 w-4" /> Edit Details
          </Button>
        </EditMatchDialog>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
