import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tournament, Series, Match, Extras, ExtrasCount, Ball, OngoingInnings, Team } from "@/lib/definitons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createPageUrl = (path: string, pageNum: number) => {
  const params = new URLSearchParams();
  params.set("page", pageNum.toString());
  return `/${path}?${params.toString()}`;
};

export const getInitials = (str: string) => {
  var names = str.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const toOrdinal = (number: number) => {
  switch (number) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${number}th`;
  }
}

export const getTransformedMatch = (match: any) => {
  const cleanedMatch = Object.fromEntries(
    Object.entries(match).filter(
      ([key]) =>
        !key.startsWith("team1_") &&
        !key.startsWith("team2_")
    )
  );

  return {
    ...cleanedMatch,
    team1: match.team1_team_id
      ? {
          team_id: match.team1_team_id,
          name: match.team1_name,
          logo_url: match.team1_logo_url,
          founded_year: match.team1_founded_year,
          description: match.team1_description,
        }
      : null,
    team2: match.team2_team_id
      ? {
          team_id: match.team2_team_id,
          name: match.team2_name,
          logo_url: match.team2_logo_url,
          founded_year: match.team2_founded_year,
          description: match.team2_description,
        }
      : null,
  };
};

export const getMatchDetails = (match: any, extrasCount?: ExtrasCount, balls?: Ball[]): any => {
  const transformedMatch = getTransformedMatch(match);
  return {
    ...transformedMatch,
    competition: {
      name: match.tournament_name || match.series_name,
      format: match.tournament_format || match.series_format,
      total_rounds: match.tournament_rounds || match.series_rounds,
      type: match.series_type || null,
    },
    innings: {
      inning_id: match.inning_id,
      team_id: match.batting_team_id,
      number: match.inning_number,
      total_runs: match.total_runs,
      total_wickets: match.total_wickets,
      total_overs: match.total_overs,
      target_score: match.target_score,
      extras: extrasCount,
    },
    over: {
      inning_id: match.inning_id,
      over_number: match.over_number,
      bowler_id: match.bowler_id,
      total_runs: match.over_total_runs,
      total_wickets: match.over_total_wickets,
      balls: balls ? balls : [],
    }
  }
}

// Calculate the number of matches expected for a specific round
export const getExpectedMatchesForRound = (
  totalTeams: number,
  round: number
): number => {
  const matchesInFirstRound = Math.ceil(totalTeams / 2);
  return Math.ceil(matchesInFirstRound / Math.pow(2, round - 1));
};

// Generate placeholder matches for rounds missing some matches
export const generatePlaceholderMatches = (
  round: number,
  competition: Tournament | Series,
  existingMatches: Match[]
): Match[] => {
  const expectedCount =
    "tournament_id" in competition
      ? getExpectedMatchesForRound(competition.total_teams ?? 0, round)
      : 3;

  const missingCount = expectedCount - existingMatches.length;

  if (missingCount <= 0) return [];

  return Array.from({ length: missingCount }, (_, index) => ({
    match_id: `placeholder-${round}-${index}`,
    ...("tournament_id" in competition
      ? { tournament_id: competition.tournament_id }
      : { series_id: competition.series_id }),
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

export const getCurrentRunRate = (runs: number, balls: number) => {
  if (balls === 0) return (0).toFixed(2);
  return ((runs * 6) / balls).toFixed(2);
};

export const getRequiredRunRate = (runsNeeded: number, oversLeft: number) => {
  if (oversLeft === 0) return (0).toFixed(2);
  return (runsNeeded / oversLeft).toFixed(2);
};

export const getStrikeRate = (runsScored: number, ballsFaced: number) => {
  if (ballsFaced == 0) return 0;
  return (runsScored / ballsFaced * 100);
}

export const getEconomyRate = (runsConceded: number, oversBowled: number) => {
  if (oversBowled == 0) return 0;
  return runsConceded / oversBowled;
}

export const getTotalOversOfFormat = (format?: string) => {
  switch (format) {
    case "T20":
      return 20;
    case "ODI":
      return 50;
    default:
      return 0;
  }
}

export const updateBowlerOvers = (oversBowled: number, incrementByOne: boolean) => {
  const currentOverString = oversBowled.toString();
  const [full, partial = '0'] = currentOverString.split('.');
  let newOvers = oversBowled;

  if (incrementByOne) {
    if (partial === '5') {
      newOvers = parseInt(full) + 1;
    } else {
      newOvers = parseFloat((parseInt(full) + parseFloat(`0.${parseInt(partial) + 1}`)).toFixed(1));
    }
  }

  return newOvers;
}

export const formatNumber = (number: any, fractionDigits: number = 1) => {
  return number ? Number(number).toFixed(1) : (0).toFixed(fractionDigits);
}

export const getExtrasDetails = (extras: Extras[]) => {
  const nb = extras.filter(extra => extra.type === "No Ball").length;
  const wd = extras.filter(extra => extra.type === "Wide").length;
  const b = extras.filter(extra => extra.type === "Bye").length;
  const lb = extras.filter(extra => extra.type === "Leg Bye").length;
  const p = extras.filter(extra => extra.type === "Penalty").length;

  return `${nb}nb ${wd}wd ${b}b ${lb}lb ${p}p`;
}

export const getBattingTeamName = (innings: OngoingInnings, team1: Team, team2: Team) => {
  return innings.team_id === team1.team_id
    ? team1.name
    : team2.name;
};

export const getBowlingTeamName = (innings: OngoingInnings, team1: Team, team2: Team) => {
  return innings.team_id !== team1.team_id
    ? team1.name
    : team2.name;
};

export const getBattingTeamId = (innings: OngoingInnings, team1: Team, team2: Team) => {
  return innings.team_id === team1.team_id
  ? team1.team_id
  : team2.team_id;
};

export const getBowlingTeamId = (innings: OngoingInnings, team1: Team, team2: Team) => {
  return innings.team_id !== team1.team_id
    ? team1.team_id
    : team2.team_id;
};