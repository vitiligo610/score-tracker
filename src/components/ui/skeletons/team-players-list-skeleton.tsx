import TeamPlayerCardSkeleton from "@/components/ui/skeletons/team-player-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TeamPlayersListSkeleton = () => {
  return (
    <div className="mt-8 overflow-hidden">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          <Skeleton className="h-6 w-24 mb-2" />
        </h2>
      </div>
      <div className="px-12">
        <Carousel>
          <CarouselContent>
            {Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <TeamPlayerCardSkeleton />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TeamPlayersListSkeleton;
