import Calendar from "@/components/Calendar";
import { useRouter } from 'expo-router';
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useCalendar } from "./CalendarContext";
import { ThemedButton } from "@/components/ThemedButton";
import axiosInstance from "@/api/AxiosInstance";
import * as SecureStore from 'expo-secure-store';

export default function Dashboard() {
  const { year, month } = useCalendar();
  const router = useRouter();

  const handleDayPress = (dateTag: string) => {
    router.push(`/date/${dateTag}`);
  };

  const handleSignOut = async() => {
    console.log("로그아웃 시도");
    try {
      await axiosInstance.post("/auth/logout");

      await SecureStore.deleteItemAsync('token');
      console.log("토큰 삭제 성공");

      delete axiosInstance.defaults.headers.common['Authorization'];
      console.log("Authorization 헤더 삭제 성공");

      console.log("로그아웃 성공");
      router.replace("/SignIn");
    } catch (error) {
      console.error("로그아웃 실패:", error.response ? error.response.data : error.message);
      alert("로그아웃에 실패했습니다.");
    }
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
      <ThemedButton title="로그아웃" onPress={handleSignOut} />
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