import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OrderListSkeleton = () => {
  return (
    <div className="mt-8 flex-1">
      <Skeleton className="h-8 w-40 mb-4" /> {/* Title */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-5" /> {/* Grip icon */}
              <Skeleton className="h-6 w-8" /> {/* Order number */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" /> {/* Player name */}
                <Skeleton className="h-4 w-72" /> {/* Player details */}
              </div>
              <Skeleton className="h-4 w-16" /> {/* Jersey number */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderListSkeleton;
