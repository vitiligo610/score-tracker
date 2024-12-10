import { createConnection } from "./db";

const db = await createConnection();

export const fetchPlayers = async () => {
  try {
    const [players] = await db.query("SELECT * FROM players");

    return players;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch players data.");
  }
};
