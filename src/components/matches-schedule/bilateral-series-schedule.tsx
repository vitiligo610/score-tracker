import { Series, SeriesMatch } from "@/lib/definitions";
import MatchCard from "@/components/matches-schedule/match-card";

interface BilateralSeriesScheduleProps {
  series: Series;
  matches: SeriesMatch[];
}

const BilateralSeriesSchedule = ({
  series,
  matches,
}: BilateralSeriesScheduleProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <div className="space-y-3" key={match.match_id}>
          <h2 className="text-2xl font-bold text-primary">
            Match {match.match_number}
          </h2>
          <MatchCard
            key={match.match_id}
            match={match}
            startDate={series.start_date}
            endDate={series.end_date}
            locations={series.locations}
          />
        </div>
      ))}
    </div>
  );
};

export default BilateralSeriesSchedule;
