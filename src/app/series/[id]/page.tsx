import BilateralSeriesSchedule from "@/components/matches-schedule/bilateral-series-schedule";
import TrilateralSeriesSchedule from "@/components/matches-schedule/trilateral-series-schedule";
import CompetitionSkeleton from "@/components/ui/skeletons/competition-skeleton";
import {
  fetchSeriesById,
  fetchSeriesMatches,
  fetchSeriesNameById,
} from "@/lib/actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({ params }: Props) => {
  const p = await params;
  const series_id = Number(p.id);

  const name = await fetchSeriesNameById(series_id);

  return {
    title: name,
  };
};

const SeriesPage = async ({ params }: Props) => {
  const p = await params;
  const series_id = Number(p.id);
  const { series } = await fetchSeriesById(series_id);
  const { matches } = await fetchSeriesMatches(series_id);
  await fetchSeriesNameById(series_id);

  if (!series) {
    notFound();
  }

  // console.log("series matches is ", matches);

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <span className="text-secondary text-sm tracking-widest uppercase">
            Series
          </span>
          <h1 className="text-4xl font-bold text-primary">{series.name}</h1>
        </div>
        {series.type === "bilateral" ? (
          <BilateralSeriesSchedule series={series} matches={matches} />
        ) : (
          <TrilateralSeriesSchedule series={series} matches={matches} />
        )}
      </div>
    </Suspense>
  );
};

export default SeriesPage;
