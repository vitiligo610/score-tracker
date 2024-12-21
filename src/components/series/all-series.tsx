import { fetchSeries } from "@/lib/actions";

const AllSeries = async ({ filter }: { filter?: string }) => {
  const { series } = await fetchSeries(filter || "all");

  console.log("fetched series: ", series);

  return (
    <div>AllSeries</div>
  )
}

export default AllSeries;