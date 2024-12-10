CREATE TABLE Teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL,
    team_logo_url VARCHAR(255),
    country VARCHAR(100),
    founded_year INT,
    team_description TEXT
);

CREATE TABLE Players(
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth Date,
    nationality VARCHAR(100),
    batting_style ENUM ('Right-hand' , 'Left-hand'),
    bowling_style ENUM ('Right-arm Fast' , 'Left-arm Fast' , 'Right-arm Spin', 'Left-arm Spin', 'Right-arm Medium', 'Left-arm Medium' , 'No'),
    player_role ENUM ('Batsman' , 'Bowler' , 'All-rounder', 'Wicket-keeper'),
    jersey_number INT
);

-- Team player mapping which player belong to which team 
CREATE TABLE TeamPlayers (
    team_player_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT,
    player_id INT,
    joined_date DATE,
    left_date DATE,
    is_current_team BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE Tournaments (
    tournament_id INT PRIMARY KEY AUTO_INCREMENT,
    tournament_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    tournament_type ENUM('League', 'Knockout', 'Round-Robin', 'T20', 'ODI', 'Test'),
    host_country VARCHAR(100),
    total_teams INT
);

-- Series Table
CREATE TABLE Series (
    series_id INT PRIMARY KEY AUTO_INCREMENT,
    series_name VARCHAR(100) NOT NULL,
    home_team_id INT,
    away_team_id INT,
    start_date DATE,
    end_date DATE,
    series_format ENUM('T20', 'ODI', 'Test'),
    total_matches INT,
    FOREIGN KEY (home_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES Teams(team_id)
);

-- Venues Table
CREATE TABLE Venues (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    capacity INT,
    pitch_type ENUM('Batting', 'Bowling', 'Balanced')
);

-- Matches Table
CREATE TABLE Matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    tournament_id INT,
    series_id INT,
    match_date DATE,
    venue_id INT,
    team1_id INT,
    team2_id INT,
    toss_winner_id INT,
    toss_decision ENUM('Bat', 'Bowl'),
    match_winner_id INT,
    match_type ENUM('T20', 'ODI', 'Test'),
    match_result ENUM('Team1 Win', 'Team2 Win', 'Tie', 'Draw', 'No Result'),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id),
    FOREIGN KEY (series_id) REFERENCES Series(series_id),
    FOREIGN KEY (venue_id) REFERENCES Venues(venue_id),
    FOREIGN KEY (team1_id) REFERENCES Teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES Teams(team_id),
    FOREIGN KEY (toss_winner_id) REFERENCES Teams(team_id),
    FOREIGN KEY (match_winner_id) REFERENCES Teams(team_id)
);

-- Innings Table
CREATE TABLE Innings (
    innings_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    batting_team_id INT,
    bowling_team_id INT,
    innings_number INT,
    total_runs INT,
    total_wickets INT,
    total_overs DECIMAL(5,2),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (batting_team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (bowling_team_id) REFERENCES Teams(team_id)
);

-- Batting Performance Table
CREATE TABLE BattingPerformance (
    batting_performance_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    innings_id INT,
    player_id INT,
    runs_scored INT,
    balls_faced INT,
    fours INT,
    sixes INT,
    strike_rate DECIMAL(6,2),
    dismissal_type ENUM('Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Not Out'),
    dismissed_by_player_id INT,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (innings_id) REFERENCES Innings(innings_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (dismissed_by_player_id) REFERENCES Players(player_id)
);

-- Bowling Performance Table
CREATE TABLE BowlingPerformance (
    bowling_performance_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    innings_id INT,
    player_id INT,
    overs_bowled DECIMAL(5,2),
    maiden_overs INT,
    runs_conceded INT,
    wickets_taken INT,
    economy_rate DECIMAL(6,2),
    no_balls INT,
    wides INT,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (innings_id) REFERENCES Innings(innings_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

-- Extras Table
CREATE TABLE Extras (
    extras_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    innings_id INT,
    no_balls INT,
    wides INT,
    byes INT,
    leg_byes INT,
    penalty_runs INT,
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (innings_id) REFERENCES Innings(innings_id)
);