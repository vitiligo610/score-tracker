import { updateTournamentNextMatchIds } from "@/lib/actions";
import { pool } from "@/lib/db";
import {
  players,
  series,
  team_players,
  teams,
  tournaments,
} from "@/lib/placeholder-data";

const seedTeams = async () => {
  console.log("Creating teams table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teams (
      team_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      logo_url VARCHAR(255),
      founded_year INT,
      description TEXT,
      captain_id INT
    )
  `);

  console.log("Seeding teams...");
  await Promise.all(
    teams.map((team) =>
      pool.query(
        `INSERT INTO teams (name, logo_url, founded_year, description)
          VALUES (?, ?, ?, ?)`,
        [team.name, team.logo_url, team.founded_year, team.description]
      )
    )
  );
};

const seedPlayers = async () => {
  console.log("Creating players table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      player_id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      date_of_birth DATE,
      batting_style ENUM('Right-hand', 'Left-hand'),
      bowling_style ENUM('Right-arm Fast', 'Left-arm Fast', 'Right-arm Spin', 'Left-arm Spin', 'Right-arm Medium', 'Left-arm Medium', 'None'),
      player_role ENUM('Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'),
      jersey_number INT
    )
  `);

  console.log("Adding FK constraint to teams table for captain_id...");
  await pool.query(
    `ALTER TABLE teams ADD FOREIGN KEY (captain_id) REFERENCES players (player_id) ON DELETE SET NULL`
  );

  console.log("Seeding players...");
  await Promise.all(
    players.map((player) =>
      pool.query(
        `INSERT INTO players (first_name, last_name, date_of_birth, batting_style, bowling_style, player_role, jersey_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          player.first_name,
          player.last_name,
          player.date_of_birth,
          player.batting_style,
          player.bowling_style,
          player.player_role,
          player.jersey_number,
        ]
      )
    )
  );
};

const seedTeamPlayers = async () => {
  console.log("Creating team players table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_players(
      team_id INT,
      player_id INT,
      batting_order INT,
      bowling_order INT,
      FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
      PRIMARY KEY (team_id, player_id)
    )
  `);

  console.log("Seeding team players...");
  await Promise.all(
    team_players.map((team_player) =>
      pool.query(
        `INSERT INTO team_players (team_id, player_id, batting_order, bowling_order)
        VALUES (?, ?, ?, ?)`,
        [
          team_player.team_id,
          team_player.player_id,
          team_player.batting_order,
          team_player.bowling_order ?? null,
        ]
      )
    )
  );

  console.log("Creating teams_players trigger....");
  await createSetBattingOrderTrigger();
};

const createSetBattingOrderTrigger = async () => {
  await pool.query("DROP TRIGGER IF EXISTS SetBattingOrder");
  await pool.query(
    `CREATE TRIGGER SetBattingOrder
    BEFORE INSERT ON team_players
    FOR EACH ROW
    BEGIN
        SET NEW.batting_order = (
            SELECT COALESCE(MAX(batting_order), 0) + 1
            FROM team_players
            WHERE team_id = NEW.team_id
        );
    END`
  );
};

const seedMatches = async () => {
  console.log("Creating matches table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS matches (
      match_id INT PRIMARY KEY AUTO_INCREMENT,
      tournament_id INT,
      series_id INT,
      match_date DATE,
      team1_id INT,
      team2_id INT,
      winner_team_id INT,
      location VARCHAR (100),
      round VARCHAR (50),
      status ENUM('started', 'scheduled', 'completed', 'tbd'),
      toss_winner_id INT,
      toss_decision ENUM('batting', 'bowling'),
      match_number INT DEFAULT 0,
      next_match_id INT,
      FOREIGN KEY (team1_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      FOREIGN KEY (team2_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      FOREIGN KEY (next_match_id) REFERENCES matches (match_id) ON DELETE SET NULL,
      FOREIGN KEY (toss_winner_id) REFERENCES teams (team_id),
      FOREIGN KEY (winner_team_id) REFERENCES teams (team_id)
    )
  `);
};

const seedTournaments = async () => {
  console.log("Creating tournaments table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournaments (
      tournament_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      start_date DATE,
      end_date DATE,
      format ENUM('T20', 'ODI', 'Test'),
      total_rounds INT DEFAULT 0,
      total_teams INT DEFAULT 0,
      finished BOOLEAN DEFAULT FALSE
    )
  `);

  console.log("Creating tournaments_locations table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournament_locations (
      tournament_id INT,
      location_name VARCHAR(100),
      FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE CASCADE,
      PRIMARY KEY (tournament_id, location_name)
    )
  `);

  console.log("Creating tournament_teams table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournament_teams (
      tournament_id INT,
      team_id INT,
      FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      PRIMARY KEY (tournament_id, team_id)
    )
  `);

  console.log("Adding FK constraint to matches table for tournament_id...");
  await pool.query(
    `ALTER TABLE matches ADD FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE CASCADE`
  );

  console.log("Creating tournament procedures...");
  await createSetTournamentDetailsProc();
  await createTournamentScheduleProc();
  await createUpdateNextMatchWinnerProc();

  console.log("Seeding tournaments...");

  for (const tournament of tournaments) {
    await pool.query(
      `INSERT INTO tournaments (name, start_date, end_date, format)
      VALUES (?, ?, ?, ?)`,
      [
        tournament.name,
        tournament.start_date,
        tournament.end_date,
        tournament.format,
      ]
    );

    for (const location of tournament.locations) {
      await pool.query(
        `INSERT INTO tournament_locations (tournament_id, location_name)
        VALUES (?, ?)`,
        [tournament.tournament_id, location]
      );
    }

    for (const team_id of tournament.team_ids) {
      await pool.query(
        `INSERT INTO tournament_teams (tournament_id, team_id)
        VALUES (?, ?)`,
        [tournament.tournament_id, team_id]
      );
    }

    await pool.query("CALL SetTournamentDetails(?)", [
      tournament.tournament_id,
    ]);
    await pool.query("CALL CreateTournamentSchedule(?)", [
      tournament.tournament_id,
    ]);
    await updateTournamentNextMatchIds(tournament.tournament_id);
  }
};

const createSetTournamentDetailsProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS SetTournamentDetails");
  await pool.query(
    `CREATE PROCEDURE SetTournamentDetails(IN p_tournament_id INT)
    BEGIN
        DECLARE teams_count INT;
        DECLARE rounds INT;

        SELECT COUNT(*) INTO teams_count
        FROM tournament_teams t
        WHERE t.tournament_id = p_tournament_id;

        SET rounds = CEIL(LOG2(teams_count));

        UPDATE tournaments t
        SET t.total_rounds = rounds,
            t.total_teams = teams_count
        WHERE t.tournament_id = p_tournament_id;
    END`
  );
};

const createTournamentScheduleProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS CreateTournamentSchedule");
  await pool.query(
    `CREATE PROCEDURE CreateTournamentSchedule(IN p_tournament_id INT)
    BEGIN
        DECLARE total_teams INT;
        DECLARE next_power_of_2 INT;
        DECLARE byes_count INT;
        DECLARE current_round INT;
        DECLARE total_rounds INT;
        DECLARE matches_count INT;
        DECLARE i INT;
        DECLARE match_no INT;
        DECLARE team1_id INT;
        DECLARE team2_id INT;
        DECLARE t_start_date DATE;
        DECLARE location VARCHAR(100);

        -- Temporary table to store teams
        CREATE TEMPORARY TABLE temp_teams
        (
            id      INT AUTO_INCREMENT PRIMARY KEY,
            team_id INT
        );

        -- Fetch all teams for the given tournament
        INSERT INTO temp_teams (team_id)
        SELECT team_id
        FROM tournament_teams
        WHERE tournament_id = p_tournament_id;

        SELECT start_date INTO t_start_date
        FROM tournaments
        WHERE tournament_id = p_tournament_id;

        -- Calculate the total number of teams
        SELECT COUNT(*) INTO total_teams FROM temp_teams;

        -- Calculate the nearest power of 2
        SET next_power_of_2 = POW(2, CEIL(LOG2(total_teams)));

        SET total_rounds = LOG2(next_power_of_2);

        -- Calculate the number of byes
        SET byes_count = next_power_of_2 - total_teams;

        -- Insert first-round matches for teams without byes
        SET i = 1;
        SET match_no = 1;
        SET current_round = 1;
        WHILE i <= (total_teams - byes_count)
            DO
                -- Fetch two teams for the match
                SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;
                SELECT team_id INTO team2_id FROM temp_teams WHERE id = i + 1;

                SET location = (
                    SELECT location_name
                    FROM tournament_locations
                    WHERE tournament_id = p_tournament_id
                    ORDER BY RAND()
                    LIMIT 1
                );

                -- Insert match into matches table
                INSERT INTO matches (tournament_id, team1_id, team2_id, round, status, match_date, location, match_number)
                VALUES (p_tournament_id, team1_id, team2_id, 1, 'scheduled', t_start_date, location, match_no);

                -- Move to the next pair of teams
                SET i = i + 2;
                SET match_no = match_no + 1;
            END WHILE;

        -- Handle byes: Add matches for round 2
        IF byes_count > 0 THEN
            SET current_round = 2;
            SET i = (total_teams - byes_count) + 1; -- Start after non-bye teams
            SET match_no = 1;
            WHILE i <= total_teams - (total_teams - byes_count) / 2
                DO
                    -- Fetch team with a bye
                    SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;

                    -- Fetch the next opponent from winners of round 1
                    SELECT id INTO team2_id FROM temp_teams WHERE id = i + 1;

                    SET location = (
                        SELECT location_name
                        FROM tournament_locations
                        WHERE tournament_id = p_tournament_id
                        ORDER BY RAND()
                        LIMIT 1
                    );

                    -- Insert match into round 2
                    INSERT INTO matches (tournament_id, team1_id, team2_id, round, status, match_date, location, match_number)
                    VALUES (p_tournament_id, team1_id, team2_id, 2, 'scheduled', t_start_date, location, match_no);

                    SET i = i + 2;
                    SET match_no = match_no + 1;
                END WHILE;

            WHILE i <= total_teams
                DO
                    SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;

                    SET location = (
                        SELECT location_name
                        FROM tournament_locations
                        WHERE tournament_id = p_tournament_id
                        ORDER BY RAND()
                        LIMIT 1
                    );

                    INSERT INTO matches (tournament_id, team1_id, round, status, match_date, location, match_number)
                    VALUES (p_tournament_id, team1_id, 2, 'tbd', t_start_date, location, match_no);

                    SET i = i + 1;
                    SET match_no = match_no + 1;
                END WHILE;
        END IF;

        SET current_round = current_round + 1;
        WHILE current_round <= total_rounds
            DO
                SET matches_count = next_power_of_2 / POW(2, current_round);
                SET i = 1;
                WHILE i <= matches_count
                    DO
                        INSERT INTO matches (tournament_id, round, status, match_number)
                        VALUES (p_tournament_id, current_round, 'tbd', i);

                        SET i = i + 1;
                    END WHILE;

                SET current_round = current_round + 1;
            END WHILE;

        DROP TEMPORARY TABLE temp_teams;
    END`
  );
};

const createUpdateNextMatchWinnerProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS UpdateNextMatchWinner");
  await pool.query(
    `CREATE PROCEDURE UpdateNextMatchWinner(
        IN p_match_id INT,
        IN p_winner_team_id INT
    )
    BEGIN
        DECLARE next_match INT;
        DECLARE slot_filled INT;

        SELECT next_match_id INTO next_match FROM matches WHERE match_id = p_match_id;

        IF next_match IS NOT NULL THEN
            SELECT COUNT(*) INTO slot_filled FROM matches WHERE match_id = next_match AND team1_id IS NULL;

            IF slot_filled = 1 THEN
                UPDATE matches
                SET team1_id = p_winner_team_id
                WHERE match_id = next_match;
            ELSE
                UPDATE matches
                SET team2_id = p_winner_team_id,
                    status = 'scheduled'
                WHERE match_id = next_match;
            END IF;
        END IF;
    END`
  );
};

const seedSeries = async () => {
  console.log("Creating series table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS series (
      series_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR (100) NOT NULL,
      format ENUM('T20', 'ODI', 'Test'),
      type ENUM ('bilateral', 'trilateral'),
      start_date DATE,
      end_date DATE,
      total_rounds INT DEFAULT 3,
      winner_team_id INT,
      finished BOOLEAN DEFAULT FALSE
    )`
  );

  console.log("Creating series_locations table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS series_locations (
      series_id INT,
      location_name VARCHAR(100),
      FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE CASCADE,
      PRIMARY KEY (series_id, location_name)
    )
  `);

  console.log("Creating series_teams table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS series_teams (
      series_id INT,
      team_id INT,
      FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      PRIMARY KEY (series_id, team_id)
    )
  `);

  console.log("Creating series_points table..."); // for trilateral series
  await pool.query(
    `CREATE TABLE IF NOT EXISTS series_points (
      series_id INT NOT NULL,
      team_id INT NOT NULL,
      matches_played INT DEFAULT 0,
      wins INT DEFAULT 0,
      losses INT DEFAULT 0,
      ties INT DEFAULT 0,
      points INT DEFAULT 0,
      net_run_rate FLOAT DEFAULT 0.0,
      FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      PRIMARY KEY (series_id, team_id)
    )`
  );

  console.log("Adding FK constraint to matches table for series_id...");
  await pool.query(
    `ALTER TABLE matches ADD FOREIGN KEY (series_id) REFERENCES series (series_id) ON DELETE CASCADE`
  );

  console.log("Creating series procedures...");
  await createSeriesScheduleProc();
  await createSeriesPointsForTeamsTrigger();

  console.log("Seeding series...");
  for (const s of series) {
    await pool.query(
      `INSERT INTO series (name, start_date, end_date, format, type, total_rounds)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [s.name, s.start_date, s.end_date, s.format, s.type, s.total_rounds]
    );

    for (const location of s.locations) {
      await pool.query(
        `INSERT INTO series_locations (series_id, location_name)
        VALUES (?, ?)`,
        [s.series_id, location]
      );
    }

    for (const team_id of s.team_ids) {
      await pool.query(
        `INSERT INTO series_teams (series_id, team_id)
        VALUES (?, ?)`,
        [s.series_id, team_id]
      );
    }

    await pool.query("CALL CreateSeriesSchedule(?)", [s.series_id]);
  }
};

const createSeriesScheduleProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS CreateSeriesSchedule");
  await pool.query(
    `CREATE PROCEDURE CreateSeriesSchedule (IN p_series_id INT)
    BEGIN
        DECLARE series_type VARCHAR(30);
        DECLARE series_rounds INT;
        DECLARE i INT;
        DECLARE team1_id INT;
        DECLARE team2_id INT;
        DECLARE s_start_date DATE;
        DECLARE location VARCHAR(100);

        SELECT type INTO series_type FROM series
        WHERE series_id = p_series_id;

        SELECT total_rounds INTO series_rounds FROM series
        WHERE series_id = p_series_id;

        SELECT start_date INTO s_start_date
        FROM series
        WHERE series_id = p_series_id;

        CREATE TEMPORARY TABLE temp_teams (id INT AUTO_INCREMENT PRIMARY KEY, team_id INT);

        INSERT INTO temp_teams (team_id)
        SELECT team_id FROM series_teams
        WHERE series_id = p_series_id;

        IF series_type = 'bilateral' THEN
            SET i = 1;

            SELECT team_id INTO team1_id FROM temp_teams
            WHERE id = 1;

            SELECT team_id INTO team2_id FROM temp_teams
            WHERE id = 2;

            WHILE i <= series_rounds DO
                    SET location = (
                        SELECT location_name
                        FROM series_locations
                        WHERE series_id = p_series_id
                        ORDER BY RAND()
                        LIMIT 1
                    );
                    INSERT INTO matches (series_id, team1_id, team2_id, round, status, match_date, location, match_number)
                    VALUES (p_series_id, team1_id, team2_id, 1, 'scheduled', s_start_date, location, i);

                    SET i = i + 1;
                END WHILE;
        ELSE
            SET i = 1;
            WHILE i <= 2
                DO
                    SELECT team_id INTO team1_id FROM temp_teams
                    WHERE id = 1;
                    SELECT team_id INTO team2_id FROM temp_teams
                    WHERE id = 2;

                    SET location = (
                        SELECT location_name
                        FROM series_locations
                        WHERE series_id = p_series_id
                        ORDER BY RAND()
                        LIMIT 1
                    );

                    INSERT INTO matches (series_id, team1_id, team2_id, round, status, match_date, location, match_number)
                    VALUES (p_series_id, team1_id, team2_id, i, 'scheduled', s_start_date, location, 1);

                    SELECT team_id INTO team1_id FROM temp_teams
                    WHERE id = 2;
                    SELECT team_id INTO team2_id FROM temp_teams
                    WHERE id = 3;

                    SET location = (
                        SELECT location_name
                        FROM series_locations
                        WHERE series_id = p_series_id
                        ORDER BY RAND()
                        LIMIT 1
                    );

                    INSERT INTO matches (series_id, team1_id, team2_id, round, status, match_date, location, match_number)
                    VALUES (p_series_id, team1_id, team2_id, i, 'scheduled', s_start_date, location, 2);

                    SELECT team_id INTO team1_id FROM temp_teams
                    WHERE id = 3;
                    SELECT team_id INTO team2_id FROM temp_teams
                    WHERE id = 1;

                    SET location = (
                        SELECT location_name
                        FROM series_locations
                        WHERE series_id = p_series_id
                        ORDER BY RAND()
                        LIMIT 1
                    );

                    INSERT INTO matches (series_id, team1_id, team2_id, round, status, match_date, location, match_number)
                    VALUES (p_series_id, team1_id, team2_id, i, 'scheduled', s_start_date, location, 3);
                    
                    SET i = i + 1;
                END WHILE;
        END IF;

        DROP TEMPORARY TABLE temp_teams;
    END`
  );
};

const createSeriesPointsForTeamsTrigger = async () => {
  await pool.query("DROP TRIGGER IF EXISTS CreateSeriesPointsForTeam");
  await pool.query(
    `CREATE TRIGGER CreateSeriesPointsForTeam
    AFTER INSERT ON series_teams
    FOR EACH ROW
    BEGIN
        DECLARE is_trilateral BOOLEAN DEFAULT FALSE;

        SELECT (type = 'trilateral') INTO is_trilateral
        FROM series
        WHERE series_id = NEW.series_id;

        IF is_trilateral = TRUE THEN
            INSERT INTO series_points (series_id, team_id)
            VALUES (NEW.series_id, NEW.team_id);
        END IF;
    END`
  );
}

const seedInnings = async () => {
  console.log("Creating innings table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS innings (
      inning_id INT PRIMARY KEY AUTO_INCREMENT,
      match_id INT NOT NULL,
      team_id INT NOT NULL,
      number INT,
      total_runs INT DEFAULT 0,
      total_wickets INT DEFAULT 0,
      total_overs INT DEFAULT 0,
      target_score INT DEFAULT 0,
      FOREIGN KEY (match_id) REFERENCES matches (match_id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE
    )`
  );

  console.log("Creating procedure for initial innings...");
  await pool.query("DROP PROCEDURE IF EXISTS CreateInningsForMatch");
  await pool.query(
    `CREATE PROCEDURE CreateInningsForMatch (IN p_match_id INT, IN batting_team_id INT, IN bowling_team_id INT, IN inning_number INT, IN p_target_score INT)
    BEGIN
        DECLARE p_inning_id INT;
        DECLARE p_bowler_id INT;

        INSERT INTO innings (match_id, team_id, number, target_score)
        VALUES (p_match_id, batting_team_id, inning_number, p_target_score);

        SELECT LAST_INSERT_ID() INTO p_inning_id;
        SET p_bowler_id = (
            SELECT player_id FROM team_players
            WHERE team_id = bowling_team_id
            AND bowling_order IS NOT NULL
            ORDER BY bowling_order
            LIMIT 1
        );

        INSERT INTO overs (inning_id, over_number, bowler_id)
        VALUES (p_inning_id, 1, p_bowler_id);
    END`
  );
};

const seedOvers = async () => {
  console.log("Creating overs table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS overs (
      inning_id INT NOT NULL,
      over_number INT,
      bowler_id INT NOT NULL,
      total_runs INT DEFAULT 0,
      total_wickets INT DEFAULT 0,
      FOREIGN KEY (inning_id) REFERENCES innings (inning_id) ON DELETE CASCADE,
      PRIMARY KEY (inning_id, over_number)
    )`
  );
};

const seedBalls = async () => {
  console.log("Creating balls table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS balls (
      ball_id INT PRIMARY KEY AUTO_INCREMENT,
      inning_id INT NOT NULL,
      over_number INT NOT NULL,
      ball_number INT,
      batsman_id INT,
      non_striker_id INT,
      bowler_id INT,
      runs_scored INT DEFAULT 0,
      is_legal BOOLEAN DEFAULT TRUE,
      is_wicket BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (inning_id) REFERENCES innings (inning_id) ON DELETE CASCADE,
      FOREIGN KEY (batsman_id) REFERENCES players (player_id) ON DELETE SET NULL,
      FOREIGN KEY (non_striker_id) REFERENCES players (player_id) ON DELETE SET NULL,
      FOREIGN KEY (bowler_id) REFERENCES players (player_id) ON DELETE SET NULL
    )`
  );

  console.log("Creating dismissals table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS dismissals (
      dismissal_id INT PRIMARY KEY AUTO_INCREMENT,
      inning_id INT NOT NULL,
      ball_id INT NOT NULL,
      batsman_id INT,
      bowler_id INT,
      fielder_id INT,
      dismissal_type ENUM('Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Others'),
      runs_scored INT DEFAULT 0,
      wicket_number INT DEFAULT 1,
      FOREIGN KEY (inning_id) REFERENCES innings (inning_id) ON DELETE CASCADE,
      FOREIGN KEY (ball_id) REFERENCES balls (ball_id) ON DELETE CASCADE,
      FOREIGN KEY (batsman_id) REFERENCES players (player_id) ON DELETE SET NULL,
      FOREIGN KEY (bowler_id) REFERENCES players (player_id) ON DELETE SET NULL,
      FOREIGN KEY (fielder_id) REFERENCES players (player_id) ON DELETE SET NULL
    )`
  );

  console.log("Creating extras table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS extras (
      extra_id INT PRIMARY KEY AUTO_INCREMENT,
      ball_id INT NOT NULL,
      type ENUM('Wide', 'No Ball', 'Bye', 'Leg Bye', 'Penalty'),
      runs INT,
      FOREIGN KEY (ball_id) REFERENCES balls (ball_id) ON DELETE CASCADE
    )`
  );
};

const seedPerformances = async () => {
  console.log("Creating match_batting_performance table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS match_batting_performance (
      match_id INT,
      inning_id INT,
      player_id INT,
      runs_scored INT DEFAULT 0,
      balls_faced INT DEFAULT 0,
      fours INT DEFAULT 0,
      sixes INT DEFAULT 0,
      strike_rate DECIMAL(6, 2) DEFAULT 0.00,
      dismissal_id INT,
      FOREIGN KEY (match_id) REFERENCES matches (match_id) ON DELETE CASCADE,
      FOREIGN KEY (inning_id) REFERENCES innings (inning_id) ON DELETE CASCADE,
      FOREIGN KEY (dismissal_id) REFERENCES dismissals (dismissal_id) ON DELETE SET NULL,
      PRIMARY KEY (match_id, inning_id, player_id)
    )`
  );

  console.log("Creating match_bowling_performance table...");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS match_bowling_performance (
      match_id INT,
      inning_id INT,
      player_id INT,
      overs_bowled DECIMAL(5, 1) DEFAULT 0.0,
      maiden_overs INT DEFAULT 0,
      dots INT DEFAULT 0,
      runs_conceded INT DEFAULT 0,
      wickets_taken INT DEFAULT 0,
      economy_rate DECIMAL(6, 2) DEFAULT 0.0,
      FOREIGN KEY (match_id) REFERENCES matches (match_id) ON DELETE CASCADE,
      FOREIGN KEY (inning_id) REFERENCES innings (inning_id) ON DELETE CASCADE,
      PRIMARY KEY (match_id, inning_id, player_id)
    )`
  );

  console.log("Creating trigger for inserting match performances...");
  await createInsertMatchPerformanceEntriesTrigger();
};

const createInsertMatchPerformanceEntriesTrigger = async () => {
  await pool.query("DROP TRIGGER IF EXISTS InsertMatchPerformanceEntries");
  await pool.query(
    `CREATE TRIGGER InsertMatchPerformanceEntries
    AFTER INSERT ON innings
    FOR EACH ROW
    BEGIN
        DECLARE batting_team_id INT;
        DECLARE bowling_team_id INT;
        DECLARE previous_batting_team_id INT;

        -- Check if it's the first inning
        IF NEW.number = 1 THEN
            -- Determine the batting and bowling teams based on the toss decision
            SELECT
                CASE
                    WHEN toss_decision = 'batting' THEN toss_winner_id
                    ELSE CASE WHEN team1_id = toss_winner_id THEN team2_id ELSE team1_id END
                END AS batting_team,
                CASE
                    WHEN toss_decision = 'bowling' THEN toss_winner_id
                    ELSE CASE WHEN team1_id = toss_winner_id THEN team2_id ELSE team1_id END
                END AS bowling_team
            INTO batting_team_id, bowling_team_id
            FROM matches
            WHERE match_id = NEW.match_id;
        ELSE
            SELECT team_id
            INTO previous_batting_team_id
            FROM innings
            WHERE match_id = NEW.match_id AND number = NEW.number - 1
            LIMIT 1;

            -- Set batting and bowling teams for the current inning
            SET bowling_team_id = previous_batting_team_id;
            SELECT CASE
                WHEN team1_id = bowling_team_id THEN team2_id
                ELSE team1_id
            END
            INTO batting_team_id
            FROM matches
            WHERE match_id = NEW.match_id;
        END IF;

        -- Insert players into match_batting_performance
        INSERT INTO match_batting_performance (match_id, inning_id, player_id)
        SELECT NEW.match_id, NEW.inning_id, player_id
        FROM team_players
        WHERE team_id = batting_team_id
        LIMIT 11;

        -- Insert players into match_bowling_performance
        INSERT INTO match_bowling_performance (match_id, inning_id, player_id)
        SELECT NEW.match_id, NEW.inning_id, player_id
        FROM team_players
        WHERE team_id = bowling_team_id
          AND bowling_order IS NOT NULL
        ORDER BY bowling_order;

    END`
  );
};

const createUpdateMatchStatusTrigger = async () => {
  console.log("Create trigger for updating match status...");
  await pool.query("DROP TRIGGER IF EXISTS UpdateMatchStatus");
  await pool.query(
    `CREATE TRIGGER UpdateMatchStatus
    AFTER INSERT ON balls
    FOR EACH ROW
    BEGIN
        DECLARE totalRuns INT;
        DECLARE newOver BOOLEAN;

        -- Calculate total runs including extras
        SET totalRuns = NEW.runs_scored;

        -- Check if this is the last ball of the over
        SET newOver = (NEW.ball_number = 6);

        -- Update bowlers' stats
        UPDATE match_bowling_performance
        SET
            runs_conceded = runs_conceded + totalRuns,
            wickets_taken = wickets_taken + IF(NEW.is_wicket, 1, 0),
            overs_bowled =
                CASE
                    WHEN MOD(overs_bowled, 1) = 0.5 AND NEW.is_legal THEN
                        CEILING(overs_bowled)
                    WHEN MOD(overs_bowled, 1) = 0.5 AND NOT NEW.is_legal THEN
                        overs_bowled
                    ELSE
                        overs_bowled + IF(NEW.is_legal, 0.1, 0)
                    END,
            economy_rate =
                CASE
                    WHEN overs_bowled + IF(NEW.is_legal, 0.1, 0) = 0 THEN 0
                    ELSE
                        (runs_conceded + totalRuns) /
                        (
                            CASE
                                WHEN MOD(overs_bowled, 1) = 0.5 THEN
                                    CEILING(overs_bowled)
                                ELSE
                                    overs_bowled + IF(NEW.is_legal, 0.1, 0)
                                END
                            )
                    END
        WHERE player_id = NEW.bowler_id;


        -- Update batsmen' stats
        UPDATE match_batting_performance
        SET
            runs_scored = runs_scored + NEW.runs_scored,
            balls_faced = balls_faced + IF(NEW.is_legal, 1, 0),
            fours = fours + IF(NEW.runs_scored = 4, 1, 0),
            sixes = sixes + IF(NEW.runs_scored = 6, 1, 0),
            strike_rate = CASE 
                WHEN (balls_faced + IF(NEW.is_legal, 1, 0)) > 0 THEN 
                    (runs_scored + NEW.runs_scored) / (balls_faced + IF(NEW.is_legal, 1, 0)) * 100 
                ELSE 
                    0
              END
        WHERE player_id = NEW.batsman_id;

        -- Update innings stats
        UPDATE innings
        SET
            total_runs = total_runs + totalRuns,
            total_wickets = total_wickets + IF(NEW.is_wicket, 1, 0),
            total_overs = total_overs + IF(newOver, 1, 0)
        WHERE inning_id = NEW.inning_id;

        -- Update the overs table
        IF EXISTS (
            SELECT 1 FROM overs WHERE inning_id = NEW.inning_id AND over_number = NEW.over_number
        ) THEN
            -- Update the existing over
            UPDATE overs
            SET
                total_runs = total_runs + totalRuns,
                total_wickets = total_wickets + IF(NEW.is_wicket, 1, 0)
            WHERE inning_id = NEW.inning_id AND over_number = NEW.over_number;
        ELSE
            -- Insert a new over
            INSERT INTO overs (inning_id, over_number, bowler_id, total_runs, total_wickets)
            VALUES (NEW.inning_id, NEW.over_number, NEW.bowler_id, totalRuns, IF(NEW.is_wicket, 1, 0));
        END IF;

    END`
  );

  await pool.query("DROP TRIGGER IF EXISTS UpdateMatchStatsOnExtraBall");
  await pool.query(
    `CREATE TRIGGER UpdateMatchStatsOnExtraBall
    AFTER INSERT on extras
    FOR EACH ROW
    BEGIN
        UPDATE innings i
        JOIN balls b ON b.ball_id = NEW.ball_id
        SET i.total_runs = i.total_runs + NEW.runs
        WHERE i.inning_id = b.inning_id;

        UPDATE match_bowling_performance mbp
        JOIN balls b ON b.ball_id = NEW.ball_id
        SET mbp.runs_conceded = mbp.runs_conceded + NEW.runs
        WHERE mbp.player_id = b.bowler_id;
    END`
  );
};

const createUpdateBatsmanDismissalTrigger = async () => {
  console.log("Create trigger for updating batsman dismissal...");
  await pool.query("DROP TRIGGER IF EXISTS UpdateBatsmanDismissal");
  await pool.query(
    `CREATE TRIGGER UpdateBatsmanDismissal
        AFTER INSERT ON dismissals
        FOR EACH ROW
    BEGIN
        UPDATE match_batting_performance mbp
        JOIN innings i ON mbp.match_id = i.match_id
        SET mbp.dismissal_id = NEW.dismissal_id
        WHERE i.inning_id = NEW.inning_id
          AND mbp.player_id = NEW.batsman_id
          AND mbp.dismissal_id IS NULL;
    END;
`
  );
};

const createOnMatchCompleteTrigger = async () => {
  console.log("Create trigger for on match complete...");
  await pool.query("DROP TRIGGER IF EXISTS OnMatchComplete");
  await pool.query(
    `CREATE TRIGGER OnMatchComplete
    AFTER UPDATE ON matches
    FOR EACH ROW
    BEGIN
        DECLARE winning_team_id INT;
        DECLARE losing_team_id INT;
        DECLARE is_trilateral_series BOOLEAN DEFAULT FALSE;
        DECLARE total_runs_team1 INT;
        DECLARE total_overs_team1 INT;
        DECLARE total_runs_team2 INT;
        DECLARE total_overs_team2 INT;
        DECLARE run_rate_team1 FLOAT DEFAULT 0;
        DECLARE run_rate_team2 FLOAT DEFAULT 0;
        DECLARE total_matches INT;
        DECLARE completed_matches INT;

        IF NEW.series_id IS NOT NULL THEN
            SELECT (type = 'trilateral') INTO is_trilateral_series
            FROM series
            WHERE series_id = NEW.series_id;
        END IF;

        IF is_trilateral_series AND OLD.status <> 'completed' AND NEW.status = 'completed' THEN
            SET winning_team_id = NEW.winner_team_id;

            IF winning_team_id IS NOT NULL THEN
                IF winning_team_id = NEW.team1_id THEN
                    SET losing_team_id = NEW.team2_id;
                ELSE
                    SET losing_team_id = NEW.team1_id;
                END IF;

                UPDATE series_points
                SET
                    matches_played = matches_played + 1,
                    wins = wins + 1,
                    points = points + 2
                WHERE
                    series_id = NEW.series_id AND
                    team_id = winning_team_id;

                UPDATE series_points
                SET
                    matches_played = matches_played + 1,
                    losses = losses + 1
                WHERE
                    series_id = NEW.series_id AND
                    team_id = losing_team_id;

            ELSE
                UPDATE series_points
                SET
                    matches_played = matches_played + 1,
                    ties = ties + 1,
                    points = points + 1
                WHERE
                    series_id = NEW.series_id AND
                    team_id IN (NEW.team1_id, NEW.team2_id);
            END IF;

            SELECT
                total_runs, total_overs
            INTO
                total_runs_team1, total_overs_team1
            FROM
                innings
            WHERE
                match_id = NEW.match_id AND
                team_id = NEW.team1_id;

            SELECT
                total_runs, total_overs
            INTO
                total_runs_team2, total_overs_team2
            FROM
                innings
            WHERE
                match_id = NEW.match_id AND
                team_id = NEW.team2_id;

            IF total_overs_team1 > 0 THEN
                SET run_rate_team1 = total_runs_team1 / total_overs_team1;
            END IF;

            IF total_overs_team2 > 0 THEN
                SET run_rate_team2 = total_runs_team2 / total_overs_team2;
            END IF;

            UPDATE series_points
            SET
                net_run_rate = run_rate_team1
            WHERE
                series_id = NEW.series_id AND
                team_id = NEW.team1_id;

            UPDATE series_points
            SET
                net_run_rate = run_rate_team2
            WHERE
                series_id = NEW.series_id AND
                team_id = NEW.team2_id;
        END IF;
        
        IF NEW.tournament_id IS NOT NULL THEN
            SELECT COUNT(*) INTO total_matches FROM matches
            WHERE tournament_id = NEW.tournament_id;
            
            SELECT COUNT(*) INTO completed_matches FROM matches
            WHERE tournament_id = NEW.tournament_id
            AND status = 'completed';
            
            IF total_matches = completed_matches THEN
                UPDATE tournaments
                SET status = 'completed'
                WHERE tournament_id = NEW.tournament_id;
            END IF;
        ELSE
            SELECT COUNT(*) INTO total_matches FROM matches
            WHERE series_id = NEW.series_id;

            SELECT COUNT(*) INTO completed_matches FROM matches
            WHERE series_id = NEW.series_id
            AND status = 'completed';

            IF total_matches = completed_matches THEN
                UPDATE series
                SET status = 'completed'
                WHERE series_id = NEW.series_id;
            END IF;
        END IF;
    END`
  );
}

const seedRemainingTriggers = async () => {
  await createUpdateMatchStatusTrigger();
  await createUpdateBatsmanDismissalTrigger();
  await createOnMatchCompleteTrigger();
};

const main = async () => {
  console.log("🌱 Starting database seed...");

  try {
    console.log("Dropping existing tables...");
    await pool.query(`
      DROP TABLE IF EXISTS match_batting_performance,
                           match_bowling_performance,
                           extras,
                           dismissals,
                           balls,
                           overs,
                           innings,
                           matches,
                           series_locations,
                           series_points,
                           series_teams,
                           series,
                           tournament_locations,
                           tournament_teams,
                           tournaments,
                           team_players,
                           teams,
                           players
    `);

    await seedTeams();
    await seedPlayers();
    await seedTeamPlayers();
    await seedMatches();
    await seedTournaments();
    await seedSeries();
    await seedInnings();
    await seedOvers();
    await seedBalls();
    await seedPerformances();
    await seedRemainingTriggers();

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();
