import { createAuthClient } from "better-auth/react";
import { env } from "@/env/env";
import { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [inferAdditionalFields<typeof auth>()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "admin",
        input: false,
        required: true,
      },
    },
  },
});
