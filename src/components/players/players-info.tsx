import { fetchPlayers } from "@/lib/actions";
import { PlayerInfo } from "@/components/players/player-info";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PLAYERS_PER_PAGE } from "@/lib/constants";

interface Props {
  query: string;
  page: number;
  roles: string[];
  battingStyles: string[];
  bowlingStyles: string[];
}

const PlayersInfo = async ({ query, page, roles, battingStyles, bowlingStyles }: Props) => {
  const result = await fetchPlayers(query, page, roles, battingStyles, bowlingStyles);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch players.");
  }

  const { players, count } = result;

  const totalPages = Math.ceil(count / PLAYERS_PER_PAGE);
  const isFirstPage = page == 1;
  const isLastPage = page == totalPages;

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (query) params.set("s", query);
    params.set("page", pageNum.toString());
    return `/players?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <PlayerInfo key={player.id} player={player} />
        ))}
      </div>

      <Pagination className="justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(page - 1)}
              className={isFirstPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <div className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </div>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(page + 1)}
              className={isLastPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PlayersInfo;
