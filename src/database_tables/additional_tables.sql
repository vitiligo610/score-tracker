-- User Authentication and Management Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('Admin', 'Coach', 'Scorekeeper', 'Analyst', 'Viewer') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    last_login DATETIME,
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Fitness and Health Tracking
CREATE TABLE PlayerFitness (
    fitness_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT,
    fitness_date DATE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    fitness_score DECIMAL(5,2),
    injury_status ENUM('Fit', 'Minor Injury', 'Major Injury', 'Recovering'),
    last_medical_checkup DATE,
    fitness_notes TEXT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

-- Player Training Performance
CREATE TABLE TrainingPerformance (
    training_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT,
    training_date DATE,
    training_type ENUM('Batting Practice', 'Bowling Practice', 'Fielding', 'Fitness', 'Simulation'),
    duration_minutes INT,
    performance_rating DECIMAL(4,2),
    coach_comments TEXT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

-- Contract Management Table
CREATE TABLE PlayerContracts (
    contract_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT,
    team_id INT,
    contract_start_date DATE,
    contract_end_date DATE,
    contract_type ENUM('Full-Time', 'Part-Time', 'Seasonal', 'Guest'),
    salary DECIMAL(10,2),
    signing_bonus DECIMAL(10,2),
    performance_bonus DECIMAL(10,2),
    contract_status ENUM('Active', 'Expired', 'Terminated', 'Negotiation'),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id)
);

-- Player Achievement and Records Table
CREATE TABLE PlayerAchievements (
    achievement_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT,
    achievement_date DATE,
    achievement_type ENUM('Most Runs', 'Most Wickets', 'Man of the Match', 'Man of the Series', 'Individual Record', 'Team Record'),
    description TEXT,
    tournament_id INT,
    match_id INT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
);

-- Team Performance Milestones
CREATE TABLE TeamMilestones (
    milestone_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT,
    milestone_date DATE,
    milestone_type ENUM('Highest Team Score', 'Lowest Team Score', 'Longest Winning Streak', 'Most Consecutive Wins', 'Unbeaten Streak'),
    description TEXT,
    match_id INT,
    tournament_id INT,
    milestone_value VARCHAR(100),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id)
);

-- Equipment Inventory Management
CREATE TABLE Equipment (
    equipment_id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_name VARCHAR(100),
    equipment_type ENUM('Bat', 'Ball', 'Helmet', 'Gloves', 'Pads', 'Training Equipment'),
    brand VARCHAR(100),
    quantity INT,
    purchase_date DATE,
    condition ENUM('New', 'Good', 'Average', 'Worn Out'),
    last_used_date DATE,
    assigned_to_team_id INT,
    FOREIGN KEY (assigned_to_team_id) REFERENCES Teams(team_id)
);

-- Match Comments and Analysis Table
CREATE TABLE MatchCommentary (
    commentary_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    over_number DECIMAL(5,2),
    ball_number INT,
    commentary_text TEXT,
    commentary_type ENUM('Ball Description', 'Key Moment', 'Expert Analysis', 'Statistical Insight'),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id)
);

-- Umpire and Match Official Table
CREATE TABLE Umpires (
    umpire_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    nationality VARCHAR(100),
    date_of_birth DATE,
    international_experience_years INT,
    umpire_type ENUM('On-Field', 'Third Umpire', 'Match Referee')
);

-- Match Umpire Mapping
CREATE TABLE MatchUmpires (
    match_umpire_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    umpire_id INT,
    umpire_role ENUM('On-Field Umpire 1', 'On-Field Umpire 2', 'Third Umpire', 'Match Referee'),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id),
    FOREIGN KEY (umpire_id) REFERENCES Umpires(umpire_id)
);