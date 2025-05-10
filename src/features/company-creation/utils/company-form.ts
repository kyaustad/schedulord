import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required",
  }),
});

export const companyPreferencesFormSchema = z.object({
  location_name: z.string().min(3, {
    message: "Location is required",
  }),
  team_name: z.string().min(3, {
    message: "Team is required",
  }),
  user_name: z.string().min(3, {
    message: "User is required",
  }),
});

export type CreateCompanyFormSchema = z.infer<typeof companyFormSchema>;
export type CreateCompanyPreferencesFormSchema = z.infer<
  typeof companyPreferencesFormSchema
>;
