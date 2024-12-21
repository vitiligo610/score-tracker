import CompetitionFilters from "@/components/layout/competition-filters";
import AllSeries from "@/components/series/all-series";
import BackLink from "@/components/ui/back-link";

const Series = async ({
  searchParams,
}: {
  searchParams: { filter?: string };
}) => {
  const params = await searchParams;

  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/" label="Home" />
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Series</h1>
      </div>
      <CompetitionFilters />

      <AllSeries filter={params.filter} />
    </div>
  );
};

export default Series;
