import { createAuthClient } from "better-auth/react";
import { env } from "@/env/env";
import { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

declare module "better-auth/react" {
  interface SignUpEmailParams {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
}

declare module "better-auth" {
  interface InferSignUpEmailCtx {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
}

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [inferAdditionalFields<typeof auth>()],
  user: {
    delete: {
      enabled: true,
    },
    additionalFields: {
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
      role: {
        type: "string",
        default: "admin",
        input: true,
        required: true,
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
