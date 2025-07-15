import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

const SCREEN_WIDTH = Math.min(Dimensions.get("window").width, 400);
const NUM_COLUMNS = 7;
const NUM_ROWS = 6;
const ITEM_MARGIN = 2;
const ITEM_SIZE = (SCREEN_WIDTH - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

interface CalendarProps {
  year: number;
  month: number;
  onDayPress: (dateTag: string) => void;
}

export default function Calendar({ year, month, onDayPress }: CalendarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const currentDateTag = `${todayYear}${formatMonth(todayMonth)}${formatDay(todayDay)}`;


  return (
    <View style={styles.container}>
      {daysArray.map((item, i) => {
        const col = i % NUM_COLUMNS;
        let textColor = "#fff";
        let textOpacity = 1;
        if (item.type !== "current") textOpacity = 0.2;

        const isHovered = hoveredIdx === i;

        let dateTag = '';
        if (item.type !== 'empty' && item.year !== undefined && item.month !== undefined && item.day !== '') {
          dateTag = `${item.year}${formatMonth(item.month)}${formatDay(item.day)}`;
        }

        const isToday = item.type === 'current' && dateTag === currentDateTag;


        return (
          <Pressable
            key={i}
            onPressIn={() => setHoveredIdx(i)}
            onPressOut={() => setHoveredIdx(null)}
            onPress={() => {
              if (item.type !== 'empty') {
                onDayPress(dateTag);
              }
            }}
            style={[
              styles.item,
              {
                backgroundColor:
                  col === 0
                    ? "#b44c4c"
                    : col === 6
                    ? "#4a6fa5"
                    : "#212121",
                opacity: isHovered ? 0.7 : 1,
                zIndex: isHovered ? 1 : 0,
                borderColor: isToday ? "#4B72FA" : "transparent",
                borderWidth: isToday ? 4 : 0,
              },
            ]}
          >
            <ThemedText style={[styles.dayText, { color: textColor, opacity: textOpacity }]}>
              {item.day}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_MARGIN,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 5,
  },
});