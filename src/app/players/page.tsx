import PlayersSkeleton from "@/components/ui/skeletons/players-skeleton";
import { Suspense } from "react";
import PlayersInfo from "@/components/players/players-info";
import SearchInput from "@/components/ui/search-input";
import FilterPlayers from "@/components/players/filter-players";

const Players = async ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: number;
    role?: string[];
    batting?: string[];
    bowling?: string[];
  }
}) => {
  const params = await searchParams;
  const searchQuery = params?.query || "";
  const currentPage = Number(params?.page) || 1;
  const roles = params?.role || [];
  const battingStyles = params?.batting || [];
  const bowlingStyles = params?.bowling || [];

  console.log("roles", roles);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl text-primary font-bold text-center mb-12">Players</h1>
      <div className="flex gap-2">
        <SearchInput placeholder="Search players..." />
        <FilterPlayers />
      </div>
      <Suspense fallback={<PlayersSkeleton />}>
        <PlayersInfo
          query={searchQuery}
          page={currentPage}
          roles={roles}
          battingStyles={battingStyles}
          bowlingStyles={bowlingStyles}
        />
      </Suspense>
    </div>
  )
}
export default Players