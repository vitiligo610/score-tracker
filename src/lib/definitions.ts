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

export interface PageIdProps {
  params: Promise<{
    id: string;
  }>
};

export type Team = {
  user_id: string;
  team_id: string;
  name: string;
  logo_url?: string;
  founded_year: number;
  description: string;
  players_count?: number;
  captain_id?: string;
};

export type TeamWithoutId = Omit<Team, "user_id" | "team_id">;

type BattingStyle = (typeof BATTING_STYLES)[number];
type BowlingStyle = (typeof BOWLING_STYLES)[number];
type PlayerRole = (typeof PLAYER_ROLES)[number];

export type Player = {
  user_id: string
  player_id: string;
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

export type PlayerWithoutId = Omit<Player, "user_id" | "player_id">;

export interface PlayerWithTeam extends Player {
  team_id: string;
}

export interface MatchPlayer {
  player_id: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

export interface MatchBatsman extends MatchPlayer {
  batting_style: string;
  batting_order: number;
  runs_scored: number;
  balls_faced: number;
  strike_rate: number;
  fours: number;
  sixes: number;
  dismissal_id?: string | null;
}

export interface MatchBowler extends MatchPlayer {
  bowling_style: string;
  bowling_order: number;
  runs_conceded: number;
  wickets_taken: number;
  overs_bowled: number;
  economy_rate: number;
  maiden_overs: number;
  dots: number;
}

export interface TeamPlayer {
  team_id: string;
  player_id: string;
  batting_order?: number;
  bowling_order?: number;
}

export type MatchStatus = (typeof MATCH_STATUS)[number];

export type Match = {
  tournament_name?: any;
  series_name?: any;
  match_id: number | string;
  match_date?: Date;
  team1_id?: string;
  team2_id?: string;
  winner_team_id?: string;
  location?: string;
  round: number;
  status: MatchStatus;
  toss_winner_id?: string;
  toss_decision?: "batting" | "bowling";
  team1: Team | null;
  team2: Team | null;
  competition?: Competition;
};

export interface OngoingMatch extends Match {
  team1: Team;
  team2: Team;
  batsmen: MatchBatsman[];
  bowlers: BowlingTeamPlayer[];
  striker_player_id: string;
  competition: Competition;
  innings: OngoingInnings;
  over: Over;
}

type MatchFormat = (typeof MATCH_FORMATS)[number];

interface Competition {
  user_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  format: MatchFormat;
  total_rounds?: number;
  locations: string[] | [];
  team_ids: string[] | [];
  finished?: boolean;
}

export interface Tournament extends Competition {
  tournament_id: string;
  total_teams?: number;
}

export type TournamentWithoutId = Omit<Tournament, "user_id" | "tournament_id">;

export interface TournamentMatch extends Match {
  tournament_id: string;
}

type SeriesType = (typeof SERIES_TYPES)[number];

export interface Series extends Competition {
  series_id: string;
  type: SeriesType;
}

export type SeriesWithoutId = Omit<Series, "user_id" | "series_id">;

export interface SeriesMatch extends Match {
  [x: string]: any;
  series_id: string;
  match_number: number;
}

export interface SeriesPoints {
  series_id: string;
  team_id: string;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  net_run_rate: number;
}

export interface Innings {
  inning_id: string;
  match_id: string;
  team_id: string;
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
  inning_id: string;
  over_number: number;
  bowler_id: string;
  bowler_name?: string;
  total_runs: number;
  total_wickets: number;
  balls: Ball[];
}

export interface Ball {
  inning_id: string;
  over_number: number;
  ball_number: number;
  batsman_id: string;
  non_striker_id: string;
  bowler_id: string;
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
  extra_id?: string;
  ball_id?: string;
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

export interface InningsExtras extends ExtrasCount {
  inning_id: string;
}

export interface Dismissal {
  type: DismissalType | null;
  dismissed_batsman_id: string | null;
  fielder_id: string | null;
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

export type BattingTeamPlayer = PlayerWithTeam & MatchBatsman;
export type BowlingTeamPlayer = PlayerWithTeam & MatchBowler;

export interface MatchResponse {
  match: OngoingMatch;
  battingTeamPlayers: BattingTeamPlayer[];
  bowlingTeamPlayers: BowlingTeamPlayer[];
}

export interface InningsResponse {
  batsmen: MatchBatsman[];
  bowlers: BowlingTeamPlayer[];
}

export interface BatsmanStats {
  player_id: string;
  player_name: string;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  dismissed: boolean;
  dismissal_type: DismissalType;
  dismissed_by: string;
  fielder_name: string;
  batting_order: number;
}

export interface InningsBattingStats {
  match_id: string;
  inning_id: string;
  number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  target_score: number;
  team_id: string;
  team_name: string;
  players: BatsmanStats[];
  onCrease: string[];
  extras: InningsExtras;
}

export interface InningsBattingSummary {
  [inning_number: number | string]: InningsBattingStats;
}

export interface BowlerStats {
  player_id: string;
  player_name: string;
  overs_bowled: number;
  maiden_overs: number; 
  runs_conceded: number;
  wickets_taken: number;
  economy_rate: number;
}

export interface InningsBowlingStats {
  match_id: string;
  inning_id: string;
  number: number;
  team_id: string;
  team_name: string;
  players: BowlerStats[];
}

export interface InningsBowlingSummary {
  [inning_number: number | string]: InningsBowlingStats;
}

export interface DismissedPlayerStats {
  player_id: string;
  player_name: string;
  runs_scored: number;
  wicket_number: number;
  over_number: number;
  ball_number: number
  type: string;
}

export interface InningsDismissalsStats {
  match_id: string;
  inning_id: string;
  number: number;
  team_id: string;
  team_name: string;
  players: DismissedPlayerStats[];
}

export interface InningsDismissalsSummary {
  [inning_number: number | string]: InningsDismissalsStats;
}

export interface InningsOverStats {
  match_id: string;
  inning_id: string;
  number: number;
  overs: Over[];
}

export interface InningsOversSummary {
  [inning_number: number | string]: InningsOverStats;
}

export interface RunsPerOverData {
  over_number: number;
  runs: number;
  wickets: number;
}

export interface DismissalTypeData {
  type: string;
  count: number;
}

export interface ExtrasBreakdownData {
  type: string;
  runs: number;
}

export interface CareerStats {
  batting: {
    matches: number;
    innings: number;
    runs: number;
    balls_faced: number;
    average: number;
    strike_rate: number;
    fifties: number;
    hundreds: number;
    highest_score: number;
    fours: number;
    sixes: number;
    not_outs: number;
  };
  bowling: {
    matches: number;
    innings: number;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    average: number;
    economy: number;
    strike_rate: number;
    best_figures: string;
    five_wickets: number;
  };
}

export interface BattingPerformance {
  match_id: string;
  inning_id: string;
  runs_scored: number;
  balls_faced: number;
  fours: number;
  sixes: number;
  strike_rate: number;
}

export interface BowlingPerformance {
  match_id: string;
  inning_id: string;
  overs_bowled: number;
  maiden_overs: number;
  dots: number;
  runs_conceded: number;
  wickets_taken: number;
  economy_rate: number;
}
