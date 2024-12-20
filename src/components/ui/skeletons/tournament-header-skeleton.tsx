import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-[300px]" />
    </div>
  );
}