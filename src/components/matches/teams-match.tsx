import { Match } from "@/lib/definitons";
import MatchHeader from "./match-header";

interface TeamsMatchProps {
  match: Match;
}

const TeamsMatch = ({ match }: TeamsMatchProps) => {
  return (
    <div className="flex flex-col">
      <MatchHeader match={match} />
    </div>
  )
}

export default TeamsMatch;