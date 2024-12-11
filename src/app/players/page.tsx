import AddPlayerDialog from "@/components/players/add-player-dialog";
import FilterPlayers from "@/components/players/filter-players";
import PlayersInfo from "@/components/players/players-info";
import SearchInput from "@/components/ui/search-input";
import PlayersSkeleton from "@/components/ui/skeletons/players-skeleton";
import { Suspense } from "react";

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
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Players</h1>
        <AddPlayerDialog />
      </div>
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
  );
}

export default Players;