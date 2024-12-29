"use server";

import { revalidatePath } from "next/cache";
import {
  Ball,
  BattingTeamPlayer,
  BowlingTeamPlayer,
  ExtrasCount,
  Match,
  MatchBatsman,
  MatchBowler,
  OngoingInnings,
  OngoingMatch,
  Player,
  PlayerWithoutId,
  PlayerWithTeam,
  Series,
  SeriesMatch,
  SeriesWithoutId,
  Team,
  TeamPlayer,
  TeamWithoutId,
  Tournament,
  TournamentMatch,
  TournamentWithoutId,
} from "@/lib/definitons";
import { pool } from "@/lib/db";
import { PLAYERS_PER_PAGE, TEAMS_PER_PAGE } from "@/lib/constants";
import { getMatchDetails, getTransformedMatch } from "@/lib/utils";

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
};

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
};

export const deletePlayer = async (player_id: number) => {
  try {
    await pool.query(`DELETE FROM players WHERE player_id = ?`, [player_id]);
    revalidatePath("/players");
  } catch (error) {
    throw new Error("Failed to delete player!");
  }
};

export const fetchTeams = async (query: string, page: number) => {
  try {
    const conditions = [];
    const params = [];

    if (query) {
      conditions.push(
        "name LIKE ? OR founded_year LIKE ? OR description LIKE ?"
      );
      params.push(`%${query}%`, `%${query}%`, `%${query}%`);
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

    const [data]: any = await pool.query(
      `
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
};

export const fetchAllTeams = async () => {
  try {
    const [teams] = await pool.query(`
      SELECT 
        t.team_id AS team_id,
        t.name AS name,
        t.logo_url AS logo_url,
        t.founded_year AS founded_year,
        t.description AS description,
        COUNT(tp.player_id) AS players_count
      FROM teams t
      LEFT JOIN team_players tp ON tp.team_id = t.team_id
      GROUP BY
        t.team_id,
        t.name,
        t.logo_url,
        t.founded_year,
        t.description
    `);

    console.log("all teams is ", teams);

    return { allTeams: teams as Team[] };
  } catch (error) {
    console.log("error is ", error);
    throw new Error("Failed to fetch all teams!");
  }
};

export const fetchTeamNameById = async (team_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT name FROM teams
      WHERE team_id = ?`,
      [team_id]
    );

    return data[0].name as string;
  } catch (error) {
    console.log("Error fetching team name: ", error);
    throw new Error("Failed to fetch team name!");
  }
};

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
};

export const insertTeam = async (team: TeamWithoutId) => {
  try {
    await pool.query(
      `INSERT INTO teams (name, founded_year, description)
      VALUES (?, ?, ?)`,
      [team.name, team.founded_year, team.description]
    );
    // revalidatePath("/teams");
  } catch (error) {
    throw new Error("Failed to insert team!");
  }
};

export const updateTeam = async (team: Team) => {
  try {
    await pool.query(
      `UPDATE teams
      SET name = ?,
          founded_year = ?,
          description = ?
      WHERE team_id = ?`,
      [team.name, team.founded_year, team.description, team.team_id]
    );
    // revalidatePath("/teams");
  } catch (error) {
    console.log("error is ", error);
    throw new Error("Failed to update team!");
  }
};

export const updateTeamCaptain = async (
  team_id: number,
  captain_id: number
) => {
  try {
    await pool.query(
      `UPDATE teams
      SET captain_id = ?
      WHERE team_id = ?`,
      [captain_id, team_id]
    );
  } catch (error) {
    console.log("Error updating team captain: ", error);
    throw new Error("Failed to update team captain!");
  }
};

export const updateTeamBowlers = async (
  team_id: number,
  player_ids: number[]
) => {
  try {
    await Promise.all(
      player_ids.map((player_id, index) =>
        pool.query(
          `UPDATE team_players
          SET bowling_order = ?
          WHERE team_id = ?
          AND player_id = ?`,
          [index + 1, team_id, player_id]
        )
      )
    );
    await pool.query(
      `UPDATE team_players
      SET bowling_order = NULL
      WHERE team_id = ?
      AND player_id NOT IN (?)`,
      [team_id, player_ids]
    );
  } catch (error) {
    console.log("Error updating team bowlers: ", error);
    throw new Error("Failed to update team bowleres!");
  }
};

export const updateTeamBattingOrder = async (
  teamId: number,
  updatedOrders: { player_id: number; batting_order: number }[]
) => {
  try {
    console.log("here ", updatedOrders);
    await Promise.all(
      updatedOrders.map((order) =>
        pool.query(
          `UPDATE team_players
          SET batting_order = ?
          WHERE team_id = ?
          AND player_id = ?`,
          [order.batting_order, teamId, order.player_id]
        )
      )
    );
  } catch (error) {
    console.log("Failed to update batting order: ", error);
    throw new Error("Failed to update team's batting order!");
  }
};

export const updateTeamBowlingOrder = async (
  teamId: number,
  updatedOrders: { player_id: number; bowling_order: number }[]
) => {
  try {
    console.log("here ", updatedOrders);
    await Promise.all(
      updatedOrders.map((order) =>
        pool.query(
          `UPDATE team_players
          SET bowling_order = ?
          WHERE team_id = ?
          AND player_id = ?`,
          [order.bowling_order, teamId, order.player_id]
        )
      )
    );
  } catch (error) {
    console.log("Failed to update bowling order: ", error);
    throw new Error("Failed to update team's bowling order!");
  }
};

export const deleteTeam = async (team_id: number) => {
  try {
    await pool.query(`DELETE FROM teams WHERE team_id = ?`, [team_id]);
    // revalidatePath("/teams");
  } catch (error) {
    throw new Error("Failed to delete team!");
  }
};

export const fetchTeamPlayers = async (team_id: number) => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM team_players
      NATURAL JOIN players
      WHERE team_id = ?
      ORDER BY batting_order`,
      [team_id]
    );

    return { teamPlayers: players as PlayerWithTeam[] };
  } catch (error) {
    console.log("Error fetching team players having team id", team_id);
    throw new Error("Failed to fetch team players");
  }
};

export const fetchAddedPlayers = async () => {
  try {
    const [players] = await pool.query(`SELECT * FROM team_players`);

    return { addedPlayers: players as TeamPlayer[] };
  } catch (error) {
    console.log("Error fetching added players", error);
    throw new Error("Failed to fetch team players");
  }
};

export const addPlayersToTeam = async (
  team_id: number,
  player_ids: number[]
) => {
  try {
    await Promise.all(
      player_ids.map((player_id) =>
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
};

export const removePlayerFromTeam = async (
  team_id: number,
  player_id: number
) => {
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
};

export const fetchTournaments = async (filter: string) => {
  try {
    const whereClause =
      !filter || filter === "all"
        ? ""
        : `WHERE finished IS ${filter === "finished" ? "TRUE" : "FALSE"}`;
    const [data]: any = await pool.query(
      `SELECT * FROM tournaments
      LEFT JOIN tournament_teams USING (tournament_id)
      LEFT JOIN tournament_locations USING (tournament_id)
      ${whereClause}`
    );

    const dataSet = data.reduce((acc: any[], current: any) => {
      const key = current.tournament_id;
      if (acc[key] == undefined) {
        acc[key] = {
          tournament_id: current.tournament_id,
          name: current.name,
          start_date: current.start_date,
          end_date: current.end_date,
          format: current.format,
          finished: current.finished,
          total_rounds: current.total_rounds,
          locations: new Set(),
          team_ids: new Set(),
        };
      }

      acc[key].locations.add(current.location_name);
      acc[key].team_ids.add(current.team_id);

      return acc;
    }, {});

    const tournaments = Object.values(dataSet).map((tournament: any) => ({
      ...tournament,
      locations: Array.from(tournament.locations),
      team_ids: Array.from(tournament.team_ids),
    }));

    return { tournaments: tournaments as Tournament[] };
  } catch (error) {
    console.log("Failed to fetch tournaments: ", error);
    throw new Error("Failed to fetch tournaments!");
  }
};

const getLastInsertedId = async () => {
  const [data]: any = await pool.query(`SELECT LAST_INSERT_ID() AS last_id`);

  return data[0].last_id as number;
};

export const insertTournament = async (tournament: TournamentWithoutId) => {
  try {
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

    const tournament_id = await getLastInsertedId();

    await Promise.all(
      tournament.locations.map((location) =>
        pool.query(
          `INSERT INTO tournament_locations (tournament_id, location_name)
          VALUES (?, ?)`,
          [tournament_id, location]
        )
      )
    );

    await Promise.all(
      tournament.team_ids.map((team_id) =>
        pool.query(`CALL AddTeamToTournament(?, ?)`, [tournament_id, team_id])
      )
    );

    await pool.query("CALL SetTournamentDetails(?)", [tournament_id]);
    await pool.query("CALL CreateInitialTournamentSchedule(?)", [
      tournament_id,
    ]);
  } catch (error) {
    console.log("Error adding new tournament: ", error);
    throw new Error("Failed creating new tournament!");
  }
};

export const fetchTournamentNameById = async (tournament_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT name FROM tournaments
      WHERE tournament_id = ?`,
      [tournament_id]
    );

    return data[0].name as string;
  } catch (error) {
    console.log("Error fetching tournament name: ", error);
    throw new Error("Failed to fetch tournament name!");
  }
};

export const fetchTournamentById = async (tournament_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT * FROM tournaments
      LEFT JOIN tournament_locations USING (tournament_id)
      WHERE tournament_id = ?`,
      [tournament_id]
    );

    const dataSet = data.reduce((acc: any[], current: any) => {
      const key = current.tournament_id;
      if (acc[key] == undefined) {
        acc[key] = {
          tournament_id: current.tournament_id,
          name: current.name,
          start_date: current.start_date,
          end_date: current.end_date,
          format: current.format,
          finished: current.finished,
          total_rounds: current.total_rounds,
          total_teams: current.total_teams,
          locations: new Set(),
        };
      }

      acc[key].locations.add(current.location_name);

      return acc;
    }, {});

    const tournament = Object.values(dataSet).map((tournament: any) => ({
      ...tournament,
      locations: Array.from(tournament.locations),
    }));

    return { tournament: tournament[0] as Tournament };
  } catch (error) {
    console.log("Error fetching tournament by id: ", error);
    throw new Error("Failed to fetch tournament!");
  }
};

export const fetchTournamentMatches = async (tournament_id: number) => {
  try {
    const [matches]: any = await pool.query(
      `SELECT 
            m.match_id AS match_id,
            m.tournament_id AS tournament_id,
            m.team1_id AS team1_id,
            m.team2_id AS team2_id,
            m.winner_team_id AS winner_team_id,
            m.match_date AS match_date,
            m.location AS location,
            m.round AS round,
            m.status AS status,
            t1.team_id AS team1_team_id,
            t1.name AS team1_name,
            t1.logo_url AS team1_logo_url,
            t1.founded_year AS team1_founded_year,
            t1.description AS team1_description,
            t2.team_id AS team2_team_id,
            t2.name AS team2_name,
            t2.logo_url AS team2_logo_url,
            t2.founded_year AS team2_founded_year,
            t2.description AS team2_description
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      WHERE m.tournament_id = ?`,
      [tournament_id]
    );

    const transformedMatches = matches.map(getTransformedMatch);

    return { matches: transformedMatches as TournamentMatch[] };
  } catch (error) {
    console.log("Error fetching tournament matches: ", error);
    throw new Error("Failed to fetch tournament matches!");
  }
};

export const setMatchDetails = async (
  match_id: number | string,
  match_date: Date | null,
  location: string | null
) => {
  try {
    await pool.query(
      `UPDATE matches
      SET match_date = ?,
          location = ?
      WHERE match_id = ?`,
      [match_date, location, match_id]
    );
  } catch (error) {
    console.log("Failed to update match details: ", error);
    throw new Error("Failed to update match details!");
  }
};

export const fetchSeries = async (filter: string) => {
  try {
    const whereClause =
      !filter || filter === "all"
        ? ""
        : `WHERE finished IS ${filter === "finished" ? "TRUE" : "FALSE"}`;
    const [data]: any = await pool.query(
      `SELECT * FROM series
      LEFT JOIN series_locations USING (series_id)
      ${whereClause}`
    );

    const dataSet = data.reduce((acc: any[], current: any) => {
      const key = current.series_id;
      if (acc[key] == undefined) {
        acc[key] = {
          series_id: current.series_id,
          name: current.name,
          start_date: current.start_date,
          end_date: current.end_date,
          format: current.format,
          team1_id: current.team1_id,
          team2_id: current.team2_id,
          team3_id: current.team3_id,
          type: current.type,
          total_rounds: current.total_rounds,
          finished: current.finished,
          locations: new Set(),
        };
      }

      acc[key].locations.add(current.location_name);

      return acc;
    }, {});

    const series = Object.values(dataSet).map((series: any) => ({
      ...series,
      locations: Array.from(series.locations),
    }));

    return { series: series as Series[] };
  } catch (error) {
    console.log("Failed to fetch series: ", error);
    throw new Error("Failed to fetch series!");
  }
};

export const insertSeries = async (series: SeriesWithoutId) => {
  try {
    await pool.query(
      `INSERT INTO series (name, format, type, start_date, end_date, total_rounds)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        series.name,
        series.format,
        series.type,
        series.start_date,
        series.end_date,
        series.type !== "trilateral" ? series.total_rounds : 2,
      ]
    );

    const series_id = await getLastInsertedId();

    await Promise.all(
      series.team_ids.map((team_id) =>
        pool.query(
          `INSERT INTO series_teams (series_id, team_id)
          VALUES (?, ?)`,
          [series_id, team_id]
        )
      )
    );

    await Promise.all(
      series.locations.map((location) =>
        pool.query(
          `INSERT INTO series_locations (series_id, location_name)
          VALUES (?, ?)`,
          [series_id, location]
        )
      )
    );

    await pool.query("CALL CreateInitialSeriesSchedule(?)", [series_id]);
  } catch (error) {
    console.log("Error inserting new series: ", error);
    throw new Error("Failed to create series!");
  }
};

export const fetchSeriesNameById = async (series_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT name FROM series
      WHERE series_id = ?`,
      [series_id]
    );

    return data[0].name as string;
  } catch (error) {
    console.log("Error fetching series name: ", error);
    throw new Error("Failed to fetch series name!");
  }
};

export const fetchSeriesById = async (series_id: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT * FROM series
      LEFT JOIN series_locations USING (series_id)
      WHERE series_id = ?`,
      [series_id]
    );

    const dataSet = data.reduce((acc: any[], current: any) => {
      const key = current.series_id;
      if (acc[key] == undefined) {
        acc[key] = {
          series_id: current.series_id,
          name: current.name,
          start_date: current.start_date,
          end_date: current.end_date,
          format: current.format,
          finished: current.finished,
          total_rounds: current.total_rounds,
          type: current.type,
          locations: new Set(),
        };
      }

      acc[key].locations.add(current.location_name);

      return acc;
    }, {});

    const series = Object.values(dataSet).map((series: any) => ({
      ...series,
      locations: Array.from(series.locations),
    }));

    return { series: series[0] as Series };
  } catch (error) {
    console.log("Error fetching series by id: ", error);
    throw new Error("Failed to fetch series!");
  }
};

export const fetchSeriesMatches = async (series_id: number) => {
  try {
    const [matches]: any = await pool.query(
      `SELECT 
          m.match_id AS match_id,
          m.tournament_id AS tournament_id,
          m.team1_id AS team1_id,
          m.team2_id AS team2_id,
          m.winner_team_id AS winner_team_id,
          m.match_date AS match_date,
          m.location AS location,
          m.round AS round,
          m.status AS status,
          t1.team_id AS team1_team_id,
          t1.name AS team1_name,
          t1.logo_url AS team1_logo_url,
          t1.founded_year AS team1_founded_year,
          t1.description AS team1_description,
          t2.team_id AS team2_team_id,
          t2.name AS team2_name,
          t2.logo_url AS team2_logo_url,
          t2.founded_year AS team2_founded_year,
          t2.description AS team2_description
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      WHERE m.series_id = ?`,
      [series_id]
    );

    const transformedMatches = matches.map(getTransformedMatch);

    return { matches: transformedMatches as SeriesMatch[] };
  } catch (error) {
    console.log("Error fetching series matches: ", error);
    throw new Error("Failed to fetch series matches!");
  }
};

export const updateMatchToss = async (
  match_id: number | string,
  toss_winner_id: number,
  toss_decision: string,
  other_team_id?: number
) => {
  try {
    await pool.query(
      `UPDATE matches
      SET toss_winner_id = ?,
          toss_decision = ?,
          status = ?
      WHERE match_id = ?`,
      [toss_winner_id, toss_decision, "started", match_id]
    );

    const batting_team_id =
      toss_decision === "batting" ? toss_winner_id : other_team_id;
    const bowling_team_id =
      other_team_id !== batting_team_id ? other_team_id : toss_winner_id;

    await pool.query("CALL CreateInningsForMatch(?, ?, ?, ?, 0)", [
      match_id,
      batting_team_id,
      bowling_team_id,
      1,
    ]);
  } catch (error) {
    console.log("Error updating match toss: ", error);
    throw new Error("Failed to update match toss!");
  }
};

export const insertInningsForMatch = async (
  match_id: number | string,
  batting_team_id: number,
  bowling_team_id: number,
  inning_number: number,
  target_score: number
) => {
  try {
    await pool.query("CALL CreateInningsForMatch(?, ?, ?, ?, ?)", [
      match_id,
      batting_team_id,
      bowling_team_id,
      inning_number,
      target_score,
    ]);
  } catch (error) {
    console.log("Error inserting innings for match: ", error);
    throw new Error("Failed to create innings for match!");
  }
};

export const setMatchToComplete = async (
  match_id: number | string,
  winner_team_id: number | null
) => {
  try {
    await pool.query(
      `UPDATE matches
      SET winner_team_id = ?,
          status = ?
      WHERE match_id = ?`,
      [winner_team_id, "completed", match_id]
    );
  } catch (error) {
    console.log("Error updating match status: ", error);
    throw new Error("Failed to update match status!");
  }
};

export const fetchMatchPlayers = async (team_id: number, limit: number) => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM team_players
      NATURAL JOIN players
      WHERE team_id = ?
      ORDER BY batting_order
      LIMIT ?`,
      [team_id, limit]
    );

    return { teamPlayers: players as PlayerWithTeam[] };
  } catch (error) {
    console.log("Error fetching team players having team id", team_id);
    throw new Error("Failed to fetch team players");
  }
};

export const fetchMatchBattingTeam = async (
  team_id: number,
  match_id: number | string,
  inning_id: number,
  limit: number
) => {
  try {
    const [players] = await pool.query(
      `SELECT * FROM team_players
      NATURAL JOIN players
      LEFT JOIN match_batting_performance USING (player_id)
      WHERE team_id = ?
      AND match_id = ?
      AND inning_id = ?
      ORDER BY batting_order
      LIMIT ?`,
      [team_id, match_id, inning_id, limit]
    );

    return { teamPlayers: players as BattingTeamPlayer[] };
  } catch (error) {
    console.log("Error fetching team players having team id", team_id);
    throw new Error("Failed to fetch team players");
  }
};

export const fetchMatchBowlingTeam = async (
  team_id: number,
  match_id: number | string,
  inning_id: number,
  limit: number
) => {
  try {
    const [players] = await pool.query(
      `SELECT *, ISNULL(bowling_order) AS null_bowling FROM team_players
      NATURAL JOIN players
      LEFT JOIN match_bowling_performance USING (player_id)
      WHERE team_id = ?
      AND match_id IS NULL OR match_id = ?
      AND inning_id IS NULL OR inning_id = ?
      ORDER BY null_bowling, bowling_order
      LIMIT ?`,
      [team_id, match_id, inning_id, limit]
    );

    return { teamPlayers: players as BowlingTeamPlayer[] };
  } catch (error) {
    console.log("Error fetching team players having team id", team_id);
    throw new Error("Failed to fetch team players");
  }
};

export const getExtrasCountByMatchId = async (match_id: number) => {
  const [data]: any = await pool.query(
    `SELECT
        COUNT(CASE WHEN type = 'No Ball' THEN 1 END) AS nb_count,
        COUNT(CASE WHEN type = 'Wide' THEN 1 END) AS wd_count,
        COUNT(CASE WHEN type = 'Bye' THEN 1 END) AS b_count,
        COUNT(CASE WHEN type = 'Leg Bye' THEN 1 END) AS lb_count,
        COUNT(CASE WHEN type = 'Penalty' THEN 1 END) AS p_count,
        COUNT(*) AS total_count
    FROM balls
    LEFT JOIN extras USING (ball_id)
    WHERE inning_id = (
        SELECT inning_id FROM innings
        WHERE match_id = ?
        ORDER BY number DESC
        LIMIT 1
    )
    AND is_legal IS FALSE`,
    [match_id]
  );

  return { extras_count: data[0] as ExtrasCount };
};

export const getOverBallsForMatch = async (
  inning_id: number,
  over_number: number
) => {
  const [data] = await pool.query(
    `SELECT *, type AS extra_type FROM balls
    LEFT JOIN extras USING (ball_id)
    WHERE inning_id = ?
      AND over_number = ?
    ORDER BY ball_number`,
    [inning_id, over_number]
  );

  return { balls: data as Ball[] };
};

const getBattingTeamId = (match: OngoingMatch) => {
  return match.innings.team_id === match.team1.team_id
    ? match.team1.team_id
    : match.team2.team_id;
};

const getBowlingTeamId = (match: OngoingMatch) => {
  return match.innings.team_id !== match.team1.team_id
    ? match.team1.team_id
    : match.team2.team_id;
};

export const fetchMatchById = async (match_id: number) => {
  // console.log("fetching match with id ", match_id);
  try {
    const [data]: any = await pool.query(
      `SELECT 
          m.match_id AS match_id,
          m.tournament_id AS tournament_id,
          m.team1_id AS team1_id,
          m.team2_id AS team2_id,
          m.winner_team_id AS winner_team_id,
          m.match_date AS match_date,
          m.location AS location,
          m.round AS round,
          m.status AS status,
          m.toss_winner_id AS toss_winner_id,
          m.toss_decision AS toss_decision,
          t1.team_id AS team1_team_id,
          t1.name AS team1_name,
          t1.logo_url AS team1_logo_url,
          t1.founded_year AS team1_founded_year,
          t1.description AS team1_description,
          t2.team_id AS team2_team_id,
          t2.name AS team2_name,
          t2.logo_url AS team2_logo_url,
          t2.founded_year AS team2_founded_year,
          t2.description AS team2_description,
          t.name AS tournament_name,
          t.format AS tournament_format,
          t.total_rounds AS tournament_rounds,
          s.name AS series_name,
          s.format AS series_format,
          s.total_rounds AS series_rounds,
          s.type AS series_type,
          i.inning_id AS inning_id,
          i.team_id AS batting_team_id,
          i.number AS inning_number,
          i.total_runs AS total_runs,
          i.total_wickets AS total_wickets,
          i.total_overs AS total_overs,
          i.target_score AS target_score,
          o.over_number AS over_number,
          o.bowler_id AS bowler_id,
          o.total_runs AS over_total_runs,
          o.total_wickets AS over_total_wickets
      FROM matches m
      LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
      LEFT JOIN series s ON m.series_id = s.series_id
      LEFT JOIN innings i ON m.match_id = i.match_id
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN overs o ON o.inning_id = i.inning_id
      WHERE m.match_id = ?
      ORDER BY inning_number DESC, over_number DESC`,
      [match_id]
    );

    // console.log("Data is ", data[0]);
    const { extras_count } = await getExtrasCountByMatchId(match_id);
    const { balls } = await getOverBallsForMatch(
      data[0].inning_id,
      data[0].over_number
    );
    // console.log("extras for match ", match_id, "is ", extras_count);

    const match = getMatchDetails(
      data[0],
      extras_count,
      balls
    ) as unknown as OngoingMatch;

    const battingTeamId = getBattingTeamId(match);
    const { teamPlayers: battingTeamPlayers } = await fetchMatchBattingTeam(
      battingTeamId,
      match.match_id,
      match.innings.inning_id,
      11
    );

    const bowlingTeamId = getBowlingTeamId(match);
    const { teamPlayers: bowlingTeamPlayers } = await fetchMatchBowlingTeam(
      bowlingTeamId,
      match.match_id,
      match.innings.inning_id,
      11
    );

    return {
      match,
      battingTeamPlayers,
      bowlingTeamPlayers,
    };
  } catch (error) {
    console.log("Error fetching match by id: ", error);
    throw new Error("Failed to fetch match!");
  }
};

export const insertBallForInning = async (ball: Ball) => {
  // console.log("submitting ball data: ", ball);
  await pool.query(
    `INSERT INTO balls (inning_id, over_number, ball_number, batsman_id, non_striker_id, bowler_id, runs_scored, is_wicket, is_legal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ball.inning_id,
      ball.over_number,
      ball.ball_number,
      ball.batsman_id,
      ball.non_striker_id,
      ball.bowler_id,
      ball.runs_scored,
      ball.is_wicket,
      ball.is_legal,
    ]
  );

  if (ball.dismissal) {
    const ball_id = await getLastInsertedId();
    await pool.query(
      `INSERT INTO dismissals (inning_id, ball_id, batsman_id, bowler_id, fielder_id, dismissal_type)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        ball.inning_id,
        ball_id,
        ball?.dismissal?.dismissed_batsman_id,
        ball.bowler_id,
        ball?.dismissal?.fielder_id,
        ball?.dismissal?.type,
      ]
    );
  }

  if (ball.extra) {
    const ball_id = await getLastInsertedId();
    await pool.query(
      `INSERT INTO extras (ball_id, type, runs)
      VALUES (?, ?, ?)`,
      [ball_id, ball?.extra?.type, ball?.extra?.runs]
    );
  }
};

export const fetchInningsDetails = async (match_id: number | string, inningNumber: number) => {
  try {
    const [data]: any = await pool.query(
      `SELECT * FROM innings
      WHERE match_id = ?
      AND number = ?`,
      [match_id, inningNumber]
    );

    return { innings: data[0] as OngoingInnings };
  } catch (error) {
    console.log("Error fetching inning details: ", error);
    throw new Error("Failed to fetch innings details!");
  }
}