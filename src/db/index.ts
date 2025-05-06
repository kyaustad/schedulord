import { env } from "@/env/env";
import { drizzle } from "drizzle-orm/node-postgres";

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // This allows self-signed certificates
    },
  },
});
