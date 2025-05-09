import { relations } from "drizzle-orm/relations";
import { user, session, account, company, location, team } from "./schema";

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const companyRelations = relations(company, ({ many }) => ({
  locations: many(location),
}));

export const locationRelations = relations(location, ({ one, many }) => ({
  company: one(company, {
    fields: [location.companyId],
    references: [company.id],
  }),
  teams: many(team),
}));

export const teamRelations = relations(team, ({ one }) => ({
  location: one(location, {
    fields: [team.locationId],
    references: [location.id],
  }),
}));
