import AddTeamPlayer from "@/components/teams/add-team-player";
import BattingOrderList from "@/components/teams/batting-order-list";
import BowlingOrderList from "@/components/teams/bowling-order-list";
import TeamPlayersList from "@/components/teams/team-players-list";
import { fetchTeamById, fetchTeamNameById, fetchTeamPlayers } from "@/lib/actions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  }
};

export const generateMetadata = async ({ params }: Props) => {
  const p = await params;
  const team_id = Number(p.id);

  const name = await fetchTeamNameById(team_id);

  return {
    title: name,
  };
}

const TeamPage = async ({ params }: Props) => {
  const p = await params;
  const { id } = p;
  const team_id = Number(id);
  const { team } = await fetchTeamById(team_id);
  const { teamPlayers } = await fetchTeamPlayers(team_id);

  if (!team) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-3 sm:flex-row justify-between items-start sm:items-center">
        <div>
          <span className="text-secondary text-sm tracking-widest uppercase">
            Team
          </span>
          <h1 className="text-4xl font-bold text-primary">{team.name}</h1>
        </div>
        <AddTeamPlayer
          teamId={team_id}
          existingPlayerIds={teamPlayers.map(p => p.player_id)}
        />
      </div>
      <TeamPlayersList
        players={teamPlayers}
      />
      <div className="flex flex-col md:flex-row gap-8" key={`${team_id}-${teamPlayers.length}`}>
        <BattingOrderList
          players={teamPlayers}
          teamId={team_id}
        />
        <BowlingOrderList
          players={teamPlayers}
          teamId={team_id}
        />
      </div>
    </div>
  );
};

export default TeamPage;
