import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env/env";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "admin",
        input: true,
        required: true,
      },
      first_name: {
        type: "string",
        required: true,
        input: true,
      },
      last_name: {
        type: "string",
        required: true,
        input: true,
      },
      companyId: {
        type: "number",
        required: false,
        input: true,
      },
      locationId: {
        type: "number",
        required: false,
        input: true,
      },
      teamId: {
        type: "number",
        required: false,
        input: true,
      },
    },
  },
});
