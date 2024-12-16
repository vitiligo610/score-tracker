import { pool } from "@/lib/db";
import { players, teams } from "@/lib/placeholder-data";

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
      bowling_style ENUM('Right-arm Fast', 'Left-arm Fast', 'Right-arm Spin', 'Left-arm Spin', 'Right-arm Medium', 'Left-arm Medium', 'No'),
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
  await Promise.all([
    // Team 1 players
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (1, 1)"),
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (1, 2)"),
    // Team 2 players
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (2, 3)"),
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (2, 4)"),
    // Team 3 players
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (3, 5)"),
    pool.query("INSERT INTO team_players (team_id, player_id) VALUES (3, 6)"),
  ]);
};

const main = async () => {
  console.log("🌱 Starting database seed...");

  try {
    console.log("Dropping existing tables...");
    await pool.query("DROP TABLE IF EXISTS team_players, players, teams");

    await seedTeams();
    await seedPlayers();
    await seedTeamPlayers();

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

main();
