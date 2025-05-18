import type { Team } from "@/types/team";

export type Location = {
  id: number;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  address: string;
  companyId: number;
  teams?: Team[];
  hoursQuota: number;
};
