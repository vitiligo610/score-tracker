import { BATTING_STYLES, BOWLING_STYLES, PLAYER_ROLES } from "@/lib/constants";

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