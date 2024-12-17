"use server";

import { revalidatePath } from "next/cache";
import { Player, PlayerWithoutId, PlayerWithTeam, Team, TeamPlayer, TeamWithoutId } from "@/lib/definitons";
import { pool } from "@/lib/db";
import { PLAYERS_PER_PAGE, TEAMS_PER_PAGE } from "@/lib/constants";

export const fetchPlayers = async (
  query: string,
  page: number,
  roles: string[],
  battingStyles: string[],
  bowlingStyles: string[]
) => {
  try {
    const conditions = [];
    const params = [];

    if (roles.length > 0) {
      conditions.push(`player_role IN (?)`);
      params.push(roles);
    }

    if (battingStyles.length > 0) {
      conditions.push(`batting_style IN (?)`);
      params.push(battingStyles);
    }

    if (bowlingStyles.length > 0) {
      conditions.push(`bowling_style IN (?)`);
      params.push(bowlingStyles);
    }

    if (query) {
      conditions.push(`(first_name LIKE ? OR last_name LIKE ?)`);
      params.push(`%${query}%`, `%${query}%`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let sqlQuery = `
      SELECT * FROM players 
      ${whereClause}
      LIMIT ?
      OFFSET ?
    `;

    params.push(PLAYERS_PER_PAGE, (page - 1) * PLAYERS_PER_PAGE);

    const [players] = await pool.query(sqlQuery, params);

    sqlQuery = `
      SELECT COUNT(*) AS count FROM players 
      ${whereClause}
    `;
    const [data]: any = await pool.query(sqlQuery, params);

    return {
      players: players as Player[],
      count: data[0].count as number,
      success: true as const,
    };
  } catch (error) {
    console.log("error is ", error);
    return { success: false as const, error: "Failed to fetch players" };
  }
};

export const fetchAllPlayers = async () => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM players
      LEFT JOIN team_players USING (player_id)`
    );

    return { allPlayers: players as PlayerWithTeam[] };
  } catch (error) {
    console.log("Error is: ", error);
    throw new Error("Failed to fetch all players.");
  }
}

export const insertPlayer = async (player: PlayerWithoutId) => {
  try {
    await pool.query(
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
    );
    // revalidatePath("/players");
  } catch (error) {
    throw new Error("Failed to add player!");
  }
};

export const updatePlayer = async (player: Player) => {
  try {
    console.log("received player as ", player);
    await pool.query(
      `UPDATE players
      SET first_name = ?,
          last_name = ?,
          date_of_birth = ?,
          batting_style = ?,
          bowling_style = ?,
          player_role = ?,
          jersey_number = ?
      WHERE player_id = ?`,
      [
        player.first_name,
        player.last_name,
        player.date_of_birth,
        player.batting_style,
        player.bowling_style,
        player.player_role,
        player.jersey_number,
        player.player_id,
      ]
    );
    // revalidatePath("/players");
  } catch (error) {
    console.log("error is ", error);
    throw new Error("Failed to update player!");
  }
}

export const deletePlayer = async (player_id: number) => {
  try {
    await pool.query(
      `DELETE FROM players WHERE player_id = ?`,
      [player_id]
    );
    revalidatePath("/players");
  } catch (error) {
    throw new Error("Failed to delete player!");
  }
}

export const fetchTeams = async (query: string, page: number) => {
  try {
    const conditions = [];
    const params = [];

    if (query) {
      conditions.push("name LIKE ? OR founded_year LIKE ? OR description LIKE ?");
      params.push(`%${query}%`, `%${query}%`, `%${query}%`)
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    params.push(TEAMS_PER_PAGE, (page - 1) * TEAMS_PER_PAGE);

    const [teams] = await pool.query(
      `SELECT * FROM teams
      ${whereClause}
      LIMIT ?
      OFFSET ?`,
      params
    );

    const [data]: any = await pool.query(`
      SELECT COUNT(*) AS count FROM teams
      ${whereClause}`,
      params
    );

    return {
      teams: teams as Team[],
      count: data[0].count as number,
    };
  } catch (error) {
    console.log("error is ", error);
    throw new Error("Failed to fetch teams!");
  }
}

export const fetchTeamById = async (team_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT * FROM teams
      WHERE team_id = ?`,
      [team_id]
    );

    return { team: data[0] as Team };
  } catch (error) {
    console.log("Error fetching team having id", team_id, error);
    throw new Error("Failed to fetch team by id");
  }
}

export const insertTeam = async (team: TeamWithoutId) => {
  try {
    await pool.query(
      `INSERT INTO teams (name, founded_year, description)
      VALUES (?, ?, ?)`,
      [
        team.name,
        team.founded_year,
        team.description
      ]
    );
    // revalidatePath("/teams");
  } catch (error) {
    throw new Error("Failed to insert team!");
  }
}

export const updateTeam = async (team: Team) => {
  try {
    await pool.query(
      `UPDATE teams
      SET name = ?,
          founded_year = ?,
          description = ?
      WHERE team_id = ?`,
      [
        team.name,
        team.founded_year,
        team.description,
        team.team_id
      ]
    );
    // revalidatePath("/teams");
  } catch (error) {
    console.log("error is ", error);
    throw new Error("Failed to update team!");
  }
}

export const deleteTeam = async (team_id: number) => {
  try {
    await pool.query(
      `DELETE FROM teams WHERE team_id = ?`,
      [team_id]
    );
    // revalidatePath("/teams");
  } catch (error) {
    throw new Error("Failed to delete team!");
  }
}

export const fetchTeamPlayers = async (team_id: number) => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM team_players
      NATURAL JOIN players
      WHERE team_id = ?`,
      [team_id]
    );

    return { teamPlayers: players as PlayerWithTeam[] };
  } catch (error) {
    console.log("Error fetching team players having team id", team_id);
    throw new Error("Failed to fetch team players");
  }
}

export const fetchAddedPlayers = async () => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM team_players`
    );

    return { addedPlayers: players as TeamPlayer[] };
  } catch (error) {
    console.log("Error fetching added players", error);
    throw new Error("Failed to fetch team players");
  }
}

export const addPlayersToTeam = async (team_id: number, player_ids: number[]) => {
  try {
    await Promise.all(
      player_ids.map(player_id => 
        pool.query(
          `INSERT INTO team_players (team_id, player_id)
          VALUES (?, ?)`,
          [team_id, player_id]
        )
      )
    );
  } catch (error) {
    console.log("Error adding players to team: ", error);
    throw new Error("Error adding players to team.");
  }
}

export const removePlayerFromTeam = async (team_id: number, player_id: number) => {
  try {
    await pool.query(
      `DELETE FROM team_players 
      WHERE team_id = ? AND player_id = ?`,
      [team_id, player_id]
    );
  } catch (error) {
    console.log("Failed to delete player: ", error);
    throw new Error("Failed to delete player");
  }
}