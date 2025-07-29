import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import { useCalendar } from "./CalendarContext";
import { ThemedButton } from "../components/ThemedButton";
import axiosInstance from "../api/AxiosInstance";

export default function Dashboard() {
  const { year, month } = useCalendar();
  const navigate = useNavigate();

  const handleDayPress = (dateTag: string) => {
    navigate(`/date/${dateTag}`);
  };

  const handleSignOut = async () => {
    console.log("로그아웃 시도");
    try {
      await axiosInstance.post("/auth/logout");

      localStorage.removeItem("token"); // 웹에서는 SecureStore 대신 localStorage 사용
      console.log("토큰 삭제 성공");

      delete axiosInstance.defaults.headers.common["Authorization"];
      console.log("Authorization 헤더 삭제 성공");

      console.log("로그아웃 성공");
      router.replace("/SignIn");
    } catch (error: any) {
      console.error("로그아웃 실패:", error.response ? error.response.data : error.message);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <p style={{ paddingBottom: 24, fontSize: 24, fontWeight: "bold" }}>대시보드</p>
      <Calendar year={year} month={month} onDayPress={handleDayPress} />
      <ThemedButton title="로그아웃" onPress={handleSignOut} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
};
