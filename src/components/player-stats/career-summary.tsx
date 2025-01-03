import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerStats } from "@/lib/definitions";

interface CareerSummaryProps {
  stats: CareerStats;
}

export function CareerSummary({ stats }: CareerSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Batting Career</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <StatItem label="Matches" value={stats.batting.matches} />
            <StatItem label="Innings" value={stats.batting.innings} />
            <StatItem label="Runs" value={stats.batting.runs} />
            <StatItem
              label="Average"
              value={stats.batting.average.toFixed(2)}
            />
            <StatItem
              label="Strike Rate"
              value={stats.batting.strike_rate.toFixed(2)}
            />
            <StatItem
              label="Highest Score"
              value={stats.batting.highest_score}
            />
            <StatItem label="100s" value={stats.batting.hundreds} />
            <StatItem label="50s" value={stats.batting.fifties} />
            <StatItem label="4s" value={stats.batting.fours} />
            <StatItem label="6s" value={stats.batting.sixes} />
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bowling Career</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <StatItem label="Matches" value={stats.bowling.matches} />
            <StatItem label="Innings" value={stats.bowling.innings} />
            <StatItem label="Overs" value={stats.bowling.overs} />
            <StatItem label="Wickets" value={stats.bowling.wickets} />
            <StatItem
              label="Average"
              value={stats.bowling.average.toFixed(2)}
            />
            <StatItem
              label="Economy"
              value={stats.bowling.economy.toFixed(2)}
            />
            <StatItem
              label="Strike Rate"
              value={stats.bowling.strike_rate.toFixed(2)}
            />
            <StatItem label="Best Figures" value={stats.bowling.best_figures} />
            <StatItem label="5 Wickets" value={stats.bowling.five_wickets} />
            <StatItem label="Maidens" value={stats.bowling.maidens} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}
