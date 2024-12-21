import SeriesCardSkeleton from "@/components/ui/skeletons/series-card-skeleton";

const AllSeriesSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <SeriesCardSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}

export default AllSeriesSkeleton;