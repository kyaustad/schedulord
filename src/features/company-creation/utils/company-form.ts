import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name is required",
  }),
});
export type CreateCompanyFormSchema = z.infer<typeof companyFormSchema>;
