import { createContext, useContext } from "react";

export const CalendarContext = createContext<{
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
} | null>(null);

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("CalendarContext not found");
  return ctx;
}