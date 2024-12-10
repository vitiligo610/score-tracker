export type Team = {
  id: number;
  name: string;
  logo_url: string;
  founded_year: number;
  description: string;
}

export type Player = {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  batting_style: 'Right-hand' | 'Left-hand';
  bowling_style: 'Right-arm Fast' | 'Left-arm Fast' | 'Right-arm Spin' | 'Left-arm Spin' | 'Right-arm Medium' | 'Left-arm Medium' | 'No';
  player_role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  jersey_number: number;
};