import Calendar from "@/components/Calendar";
import { useRouter } from 'expo-router';
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useCalendar } from "./CalendarContext";

export default function Dashboard() {
  const { year, month } = useCalendar();
  const router = useRouter();

  const handleDayPress = (dateTag: string) => {
    router.push(`/date/${dateTag}`);
  };

  return (
    <View
      style={styles.container}
    >
      <ThemedText
        style={{
          paddingBottom: 24
        }}
      >대시보드</ThemedText>
      <Calendar year={year} month={month} onDayPress={handleDayPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});