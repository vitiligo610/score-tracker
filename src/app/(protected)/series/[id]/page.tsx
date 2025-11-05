import BilateralSeriesSchedule from "@/components/matches-schedule/bilateral-series-schedule";
import SeriesScore from "@/components/matches-schedule/bilateral-series-score";
import SeriesPointsTable from "@/components/matches-schedule/series-points-table";
import TrilateralSeriesSchedule from "@/components/matches-schedule/trilateral-series-schedule";
import CompetitionSkeleton from "@/components/ui/skeletons/competition-skeleton";
import {
  fetchSeriesById,
  fetchSeriesMatches,
  fetchSeriesNameById,
} from "@/lib/actions";
import { PageIdProps } from "@/lib/definitions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async ({ params }: PageIdProps) => {
  const series_id = (await params).id;

  const name = await fetchSeriesNameById(series_id);

  return {
    title: name,
  };
};

const SeriesPage = async ({ params }: PageIdProps) => {
  const series_id = (await params).id;

  const { series } = await fetchSeriesById(series_id);
  const { matches } = await fetchSeriesMatches(series_id);

  if (!series) {
    notFound();
  }

  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-secondary text-sm tracking-widest uppercase">
              Series
            </span>
            <h1 className="text-4xl font-bold text-primary">{series.name}</h1>
          </div>
          {series.type === "bilateral" ? (
            <div>
              <SeriesScore series_id={series_id} />
            </div>
          ) : (
            <SeriesPointsTable series_id={series_id} />
          )}
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
