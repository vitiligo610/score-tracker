import { InningsBowlingStats } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BowlersTableProps {
  stats: InningsBowlingStats;
}

const BowlersTable = ({ stats }: BowlersTableProps) => {
  return (
    <div className="p-4 space-y-4 w-full md:w-1/2">
      <div className="flex items-center justify-between bg-primary text-primary-foreground px-6 py-4">
        <h2 className="text-xl font-bold">{stats.team_name.toUpperCase()}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-primary">BOWLING</TableHead>
            <TableHead className="font-bold">O</TableHead>
            <TableHead className="font-bold">M</TableHead>
            <TableHead className="font-bold">R</TableHead>
            <TableHead className="font-bold">W</TableHead>
            <TableHead className="font-bold">ECO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.players.map((player) => (
            <TableRow key={player.player_id}>
              <TableCell className="font-semibold">
                {player.player_name}
              </TableCell>
              <TableCell className="font-semibold">
                {player.overs_bowled}
              </TableCell>
              <TableCell className="font-semibold">
                {player.maiden_overs}
              </TableCell>
              <TableCell className="font-semibold">
                {player.runs_conceded}
              </TableCell>
              <TableCell className="font-semibold">
                {player.wickets_taken}
              </TableCell>
              <TableCell className="font-semibold">
                {player.economy_rate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BowlersTable;
