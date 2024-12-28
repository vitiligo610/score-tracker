export const PLAYERS_PER_PAGE = 6;
export const PLAYER_ROLES = [
  "Batsman",
  "Bowler",
  "All-rounder",
  "Wicket-keeper",
] as const;
export const BATTING_STYLES = ["Right-hand", "Left-hand"] as const;
export const BOWLING_STYLES = [
  "Right-arm Fast",
  "Left-arm Fast",
  "Right-arm Spin",
  "Left-arm Spin",
  "Right-arm Medium",
  "Left-arm Medium",
  "None",
] as const;

export const TEAMS_PER_PAGE = 9;

export const MATCH_FORMATS = ["T20", "ODI", "Test"] as const;

export const MATCH_STATUS = [
  "started",
  "completed",
  "scheduled",
  "tbd",
] as const;

export const SERIES_TYPES = ["bilateral", "trilateral"] as const;

export const SERIES_ROUNDS = [3, 5, 7] as const;

export const EXTRAS_TYPES = [
  "No Ball",
  "Wide",
  "Bye",
  "Leg Bye",
  "Penalty",
] as const;

export const DISMISSAL_TYPES = [
  "Bowled",
  "Caught",
  "LBW",
  "Run Out",
  "Stumped",
  "Hit Wicket",
] as const;

export const OVERS_FOR_FORMAT = {
  T20: 20,
  ODI: 50,
  Test: 100,
};
