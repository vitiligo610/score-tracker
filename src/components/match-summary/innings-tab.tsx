import {
  fetchMatchBattingSummary,
  fetchMatchBowlingSummary,
  fetchMatchDismissalsSummary,
  fetchMatchOversSummary,
} from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toOrdinal } from "@/lib/utils";
import BatsmenTable from "@/components/match-summary/batsmen-table";
import BowlersTable from "@/components/match-summary/bowlers-table";
import DismissalsTable from "@/components/match-summary/dismissals-table";
import InningsCharts from "@/components/match-summary/innings-charts";

interface InningsTabProps {
  match_id: number;
}

const InningsTab = async ({ match_id }: InningsTabProps) => {
  const { battingSummary } = await fetchMatchBattingSummary(match_id);
  const { bowlingSummary } = await fetchMatchBowlingSummary(match_id);
  const { dismissalsSummary } = await fetchMatchDismissalsSummary(match_id);
  const { oversSummary } = await fetchMatchOversSummary(match_id);

  return (
    <Tabs defaultValue="1">
      <TabsList>
        {Object.keys(battingSummary).map((inning_number) => (
          <TabsTrigger key={inning_number} value={inning_number}>
            {toOrdinal(Number(inning_number))} Innings
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.keys(battingSummary).map((inning_number) => (
        <TabsContent key={inning_number} value={inning_number} className="pb-32">
          <BatsmenTable stats={battingSummary[inning_number]} />
          <div className="flex flex-col md:flex-row gap-4">
            <BowlersTable stats={bowlingSummary[inning_number]} />
            <DismissalsTable
              stats={dismissalsSummary[inning_number]}
              team_name={battingSummary[inning_number].team_name}
            />
          </div>
          <InningsCharts
            overs={oversSummary[inning_number].overs}
            dismissals={dismissalsSummary[inning_number]}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default InningsTab;
