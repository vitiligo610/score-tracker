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
      description TEXT
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
      FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
      PRIMARY KEY (team_id, player_id)
    )
  `);

  console.log("Seeding team players...");
  await Promise.all(
    team_players.map((team_player) =>
      pool.query(
        `INSERT INTO team_players (team_id, player_id, batting_order)
        VALUES (?, ?, ?)`,
        [team_player.team_id, team_player.player_id, team_player.batting_order]
      )
    )
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
      team1_id INT NOT NULL,
      team2_id INT,
      winner_team_id INT,
      location VARCHAR (100),
      round VARCHAR (50),
      status ENUM('started', 'scheduled', 'completed', 'tbd'),
      FOREIGN KEY (team1_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      FOREIGN KEY (team2_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      FOREIGN KEY (winner_team_id) REFERENCES teams (team_id)
    )
  `);
};

const createAddTeamToTournamentProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS AddTeamToTournament");
  await pool.query(
    `CREATE PROCEDURE AddTeamToTournament(IN tournament_id INT, IN team_id INT)
    BEGIN
        INSERT INTO tournament_teams (tournament_id, team_id)
        VALUES (tournament_id, team_id);
    END`
  );
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

const createInitialTournamentScheduleProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS CreateInitialTournamentSchedule");
  await pool.query(
    `CREATE PROCEDURE CreateInitialTournamentSchedule(IN p_tournament_id INT)
    BEGIN
      DECLARE total_teams INT;
      DECLARE next_power_of_2 INT;
      DECLARE byes_count INT;
      DECLARE i INT;
      DECLARE team1_id INT;
      DECLARE team2_id INT;

      -- Temporary table to store teams
      CREATE TEMPORARY TABLE temp_teams (id INT AUTO_INCREMENT PRIMARY KEY, team_id INT);

      -- Fetch all teams for the given tournament
      INSERT INTO temp_teams (team_id)
      SELECT team_id FROM tournament_teams WHERE tournament_id = p_tournament_id;

      -- Calculate the total number of teams
      SELECT COUNT(*) INTO total_teams FROM temp_teams;

      -- Calculate the nearest power of 2
      SET next_power_of_2 = POW(2, CEIL(LOG2(total_teams)));

      -- Calculate the number of byes
      SET byes_count = next_power_of_2 - total_teams;

      -- Insert first-round matches for teams without byes
      SET i = 1;
      WHILE i <= (total_teams - byes_count) DO
        -- Fetch two teams for the match
        SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;
        SELECT team_id INTO team2_id FROM temp_teams WHERE id = i + 1;

        -- Insert match into matches table
        INSERT INTO matches (tournament_id, team1_id, team2_id, round, status)
        VALUES (p_tournament_id, team1_id, team2_id, 1, 'scheduled');

        -- Move to the next pair of teams
        SET i = i + 2;
      END WHILE;

      -- Handle byes: Add matches for round 2
      IF byes_count > 0 THEN
        SET i = (total_teams - byes_count) + 1; -- Start after non-bye teams
        WHILE i <= total_teams - (total_teams - byes_count) / 2 DO
          -- Fetch team with a bye
          SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;

          -- Fetch the next opponent from winners of round 1
          SELECT id INTO team2_id FROM temp_teams WHERE id = i + 1;

          -- Insert match into round 2
          INSERT INTO matches (tournament_id, team1_id, team2_id, round, status)
          VALUES (p_tournament_id, team1_id, team2_id, 2, 'scheduled');

          SET i = i + 2;
        END WHILE;

        WHILE i <= total_teams DO
          SELECT team_id INTO team1_id FROM temp_teams WHERE id = i;

          INSERT INTO matches (tournament_id, team1_id, round, status)
          VALUES (p_tournament_id, team1_id, 2, 'tbd');

          SET i = i + 1;
        END WHILE;
      END IF;

      DROP TEMPORARY TABLE temp_teams;
    END`
  );
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
  await createAddTeamToTournamentProc();
  await createSetTournamentDetailsProc();
  await createInitialTournamentScheduleProc();

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
      await pool.query(`CALL AddTeamToTournament(?, ?)`, [
        tournament.tournament_id,
        team_id,
      ]);
    }

    await pool.query("CALL SetTournamentDetails(?)", [tournament.tournament_id]);
    await pool.query("CALL CreateInitialTournamentSchedule(?)", [tournament.tournament_id]);
  }
};

const createInitialSeriesScheduleProc = async () => {
  await pool.query("DROP PROCEDURE IF EXISTS CreateInitialSeriesSchedule");
  await pool.query(
    `CREATE PROCEDURE CreateInitialSeriesSchedule (IN p_series_id INT)
    BEGIN
        DECLARE series_type VARCHAR(30);
        DECLARE series_rounds INT;
        DECLARE i INT;
        DECLARE team1_id INT;
        DECLARE team2_id INT;

        SELECT type INTO series_type FROM series
        WHERE series_id = p_series_id;

        SELECT total_rounds INTO series_rounds FROM series
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
                INSERT INTO matches (series_id, team1_id, team2_id, round, status)
                VALUES (p_series_id, team1_id, team2_id, i, 'scheduled');

                SET i = i + 1;
            END WHILE;
        ELSE
            SELECT team_id INTO team1_id FROM temp_teams
            WHERE id = 1;
            SELECT team_id INTO team2_id FROM temp_teams
            WHERE id = 2;

            INSERT INTO matches (series_id, team1_id, team2_id, round, status)
            VALUES (p_series_id, team1_id, team2_id, 1, 'scheduled');

            SELECT team_id INTO team1_id FROM temp_teams
            WHERE id = 2;
            SELECT team_id INTO team2_id FROM temp_teams
            WHERE id = 3;

            INSERT INTO matches (series_id, team1_id, team2_id, round, status)
            VALUES (p_series_id, team1_id, team2_id, 1, 'scheduled');

            SELECT team_id INTO team1_id FROM temp_teams
            WHERE id = 3;
            SELECT team_id INTO team2_id FROM temp_teams
            WHERE id = 1;

            INSERT INTO matches (series_id, team1_id, team2_id, round, status)
            VALUES (p_series_id, team1_id, team2_id, 1, 'scheduled');
        END IF;

        DROP TEMPORARY TABLE temp_teams;
    END;`
  );
}

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
      team1_id INT NOT NULL,
      team2_id INT NOT NULL,
      team3_id INT,
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

  console.log("Creating series_points table...") // for trilateral series
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
  await createInitialSeriesScheduleProc();

  console.log("Seeding series...");
  for (const s of series) {
    await pool.query(
      `INSERT INTO series (name, start_date, end_date, format, type, total_rounds)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        s.name,
        s.start_date,
        s.end_date,
        s.format,
        s.type,
        s.total_rounds,
      ]
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

    await pool.query("CALL CreateInitialSeriesSchedule(?)", [s.series_id]);
  }
}

const main = async () => {
  console.log("🌱 Starting database seed...");

  try {
    console.log("Dropping existing tables...");
    await pool.query(`
      DROP TABLE IF EXISTS matches,
                           series_locations,
                           series_points,
                           series_teams,
                           series,
                           tournament_locations,
                           tournament_teams,
                           tournaments,
                           team_players,
                           players,
                           teams
    `);

    await seedTeams();
    await seedPlayers();
    await seedTeamPlayers();
    await seedMatches();
    await seedTournaments();
    await seedSeries();

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();
