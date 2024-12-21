import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users2, Crosshair } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Series } from "@/lib/definitons";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps) => {
  const isActive = new Date() >= new Date(series.start_date) && 
                  new Date() <= new Date(series.end_date);

  return (
    <Link href={`/series/${series.series_id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        "before:absolute before:inset-0 before:-translate-x-full",
        "hover:before:translate-x-0 before:transition-transform before:duration-300",
        "before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:z-0"
      )}>
        <div className="relative z-10">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={series.type === 'bilateral' ? 'default' : 'secondary'}
                    className="uppercase text-xs tracking-wider"
                  >
                    {series.type}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "bg-primary/5",
                      isActive && "bg-green-500/10 text-green-500"
                    )}
                  >
                    {isActive ? "Active" : "Upcoming"}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{series.name}</h3>
              </div>
              <Badge 
                variant="outline" 
                className="bg-primary/5 flex items-center gap-1"
              >
                <Crosshair className="h-3 w-3" />
                {series.format}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Timeline */}
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span>{format(new Date(series.start_date), "MMM d, yyyy")}</span>
                <span className="h-px w-6 bg-muted-foreground/30" />
                <span>{format(new Date(series.end_date), "MMM d, yyyy")}</span>
              </div>
            </div>

            {/* Teams */}
            <div className="flex items-center gap-3 text-sm">
              <Users2 className="h-4 w-4 text-muted-foreground" />
              <span>
                {series.type === 'bilateral' ? '2 Teams' : '3 Teams'}
              </span>
            </div>

            {/* Locations */}
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {series.locations.map((location) => (
                  <Badge 
                    key={location} 
                    variant="secondary"
                    className="bg-muted/  50"
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default SeriesCard;