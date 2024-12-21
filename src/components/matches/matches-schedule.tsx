import { Match, Tournament } from "@/lib/definitons";
import RoundSection from "@/components/matches/round-section";

interface MatchesScheduleProps {
  tournament: Tournament;
  matches: Match[];
}

// Calculate the number of matches expected for a specific round
const getExpectedMatchesForRound = (
  totalTeams: number,
  round: number
): number => {
  const matchesInFirstRound = Math.ceil(totalTeams / 2);
  return Math.ceil(matchesInFirstRound / Math.pow(2, round - 1));
};

// Generate placeholder matches for rounds missing some matches
const generatePlaceholderMatches = (
  round: number,
  tournament: Tournament,
  existingMatches: Match[]
): Match[] => {
  const expectedCount = getExpectedMatchesForRound(
    tournament.total_teams ?? 0,
    round
  );
  const missingCount = expectedCount - existingMatches.length;

  if (missingCount <= 0) return []; // No placeholders if the round is fully defined

  return Array.from({ length: missingCount }, (_, index) => ({
    match_id: `placeholder-${round}-${index}`,
    tournament_id: tournament.tournament_id,
    round: round,
    status: "tbd" as const,
    team1_id: undefined,
    team2_id: undefined,
    match_date: undefined,
    location: undefined,
    team1: null,
    team2: null,
  }));
};

const MatchesSchedule = ({ tournament, matches }: MatchesScheduleProps) => {
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const roundsWithPlaceholders = Array.from(
    { length: tournament.total_rounds ?? 0 },
    (_, index) => {
      const round = index + 1;
      const existingMatches = matchesByRound[round] || [];

      const isFutureRound =
        existingMatches.every((match) => match.status === "tbd") &&
        existingMatches.length < getExpectedMatchesForRound(
          tournament.total_teams ?? 0,
          round
        );
      const placeholderMatches = isFutureRound
        ? generatePlaceholderMatches(round, tournament, existingMatches)
        : [];

      return {
        round,
        matches: [...existingMatches, ...placeholderMatches],
      };
    }
  );

  return (
    <div className="space-y-12">
      {roundsWithPlaceholders.map(({ round, matches }) => (
        <RoundSection
          key={round}
          roundNumber={round}
          totalRounds={tournament.total_rounds ?? 0}
          matches={matches}
          tournamentStart={new Date(tournament.start_date)}
          tournamentEnd={new Date(tournament.end_date)}
          locations={tournament.locations}
        />
      ))}
    </div>
  );
};

export default MatchesSchedule;
