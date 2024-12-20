import RoundSectionSkeleton from "@/components/ui/skeletons/round-section-skeleton";

export default function MatchScheduleSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <RoundSectionSkeleton key={i} />
      ))}
    </div>
  );
}