import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tournament, Series, Match } from "@/lib/definitons";

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
