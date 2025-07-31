import { createContext, useContext, useState, ReactNode } from "react";

interface CalendarContextType {
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
}

export const CalendarContext = createContext<CalendarContextType | null>(null);

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return <CalendarContext.Provider value={{ year, month, setYear, setMonth }}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("CalendarContext not found");
  return ctx;
}
