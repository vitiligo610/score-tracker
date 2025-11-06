import CompetitionFilters from "@/components/layout/competition-filters";
import AllSeries from "@/components/series/all-series";
import CreateSeriesDialog from "@/components/series/create-series-dialog";
import BackLink from "@/components/ui/back-link";
import AllSeriesSkeleton from "@/components/ui/skeletons/all-series-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

import {getWorkOsUser} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Series",
};

const Series = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) => {
  const params = await searchParams;
  const { id: userId } = await getWorkOsUser();

  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/home" label="Home" />
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Series</h1>
        <CreateSeriesDialog userId={userId} />
      </div>
      <CompetitionFilters />
      <Suspense fallback={<AllSeriesSkeleton />}>
        <AllSeries userId={userId} filter={params.filter} />
      </Suspense>
    </div>
  );
};

export default Series;
