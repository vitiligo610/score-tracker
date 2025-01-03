import { Team } from "@/lib/definitions";

interface SummaryHeaderProps {
  competitionName: string;
  team1: Team;
  team2: Team;
  tossWinnerId: number;
  matchWinnerId: number;
}

const SummaryHeader = ({
  competitionName,
  team1,
  team2,
  tossWinnerId,
  matchWinnerId,
}: SummaryHeaderProps) => {
  const getTeamNameById = (id: number) => {
    return id === team1.team_id ? team1.name : team2.name;
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-primary">{competitionName}</h1>
      <p className="text-lg text-secondary-foreground">
        {team1.name} <span className="text-muted-foreground">vs</span>{" "}
        {team2.name}
      </p>
      {/* <p className="text-sm text-muted-foreground">Toss won by: {getTeamNameById(tossWinnerId)}</p> */}
      <p className="text-lg">
        <span className="text-xl font-bold text-primary">
          {getTeamNameById(matchWinnerId)}
        </span>{" "}
        won the match.
      </p>
    </div>
  );
};

export default SummaryHeader;
