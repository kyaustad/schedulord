import type { Location } from "@/types/location";

export type Company = {
  id: number;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  locations?: Location[];
  preferences?: {
    names: {
      location: string;
      team: string;
      user?: string;
      manager?: string;
    };
  };
};
