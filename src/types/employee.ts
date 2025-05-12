export type Employee = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  first_name: string;
  last_name: string;
  locationId?: number | null;
  teamId?: number | null;
  companyId?: number | null;
};
