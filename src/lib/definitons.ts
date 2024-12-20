import { BATTING_STYLES, BOWLING_STYLES, MATCH_STATUS, PLAYER_ROLES, TOURNAMENT_FORMATS } from "@/lib/constants";

export type Team = {
  team_id: number;
  name: string;
  logo_url?: string;
  founded_year: number;
  description: string;
}

export type TeamWithoutId = Omit<Team, "team_id">;

type BattingStyle = typeof BATTING_STYLES[number];
type BowlingStyle = typeof BOWLING_STYLES[number];
type PlayerRole = typeof PLAYER_ROLES[number];

export type Player = {
  player_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  batting_style: BattingStyle;
  bowling_style: BowlingStyle;
  player_role: PlayerRole;
  jersey_number: number;
};

export type PlayerWithoutId = Omit<Player, "player_id">;

export interface PlayerWithTeam extends Player {
  team_id: number;
}

export interface TeamPlayer {
  team_id: number;
  player_id: number;
}

type TournamentFormat = typeof TOURNAMENT_FORMATS[number];

export type Tournament = {
  tournament_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  format: TournamentFormat;
  total_rounds: number;
  total_teams: number;
  locations: string[] | [];
  team_ids: number[] | [];
  finished?: boolean;
}

export type TournamentWithoutId = Omit<Tournament, "tournament_id">;

export type MatchStatus = typeof MATCH_STATUS[number];

export type Match = {
  match_id: number | string;
  match_date?: Date;
  team1_id?: number;
  team2_id?: number;
  winner_team_id?: number;
  location?: string;
  round: number;
  status: MatchStatus;
  team1: Team | null;
  team2: Team | null;
}

export interface TournamentMatch extends Match {
  tournament_id: number;
}

export interface SeriesMatch extends Match {
  series_id: number;
}