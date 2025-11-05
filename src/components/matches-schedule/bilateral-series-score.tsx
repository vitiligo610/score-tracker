import { Card, CardContent } from "@/components/ui/card";
import { fetchSeriesScore } from "@/lib/actions";

interface SeriesScoreProps {
  series_id: string;
}

const SeriesScore = async ({
  series_id
}: SeriesScoreProps) => {
  const seriesScore = await fetchSeriesScore(series_id);
  
  return (
    <Card className="max-w-sm mx-auto rounded-lg border border-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{seriesScore[0].team_name}</p>
            <p className="text-2xl text-secondary-foreground">{seriesScore[0].total_wins}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-muted-foreground">-</p>
            <p className="text-2xl text-muted-foreground">vs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{seriesScore[1].team_name}</p>
            <p className="text-2xl text-secondary-foreground">{seriesScore[1].total_wins}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeriesScore;
