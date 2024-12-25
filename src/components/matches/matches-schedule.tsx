import { Match, Tournament } from "@/lib/definitons";
import { getExpectedMatchesForRound, generatePlaceholderMatches } from "@/lib/utils";
import RoundSection from "@/components/matches/round-section";

interface MatchesScheduleProps {
  tournament: Tournament;
  matches: Match[];
}

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
