import { InningsDismissalsStats, Over } from "@/lib/definitons";
import { RunsProgressionChart } from "./runs-progression-chart";
import { RunsPerOverChart } from "./runs-per-over-chart";
import { DismissalTypesChart } from "./dismissal-types-chart";

interface InningsChartsProps {
  overs: Over[];
  dismissals: InningsDismissalsStats;
}

const InningsCharts = ({ overs, dismissals }: InningsChartsProps) => {
  const runsPerOverData = overs.map((over) => ({
    over_number: over.over_number,
    runs: over.total_runs,
    wickets: over.total_wickets,
  }));

  console.log("overs and dismissals are: ", overs, dismissals);

  const dismissalTypes = dismissals?.players?.reduce((acc, dismissal) => {
    const type = dismissal.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dismissalTypesData = dismissals ? Object.entries(dismissalTypes).map(([type, count]) => ({
    type,
    count,
  })) : null;

  return (
    <div className="space-y-8 mt-8">
      <div>
        <h1 className="text-2xl text-primary font-bold">Charts</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <RunsProgressionChart data={runsPerOverData} />
        <RunsPerOverChart data={runsPerOverData} />
        {dismissals && dismissalTypesData && <DismissalTypesChart data={dismissalTypesData} />}
      </div>
    </div>
  )
}

export default InningsCharts;