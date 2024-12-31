import { InningsBattingStats } from "@/lib/definitons";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, getRunRateByOver } from "@/lib/utils";

interface BatsmenTableProps {
  stats: InningsBattingStats;
}

const BatsmenTable = ({ stats }: BatsmenTableProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between bg-primary text-primary-foreground px-6 py-4">
        <h2 className="text-xl font-bold">{stats.team_name.toUpperCase()}</h2>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold">
            {stats.total_runs}/{stats.total_wickets} ({stats.total_overs} overs)
          </span>
          <span className="text-sm font-semibold">
            CRR: {getRunRateByOver(stats.total_runs, stats.total_overs)} rpo
          </span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-primary">BATTING</TableHead>
            <TableHead className="font-bold">R</TableHead>
            <TableHead className="font-bold">B</TableHead>
            <TableHead className="font-bold">4s</TableHead>
            <TableHead className="font-bold">6s</TableHead>
            <TableHead className="font-bold">S/R</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.players.map((player) => (
            <TableRow key={player.player_id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{player.player_name}</p>
                  {player.dismissed ? (
                    <p className="text-xs font-light text-muted-foreground">
                      {player.dismissal_type}{" "}
                      {player.fielder_name && `c. ${player.fielder_name}`} b.{" "}
                      {player.dismissed_by}
                    </p>
                  ) : (
                    stats.onCrease.includes(player.player_id) && (
                      <p className="text-xs font-light text-muted-foreground">Not Out</p>
                    )
                  )}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {!player.dismissed && !stats.onCrease.includes(player.player_id)
                  ? "-"
                  : player.runs_scored}
              </TableCell>
              <TableCell className="font-semibold">
                {!player.dismissed && !stats.onCrease.includes(player.player_id)
                  ? "-"
                  : player.balls_faced}
              </TableCell>
              <TableCell className="font-semibold">
                {!player.dismissed && !stats.onCrease.includes(player.player_id)
                  ? "-"
                  : player.fours}
              </TableCell>
              <TableCell className="font-semibold">
                {!player.dismissed && !stats.onCrease.includes(player.player_id)
                  ? "-"
                  : player.sixes}
              </TableCell>
              <TableCell className="font-semibold">
                {!player.dismissed && !stats.onCrease.includes(player.player_id)
                  ? "-"
                  : formatNumber(player.strike_rate, 2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="text-xs text-muted-foreground">
            <TableCell colSpan={5} className="p-4">
              <span className="text-primary text-sm mr-4 font-semibold">Extras</span> {`${stats.extras?.nb_count || 0}nb ${stats.extras?.wd_count || 0}wd ${stats.extras?.b_count || 0}b ${stats.extras?.lb_count || 0}lb ${stats.extras?.p_count || 0}p`}
            </TableCell>
            <TableCell className="text-right text-sm font-bold pr-4 text-primary">
              {stats.extras?.total_count || 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default BatsmenTable;
