import AddTeamPlayer from "@/components/teams/add-team-player";
import BattingOrderList from "@/components/teams/batting-order-list";
import BowlingOrderList from "@/components/teams/bowling-order-list";
import TeamPlayersList from "@/components/teams/team-players-list";
import {
  fetchTeamById,
  fetchTeamNameById,
  fetchTeamPlayers,
} from "@/lib/actions";
import { PageIdProps } from "@/lib/definitions";
import { notFound } from "next/navigation";

import {getWorkOsUser} from "@/lib/auth";

export const generateMetadata = async ({ params }: PageIdProps) => {
  const team_id = (await params).id;

  const name = await fetchTeamNameById(team_id);

  return {
    title: name,
  };
};

const TeamPage = async ({ params }: PageIdProps) => {
  const team_id = (await params).id;
  const { id: userId } = await getWorkOsUser();
  const { team } = await fetchTeamById(userId, team_id);
  const { teamPlayers } = await fetchTeamPlayers(team_id);
  const bowlers = teamPlayers.filter((player) => player.bowling_order);

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
          userId={userId}
          teamId={team_id}
          existingPlayerIds={teamPlayers.map((p) => p.player_id)}
        />
      </div>
      <TeamPlayersList
        players={teamPlayers}
        teamId={team_id}
        captainId={team.captain_id}
      />
      {teamPlayers.length > 0 && (
        <div
          className="flex flex-col md:flex-row gap-8"
          key={`${team_id}-${teamPlayers.length}-${bowlers
            .map((p) => p.player_id)
            .join("")}`}
        >
          <BattingOrderList
            players={teamPlayers}
            teamId={team_id}
            captainId={team.captain_id}
          />
          <BowlingOrderList
            players={teamPlayers}
            bowlers={bowlers}
            teamId={team_id}
            captainId={team.captain_id}
          />
        </div>
      )}
    </div>
  );
};

export default TeamPage;
