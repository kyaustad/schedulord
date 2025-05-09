import { env } from "@/env/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This allows self-signed certificates
  },
});

export const db = drizzle(pool, { schema });
