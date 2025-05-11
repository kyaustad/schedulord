import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removePlural = (name: string) => {
  if (name.endsWith("s")) {
    return name.slice(0, -1);
  }
  return name;
};
