"use server";
import { cache } from "react";
import { env } from "@/env/env";

// Server-side only function to check for users
export const checkIfNoUsers = cache(async () => {
  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  try {
    const result = await pool.query("SELECT COUNT(*) FROM public.user");
    return result.rows[0].count === "0";
  } catch (error) {
    console.error("Error checking for users:", error);
    throw error;
  } finally {
    await pool.end();
  }
});
