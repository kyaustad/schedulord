import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  foreignKey,
  pgEnum,
  integer,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRoleEnum = pgEnum("role", ["admin", "user", "manager"]);
export const weekStartEnum = pgEnum("week_start", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const company = pgTable("company", {
  id: serial("id").primaryKey(),
  name: text().notNull(),
  createdAt: timestamp({ mode: "string" }).notNull(),
  updatedAt: timestamp({ mode: "string" }).notNull(),
  preferences: jsonb().default({}),
  weekStart: weekStartEnum("week_start").default("monday"),
});

export const location = pgTable(
  "location",
  {
    id: serial("id").primaryKey(),
    name: text().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    address: text().notNull(),
    companyId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
    }).onDelete("cascade"),
  ]
);

export const team = pgTable(
  "team",
  {
    id: serial("id").primaryKey(),
    name: text().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    color: text().notNull(),
    locationId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.locationId],
      foreignColumns: [location.id],
    }).onDelete("cascade"),
  ]
);

export const schedule = pgTable(
  "schedule",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    teamId: integer().notNull(),
    userId: text().notNull(),
    start: timestamp({ mode: "string" }).notNull(),
    end: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
    }).onDelete("cascade"),
  ]
);

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    first_name: text().notNull(),
    last_name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().notNull(),
    image: text(),
    role: userRoleEnum("role").default("admin").notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    companyId: integer(),
    locationId: integer(),
    teamId: integer(),
  },
  (table) => [
    unique("user_email_key").on(table.email),
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
    }).onDelete("set null"),

    foreignKey({
      columns: [table.locationId],
      foreignColumns: [location.id],
    }).onDelete("set null"),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
    }).onDelete("set null"),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp({ mode: "string" }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_userId_fkey",
    }).onDelete("cascade"),
    unique("session_token_key").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ mode: "string" }),
    refreshTokenExpiresAt: timestamp({ mode: "string" }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ mode: "string" }).notNull(),
    updatedAt: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_userId_fkey",
    }).onDelete("cascade"),
  ]
);

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  createdAt: timestamp({ mode: "string" }),
  updatedAt: timestamp({ mode: "string" }),
});
