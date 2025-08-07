import { useEffect, useState } from "react";
import { useCalendar } from "@/context/calendar-context";
import "@/css/Calendar.css";

const NUM_COLUMNS = 7;
const NUM_ROWS = 6;
const ITEM_MARGIN = 2;
const SWIPE_THRESHOLD = 50; // 슬라이드 인식을 위한 최소 이동 거리 (px)
const ANIMATION_DURATION = 200; // 애니메이션 지속 시간 (ms)

function useScreenWidth(maxWidth: number = 350) {
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
  month: number; // 0-indexed month
  onDayPress: (dateTag: string) => void;
}

export default function Calendar({ year, month, onDayPress }: CalendarProps) {
  const { goToPrevMonth, goToNextMonth } = useCalendar();
  const screenWidth = useScreenWidth();
  const ITEM_SIZE = (screenWidth - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (transitioning) return;
    setIsSwiping(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    setCurrentX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      setTransitioning(true);
      if (deltaX > 0) {
        goToPrevMonth();
      } else {
        goToNextMonth();
      }
      setTimeout(() => {
        setTransitioning(false);
        setStartX(0);
        setCurrentX(0);
      }, ANIMATION_DURATION);
    } else {
      setTransitioning(true);
      setTimeout(() => {
        setTransitioning(false);
        setStartX(0);
        setCurrentX(0);
      }, ANIMATION_DURATION);
    }
  };

  const transformX = isSwiping ? currentX - startX : 0;

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
    <div
      className="calendar-container"
      style={{
        width: screenWidth,
        transform: `translateX(${transformX}px)`,
        transition: transitioning ? `transform ${ANIMATION_DURATION}ms ease-out` : "none",
        touchAction: "pan-y",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (isSwiping) {
          // TypeScript 오류 해결: unknown을 거쳐 PointerEvent로 캐스팅
          handlePointerUp({
            clientX: currentX,
            currentTarget: { releasePointerCapture: () => {} },
          } as unknown as React.PointerEvent);
        }
      }}
    >
      {daysArray.map((item, i) => {
        const col = i % NUM_COLUMNS;
        const isToday =
          item.type === "current" && `${item.year}${formatMonth(item.month)}${formatDay(item.day)}` === currentDateTag;

        // TypeScript 오류 해결: dateTag를 const로 선언하고 즉시 할당
        const dateTag =
          item.type !== "empty" && item.year !== undefined && item.month !== undefined && item.day !== ""
            ? `${item.year}${formatMonth(item.month)}${formatDay(item.day)}`
            : "";

        const dayClass = `calendar-day ${item.type === "empty" ? "empty" : ""} ${
          col === 0 ? "sunday" : col === 6 ? "saturday" : "weekday"
        } ${isToday ? "today" : ""}`;
        const textClass = `calendar-day-text ${item.type === "current" ? "current" : "other"}`;

        return (
          <div
            key={i}
            onClick={() => {
              if (item.type !== "empty" && !isSwiping && Math.abs(currentX - startX) < 5) {
                onDayPress(dateTag);
              }
            }}
            className={dayClass}
            style={{
              width: ITEM_SIZE,
              height: ITEM_SIZE + 10,
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
