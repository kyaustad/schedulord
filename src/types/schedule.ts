type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DailySchedule = {
  day: Day;
  start: Date;
  end: Date;
  userId: string;
  teamId: number;
  createdAt: Date;
  updatedAt: Date;
};
export type Schedule = {
  id: number;
  dailySchedules: DailySchedule[];
  userId: string;
  teamId: number;

  createdAt: Date;
  updatedAt: Date;
};
