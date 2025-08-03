import { useNavigate } from "react-router-dom";
import Calendar from "@/components/Calendar";
import { useCalendar } from "./CalendarContext";
import { ThemedButton } from "@/components/ThemedButton";
import axiosInstance from "@/api/AxiosInstance";
import useAuthStore from "@/store/AuthStore";
import "@/css/Dashboard.css";

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
    } catch (error: any) {}
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button onClick={handlePrevMonth} className="month-button">
          ◀
        </button>
        <h1 className="dashboard-title">
          {year}년 {month}월
        </h1>
        <button onClick={handleNextMonth} className="month-button">
          ▶
        </button>
      </div>
      <Calendar year={year} month={month - 1} onDayPress={handleDayPress} />
      <ThemedButton title="로그아웃" onPress={handleSignOut} />
    </div>
  );
}
