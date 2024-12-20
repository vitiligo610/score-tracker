export const PLAYERS_PER_PAGE = 6;
export const PLAYER_ROLES = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"] as const;
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

export const TOURNAMENT_FORMATS = ["T20", "ODI", "Test"] as const;

export const MATCH_STATUS = ["started", "completed", "scheduled", "tbd"] as const;