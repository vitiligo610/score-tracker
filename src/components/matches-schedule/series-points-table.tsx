import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { fetchSeriesPoints } from "@/lib/actions";

interface Props {
  series_id: number;
}

const SeriesPointsTable = async ({ series_id }: Props) => {
  const { seriesPoints } = await fetchSeriesPoints(series_id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">View Points Table</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Points Table</DialogTitle>
          <DialogDescription>Current standings in the series</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className="font-semibold">
              <TableHead>Team</TableHead>
              <TableHead>MP</TableHead>
              <TableHead>W</TableHead>
              <TableHead>L</TableHead>
              <TableHead>T</TableHead>
              <TableHead>Pts</TableHead>
              <TableHead>NRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seriesPoints.map((team) => (
              <TableRow key={team.team_id} className="font-semibold">
                <TableCell className="text-primary font-semibold">{team.team_name}</TableCell>
                <TableCell>{team.matches_played}</TableCell>
                <TableCell>{team.wins}</TableCell>
                <TableCell>{team.losses}</TableCell>
                <TableCell>{team.ties}</TableCell>
                <TableCell>{team.points}</TableCell>
                <TableCell>{team.net_run_rate.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
export default SeriesPointsTable;
