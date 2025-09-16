import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const brand = {
  bg: "#0b0b0c",
  card: "#12131a",
  border: "rgba(255,102,0,0.25)",
  fg: "#e8eaee",
  sub: "#9aa3b2",
  accent: "#ff6600",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
