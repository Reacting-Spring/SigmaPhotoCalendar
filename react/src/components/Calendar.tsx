import { useEffect, useState } from "react";
import "@/css/Calendar.css";

const NUM_COLUMNS = 7;
const NUM_ROWS = 6;
const ITEM_MARGIN = 2;

function useScreenWidth(maxWidth: number = 300) {
  const getWidth = () => Math.min(window.innerWidth, maxWidth);
  const [width, setWidth] = useState(getWidth());

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

interface CalendarProps {
  year: number;
  month: number;
  onDayPress: (dateTag: string) => void;
}

export default function Calendar({ year, month, onDayPress }: CalendarProps) {
  const screenWidth = useScreenWidth();
  const ITEM_SIZE = (screenWidth - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevLastDate = new Date(prevYear, prevMonth + 1, 0).getDate();

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const daysArray = Array(NUM_COLUMNS * NUM_ROWS).fill({ day: "", type: "empty" });

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray[i] = {
      day: prevLastDate - firstDayOfWeek + i + 1,
      type: "prev",
      year: prevYear,
      month: prevMonth,
    };
  }
  for (let d = 1; d <= lastDate; d++) {
    daysArray[firstDayOfWeek + d - 1] = {
      day: d,
      type: "current",
      year: year,
      month: month,
    };
  }
  const nextDaysStart = firstDayOfWeek + lastDate;
  for (let i = nextDaysStart; i < NUM_COLUMNS * NUM_ROWS; i++) {
    daysArray[i] = {
      day: i - nextDaysStart + 1,
      type: "next",
      year: nextYear,
      month: nextMonth,
    };
  }

  const formatDay = (day: number) => String(day).padStart(2, "0");
  const formatMonth = (month: number) => String(month + 1).padStart(2, "0");

  const today = new Date();
  const currentDateTag = `${today.getFullYear()}${formatMonth(today.getMonth())}${formatDay(today.getDate())}`;

  return (
    <div className="calendar-container" style={{ width: screenWidth }}>
      {daysArray.map((item, i) => {
        const col = i % NUM_COLUMNS;
        const isToday =
          item.type === "current" && `${item.year}${formatMonth(item.month)}${formatDay(item.day)}` === currentDateTag;

        let dateTag = "";
        if (item.type !== "empty" && item.year !== undefined && item.month !== undefined && item.day !== "") {
          dateTag = `${item.year}${formatMonth(item.month)}${formatDay(item.day)}`;
        }

        const dayClass = `calendar-day ${item.type === "empty" ? "empty" : ""} ${
          col === 0 ? "sunday" : col === 6 ? "saturday" : "weekday"
        } ${isToday ? "today" : ""}`;

        const textClass = `calendar-day-text ${item.type === "current" ? "current" : "other"}`;

        return (
          <div
            key={i}
            onClick={() => {
              if (item.type !== "empty") {
                onDayPress(dateTag);
              }
            }}
            className={dayClass}
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              margin: ITEM_MARGIN,
            }}
          >
            <span className={textClass}>{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}
