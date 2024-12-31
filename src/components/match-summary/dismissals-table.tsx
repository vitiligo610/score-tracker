import { InningsDismissalsStats } from "@/lib/definitons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DismissalsTableProps {
  stats: InningsDismissalsStats;
  team_name: string;
}

const DismissalsTable = ({ stats, team_name }: DismissalsTableProps) => {
  return (
    <div className="p-4 space-y-4 w-full md:w-1/2">
      <div className="flex items-center justify-between bg-primary text-primary-foreground px-6 py-4">
        <h2 className="text-xl font-bold">{(stats?.team_name || team_name).toUpperCase()}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableHead className="font-bold text-primary" colSpan={2}>FALL OF WICKETS</TableHead>
          <TableHead className="font-bold">Overs</TableHead>
        </TableHeader>
        <TableBody>
          {stats?.players && stats.players.map(player =>
            <TableRow key={player.player_id}>
              <TableCell className="font-semibold text-primary">{player.runs_scored}/{player.wicket_number}</TableCell>
              <TableCell className="font-semibold">{player.player_name.toUpperCase()}</TableCell>
              <TableCell className="font-semibold">{player.over_number}.{player.ball_number}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default DismissalsTable;