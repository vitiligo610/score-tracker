import { Skeleton } from "@/components/ui/skeleton";
import MatchCardSkeleton from "@/components/ui/skeletons/match-card-skeleton";

export default function RoundSectionSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}