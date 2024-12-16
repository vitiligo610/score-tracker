import TeamPlayersList from "@/components/teams/team-players-list";
import { fetchTeamById, fetchTeamPlayers } from "@/lib/actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Team",
};

const TeamPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const p = await params;
  const { id } = p;
  const team_id = Number(id);
  const { team } = await fetchTeamById(team_id);
  const { teamPlayers } = await fetchTeamPlayers(team_id);

  if (!team) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div>
        <span className="text-secondary text-sm tracking-widest uppercase">
          Team
        </span>
        <h1 className="text-4xl font-bold text-primary">{team.name}</h1>
      </div>
      <TeamPlayersList
        players={teamPlayers}
      />
    </div>
  );
};

export default TeamPage;
