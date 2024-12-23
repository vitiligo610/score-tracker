import { Match } from "@/lib/definitons";
import MatchCard from "@/components/matches/match-card";

interface RoundSectionProps {
  roundNumber: number;
  totalRounds: number;
  matches: Match[];
  tournamentStart: Date;
  tournamentEnd: Date;
  locations: string[];
}

const RoundSection = ({
  roundNumber,
  totalRounds,
  matches,
  tournamentStart,
  tournamentEnd,
  locations,
}: RoundSectionProps) => {
  const getRoundName = (round: number, total: number) => {
    const roundsFromEnd = total - round;
    switch (roundsFromEnd) {
      case 0:
        return "Finals";
      case 1:
        return "Semi Finals";
      case 2:
        return "Quarter Finals";
      default:
        return `Round ${round}`;
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">
        {getRoundName(roundNumber, totalRounds)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.match_id}
            match={match}
            startDate={tournamentStart}
            endDate={tournamentEnd}
            locations={locations}
          />
        ))}
      </div>
    </section>
  );
};

export default RoundSection;
