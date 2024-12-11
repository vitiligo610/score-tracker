"use server";

import { revalidatePath } from "next/cache";
import { Player, PlayerWithoutId } from "@/lib/definitons";
import { createConnection } from "@/lib/db";
import { PLAYERS_PER_PAGE } from "@/lib/constants";

export const fetchPlayers = async (
  query: string,
  page: number,
  roles: string[],
  battingStyles: string[],
  bowlingStyles: string[]
) => {
  try {
    const db = await createConnection();

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

    const [players] = await db.query(sqlQuery, params);

    sqlQuery = `
      SELECT COUNT(*) AS count FROM players 
      ${whereClause}
    `;
    const [data]: any = await db.query(sqlQuery, params);

    return {
      players: players as Player[],
      count: data[0].count as number,
      success: true as const,
    };
  } catch (error) {
    return { success: false as const, error: "Failed to fetch players" };
  }
};

export const insertPlayer = async (player: PlayerWithoutId) => {
  try {
    const db = await createConnection();

    await db.query(
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
    revalidatePath("/players");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add player" };
  }
};
