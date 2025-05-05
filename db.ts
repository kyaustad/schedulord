import postgres from "postgres";
import { env } from "@/env/env";

const connectionString = env.DATABASE_URL;
const sql = postgres(connectionString);

export default sql;
