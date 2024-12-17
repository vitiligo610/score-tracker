import { pool } from "@/lib/db";
import { players, team_players, teams, tournaments } from "@/lib/placeholder-data";

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
  console.log("Creating Team Players table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_players(
      team_id INT,
      player_id INT,
      FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
      PRIMARY KEY (team_id, player_id)
    )
  `);

  console.log("Seeding team players...");
  await Promise.all(
    team_players.map(team_player => 
      pool.query(
        `INSERT INTO team_players (team_id, player_id)
        VALUES (?, ?)`,
        [team_player.team_id, team_player.player_id]
      )
    )
  );
};

const seedTournaments = async () => {
  console.log("Creating Tournaments table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournaments (
      tournament_id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      start_date DATE,
      end_date DATE,
      format ENUM('T20', 'ODI', 'Test'),
      finished BOOLEAN DEFAULT FALSE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournament_locations (
      tournament_id INT,
      location_name VARCHAR(100),
      FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE CASCADE,
      PRIMARY KEY (tournament_id, location_name)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tournament_teams (
      tournament_id INT,
      team_id INT,
      FOREIGN KEY (tournament_id) REFERENCES tournaments (tournament_id) ON DELETE CASCADE,
      FOREIGN KEY (team_id) REFERENCES teams (team_id) ON DELETE CASCADE,
      PRIMARY KEY (tournament_id, team_id)
    )
  `);

  console.log("Seeding tournament values...");

  for (const tournament of tournaments) {
    await pool.query(
      `INSERT INTO tournaments (name, start_date, end_date, format)
      VALUES (?, ?, ?, ?)`,
      [
        tournament.name,
        tournament.start_date, 
        tournament.end_date,
        tournament.format
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
  }
}

const main = async () => {
  console.log("🌱 Starting database seed...");

  try {
    console.log("Dropping existing tables...");
    await pool.query(`
      DROP TABLE IF EXISTS tournament_teams,
                           tournament_locations,
                           tournaments,
                           team_players,
                           players,
                           teams
      `);

    await seedTeams();
    await seedPlayers();
    await seedTeamPlayers();
    await seedTournaments();

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();
