import { fetchSeries } from "@/lib/actions";
import SeriesCard from "@/components/series/series-card";

const AllSeries = async ({ userId, filter }: { userId: string, filter?: string }) => {
  const { series } = await fetchSeries(userId, filter || "all");

  // console.log("fetched series: ", series);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((series) => (
        <SeriesCard key={series.series_id} series={series} />
      ))}
    </div>
  );
};

export default AllSeries;
