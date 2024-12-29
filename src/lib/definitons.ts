import { DISMISSAL_TYPES } from "./constants";
import {
  BATTING_STYLES,
  BOWLING_STYLES,
  MATCH_STATUS,
  PLAYER_ROLES,
  MATCH_FORMATS,
  SERIES_TYPES,
  EXTRAS_TYPES,
} from "@/lib/constants";

export type Team = {
  team_id: number;
  name: string;
  logo_url?: string;
  founded_year: number;
  description: string;
  players_count?: number;
  captain_id?: number;
};

export type TeamWithoutId = Omit<Team, "team_id">;

type BattingStyle = (typeof BATTING_STYLES)[number];
type BowlingStyle = (typeof BOWLING_STYLES)[number];
type PlayerRole = (typeof PLAYER_ROLES)[number];

export type Player = {
  player_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  batting_style: BattingStyle;
  bowling_style: BowlingStyle;
  player_role: PlayerRole;
  jersey_number: number;
  batting_order?: number;
  bowling_order?: number;
  dismissed?: boolean;
};

export type PlayerWithoutId = Omit<Player, "player_id">;

export interface PlayerWithTeam extends Player {
  team_id: number;
}

export interface MatchPlayer {
  player_id: number;
  name: string;
}

export interface MatchBatsman extends MatchPlayer {
  batting_style: string;
  batting_order: number;
  runs_scored: number;
  balls_faced: number;
  strike_rate: number;
  fours: number;
  sixes: number;
}

export interface MatchBowler extends MatchPlayer {
  bowling_style: string;
  bowling_order: number;
  runs_conceded: number;
  wickets_taken: number;
  overs_bowled: number;
  economy_rate: number;
}

export interface TeamPlayer {
  team_id: number;
  player_id: number;
  batting_order?: number;
  bowling_order?: number;
}

export type MatchStatus = (typeof MATCH_STATUS)[number];

export type Match = {
  match_id: number | string;
  match_date?: Date;
  team1_id?: number;
  team2_id?: number;
  winner_team_id?: number;
  location?: string;
  round: number;
  status: MatchStatus;
  toss_winner_id?: number;
  toss_decision?: "batting" | "bowling";
  team1: Team | null;
  team2: Team | null;
};

export interface OngoingMatch extends Match {
  team1: Team;
  team2: Team;
  batsmen: MatchBatsman[];
  bowlers: MatchBowler[];
  striker_player_id: number;
  competition: Competition;
  innings: OngoingInnings;
  over: Over;
}

type MatchFormat = (typeof MATCH_FORMATS)[number];

interface Competition {
  name: string;
  start_date: Date;
  end_date: Date;
  format: MatchFormat;
  total_rounds?: number;
  locations: string[] | [];
  team_ids: number[] | [];
  finished?: boolean;
}

export interface Tournament extends Competition {
  tournament_id: number;
  total_teams?: number;
}

export type TournamentWithoutId = Omit<Tournament, "tournament_id">;

export interface TournamentMatch extends Match {
  tournament_id: number;
}

type SeriesType = (typeof SERIES_TYPES)[number];

export interface Series extends Competition {
  series_id: number;
  type: SeriesType;
}

export type SeriesWithoutId = Omit<Series, "series_id">;

export interface SeriesMatch extends Match {
  [x: string]: any;
  series_id: number;
}

export interface Innings {
  inning_id: number;
  match_id: number;
  team_id: number;
  number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  target_score: number;
}

export interface OngoingInnings extends Innings {
  extras: ExtrasCount;
}

export interface Over {
  inning_id: number;
  over_number: number;
  bowler_id: number;
  total_runs: number;
  total_wickets: number;
  balls: Ball[];
}

export interface Ball {
  inning_id: number;
  over_number: number;
  ball_number: number;
  batsman_id: number;
  non_striker_id: number;
  bowler_id: number;
  runs_scored: number;
  is_wicket: boolean;
  is_legal: boolean;
  extra_type?: ExtrasType;
  extra?: Extras;
  dismissal?: Dismissal;
}

export type ExtrasType = (typeof EXTRAS_TYPES)[number];
export type DismissalType = (typeof DISMISSAL_TYPES)[number];

export interface Extras {
  extra_id?: number;
  ball_id?: number;
  type: ExtrasType;
  runs: number;
}

export interface ExtrasCount {
  nb_count: number;
  wd_count: number;
  b_count: number;
  lb_count: number;
  p_count: number;
  total_count: number;
}

export interface Dismissal {
  type: DismissalType | null;
  dismissed_batsman_id: number | null;
  fielder_id: number | null;
}

export interface CurrentBall {
  is_legal: boolean;
  is_wicket: boolean;
  runs_scored: number;
  extra: {
    type: ExtrasType | null;
    runs: number;
  };
  dismissal: Dismissal;
}

export interface MatchResponse {
  match: OngoingMatch;
  battingTeamPlayers: PlayerWithTeam[];
  bowlingTeamPlayers: PlayerWithTeam[];
}

export interface InningsResponse {
  batsmen: MatchBatsman[];
  bowlers: MatchBowler[];
}