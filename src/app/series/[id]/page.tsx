import BilateralSeriesSchedule from "@/components/matches/bilateral-series-schedule";
import TrilateralSeriesSchedule from "@/components/matches/trilateral-series-schedule";
import CompetitionSkeleton from "@/components/ui/skeletons/competition-skeleton";
import { fetchSeriesById, fetchSeriesMatches } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tournament",
};

const SeriesPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const p = await params;
  const series_id = Number(p.id);
  const { series } = await fetchSeriesById(series_id);
  const { matches } = await fetchSeriesMatches(series_id);

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
