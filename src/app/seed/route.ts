import { createConnection } from "@/lib/db";
import { players, teams } from "@/lib/placeholder-data";
import { NextResponse } from "next/server";

const db = await createConnection();

const seedTeams = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS teams (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      logo_url VARCHAR(255),
      founded_year INT,
      description TEXT
    )
  `;

  await db.query(query);

  const insertedTeams = await Promise.all(
    teams.map(async (team) => {
      return db.query(`
        INSERT INTO teams(name, logo_url, founded_year, description)
        VALUES(?, ?, ?, ?)
        `, [team.name, team.logo_url, team.founded_year, team.description]);
    })
  );

  return insertedTeams;
}

const seedPlayers = async () => {
  const query = `
    CREATE TABLE Players(
      id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      date_of_birth Date,
      batting_style ENUM ('Right-hand' , 'Left-hand'),
      bowling_style ENUM ('Right-arm Fast' , 'Left-arm Fast' , 'Right-arm Spin', 'Left-arm Spin', 'Right-arm Medium', 'Left-arm Medium' , 'No'),
      player_role ENUM ('Batsman' , 'Bowler' , 'All-rounder', 'Wicket-keeper'),
      jersey_number INT
    );
  `;

  await db.query(query);

  const insertedPlayers = await Promise.all(
    players.map(async (player) => {
      return db.query(`
        INSERT INTO players(first_name, last_name, date_of_birth, batting_style, bowling_style, player_role, jersey_number)
        VALUES(?, ?, ?, ?, ?, ? ,?)
        `, [player.first_name, player.last_name, player.date_of_birth, player.batting_style, player.bowling_style, player.player_role, player.jersey_number]);
    })
  );

  return insertedPlayers;
}

const dropTables = async () => {
  await db.query("DROP TABLE IF EXISTS teams");
  await db.query("DROP TABLE IF EXISTS players");
}

export const GET = async () => {
  try {
    await dropTables();
    await seedTeams();
    await seedPlayers();

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    return NextResponse.json({ error, message: "An error occured" });
  }
}