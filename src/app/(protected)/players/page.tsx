import PlayerFormDialog from "@/components/players/player-form-dialog";
import FilterPlayers from "@/components/players/filter-players";
import PlayersInfo from "@/components/players/players-info";
import SearchInput from "@/components/ui/search-input";
import PlayersSkeleton from "@/components/ui/skeletons/players-skeleton";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackLink from "@/components/ui/back-link";

const Players = async ({
  searchParams
}: {
  searchParams?: Promise<{
    query?: string;
    page?: number;
    role?: string[];
    batting?: string[];
    bowling?: string[];
  }>
}) => {
  const params = await searchParams;
  const searchQuery = params?.query || "";
  const currentPage = Number(params?.page) || 1;
  const roles = params?.role || [];
  const battingStyles = params?.batting || [];
  const bowlingStyles = params?.bowling || [];

  return (
    <div className="container mx-auto pb-8 space-y-8">
      <BackLink href="/home" label="Home" />
      <div className="w-full flex justify-between items-center mb-12">
        <h1 className="text-7xl text-primary font-bold">Players</h1>
        <PlayerFormDialog>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Player
          </Button>
        </PlayerFormDialog>
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