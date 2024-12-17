import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { Tournament } from "@/lib/definitons";
import Link from "next/link";

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const getFormatColors = (format: string) => {
    switch (format) {
      case "League":
        return "from-blue-500 to-purple-500";
      case "Knockout":
        return "from-red-500 to-orange-500";
      default:
        return "from-green-500 to-teal-500";
    }
  };

  const gradientColors = getFormatColors(tournament.format);

  return (
    <Link
      href={`/tournaments/${tournament.tournament_id}`}
      className="block transform hover:scale-[1.01] transition-all duration-200 ease-in-out"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[270px] flex flex-col">
        <div className={`h-2 bg-gradient-to-r ${gradientColors}`} />
        <CardHeader className="space-y-1 flex-shrink-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-2xl font-bold line-clamp-2 min-h-[4rem]">
              {tournament.name}
            </h3>
            <Badge
              variant="secondary"
              className={`uppercase flex-shrink-0 mt-1 text-white bg-gradient-to-r ${gradientColors} hover:opacity-90 transition-opacity`}
            >
              {tournament.format}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 flex-grow">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 flex-shrink-0 text-primary text-sm" />
            <span className="truncate">
              {format(new Date(tournament.start_date), "MMM d, yyyy")} -{" "}
              {format(new Date(tournament.end_date), "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2 min-h-[2.5rem]">
            <MapPinIcon className="h-5 w-5 flex-shrink-0 text-primary" />
            <div className="flex flex-wrap gap-2">
              {tournament.locations.map((location) => (
                <Badge
                  key={location}
                  variant="outline"
                  className="bg-background truncate max-w-[150px]"
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 flex-shrink-0 text-primary" />
            <span>{tournament.team_ids.length} Teams</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TournamentCard;
