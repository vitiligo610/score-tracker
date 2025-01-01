import { PlayerHeader } from "@/components/player-stats/player-header";
import { CareerSummary } from "@/components/player-stats/career-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchPlayerCareerStats, fetchPlayerPerformances } from "@/lib/actions";
import { Metadata } from "next";
import { PerformanceCharts } from "@/components/player-stats/performance-charts";

export const metadata: Metadata = {
  title: "Match",
};

interface Props {
  params: {
    id: number;
  }
};

const PlayerPage = async ({ params }: Props) => {
  const p = await params;
  const player_id = p.id;
  const { player, stats } = await fetchPlayerCareerStats(player_id);
  const { battingPerformances, bowlingPerformances } = await fetchPlayerPerformances(player_id);


  return (
    <div className="container mx-auto py-10">
      <PlayerHeader player={player} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performances</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <CareerSummary stats={stats} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceCharts
            battingPerformances={battingPerformances}
            bowlingPerformances={bowlingPerformances}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PlayerPage;
