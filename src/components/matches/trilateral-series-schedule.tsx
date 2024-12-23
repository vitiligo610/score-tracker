import { Series, SeriesMatch } from "@/lib/definitons";
import { generatePlaceholderMatches } from "./matches-schedule";
import MatchCard from "./match-card";

interface TrilateralSeriesScheduleProps {
  series: Series;
  matches: SeriesMatch[];
}

const TrilateralSeriesSchedule = ({
  series,
  matches,
}: TrilateralSeriesScheduleProps) => {
  const rounds = matches.reduce((x, y) => {
    (x[y.round] = x[y.round] || []).push(y);
    return x;
  }, {} as Record<number, SeriesMatch>);

  if (!rounds["2"]) {
    // @ts-ignore
    rounds["2"] = generatePlaceholderMatches(2, series, []);
  }

  return (
    <div className="space-y-12">
      {Object.entries(rounds).map(([round, matches]) => (
        <section className="space-y-6" key={round}>
          <h2 className="text-3xl font-bold text-primary">Round {round}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match: any) => (
              <MatchCard
                key={match.match_id}
                match={match}
                startDate={match.start_date}
                endDate={match.end_date}
                locations={series.locations}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TrilateralSeriesSchedule;
