import type { Location } from "@/types/location";
import type { Team } from "@/types/team";

export type Company = {
  id: number;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  locations?: Location[];
  teams?: Team[];
};
