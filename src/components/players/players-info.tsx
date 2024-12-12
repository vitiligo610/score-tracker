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
import { createPageUrl } from "@/lib/utils";
import BottomPagiation from "../layout/bottom-pagination";

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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <PlayerInfo key={player.player_id} player={player} />
        ))}
      </div>

      <BottomPagiation
        path="players"
        perPage={PLAYERS_PER_PAGE}
        page={page}
        count={count}
      />
    </div>
  );
};

export default PlayersInfo;
