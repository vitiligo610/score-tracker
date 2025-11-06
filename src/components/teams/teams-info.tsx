import { fetchTeams } from "@/lib/actions";
import TeamInfo from "@/components/teams/team-info";
import BottomPagiation from "../layout/bottom-pagination";
import { TEAMS_PER_PAGE } from "@/lib/constants";

interface Props {
  userId: string;
  query: string;
  page: number;
}

const TeamsInfo = async ({ userId, query, page }: Props) => {
  const result = await fetchTeams(userId, query, page);

  const { teams, count } = result;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamInfo key={team.team_id} team={team} userId={userId} />
        ))}
      </div>

      <BottomPagiation
        path="teams"
        perPage={TEAMS_PER_PAGE}
        page={page}
        count={count}
      />
    </div>
  );
};

export default TeamsInfo;
