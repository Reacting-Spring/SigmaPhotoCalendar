import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import { useCalendar } from "./CalendarContext";
import { ThemedButton } from "../components/ThemedButton";
import axiosInstance from "../api/AxiosInstance";
import useAuthStore from "../store/AuthStore";

export default function Dashboard() {
  const { year, month, setYear, setMonth } = useCalendar();
  const navigate = useNavigate();

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDayPress = (dateTag: string) => {
    navigate(`/date/${dateTag}`);
  };

  const handleSignOut = async () => {
    console.log("로그아웃 시도");
    try {
      await axiosInstance.post("/auth/logout");
      useAuthStore.getState().clearAccessToken();
      window.dispatchEvent(new CustomEvent("auth-expired"));
      navigate("/login");
    } catch (error: any) {
      console.error("로그아웃 실패:", error.response ? error.response.data : error.message);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={handlePrevMonth}
          style={styles.monthButton}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          ◀
        </button>
        <h1 style={styles.title}>
          {year}년 {month}월
        </h1>
        <button
          onClick={handleNextMonth}
          style={styles.monthButton}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          ▶
        </button>
      </div>
      <Calendar year={year} month={month - 1} onDayPress={handleDayPress} />
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
    padding: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
    minWidth: 120,
    textAlign: "center",
  },
  monthButton: {
    fontSize: 20,
    color: "#4B72FA",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: 4,
    transition: "background-color 0.2s",
  },
};
