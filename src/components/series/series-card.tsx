import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Series } from "@/lib/definitions";
import { format } from "date-fns";
import { CalendarIcon, Crosshair, MapPinIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  return (
    <Link href={`/src/app/(protected)/series/${series.series_id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[280px] flex flex-col">
        <div className="relative z-10 h-full flex flex-col space-y-1">
          <CardHeader className="space-y-2 pb-4 flex-shrink-0">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      series.type === "bilateral" ? "default" : "secondary"
                    }
                    className="uppercase text-xs tracking-wider"
                  >
                    {series.type}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold tracking-tight line-clamp-2">
                  {series.name}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="bg-primary/5 flex items-center gap-1 flex-shrink-0"
              >
                <Crosshair className="h-3 w-3" />
                {series.format}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 flex-grow">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 flex-shrink-0 text-primary text-sm" />
              <span className="truncate">
                {format(new Date(series.start_date), "MMM d, yyyy")} -{" "}
                {format(new Date(series.end_date), "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2 min-h-[2.5rem]">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex flex-wrap gap-2">
                {series.locations.map((location) => (
                  <Badge
                    key={location}
                    variant="outline"
                    className="bg-background truncate"
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 flex-shrink-0 text-primary" />
              <span>{series.type === "bilateral" ? 2 : 3} Teams</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default SeriesCard;
