import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-12 w-[300px]" />
    </div>
  );
}