import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Calendar from "@/components/Calendar";
import ImagePicker from "@/components/ImagePicker";
import { useCalendar } from "./CalendarContext";
import { ThemedButton } from "@/components/ThemedButton";
import axiosInstance from "@/api/AxiosInstance";
import useAuthStore from "@/store/AuthStore";
import "@/css/Dashboard.css";

export default function Dashboard() {
  const { year, month, setYear, setMonth } = useCalendar();
  const navigate = useNavigate();
  const [showImagePicker, setShowImagePicker] = useState(false);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const handlePhotoUpload = () => {
    setShowImagePicker(true);
  };

  const handleRightButton = () => {
    // 오른쪽 버튼 기능 (현재 비어있음)
    console.log("오른쪽 버튼 클릭");
  };

  const handleImagePickerClose = () => {
    setShowImagePicker(false);
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

      <div className="dashboard-action-buttons">
        <ThemedButton
          title="오늘 사진 업로드"
          onPress={handlePhotoUpload}
          className="dashboard-action-button dashboard-left-button"
        />
        <ThemedButton
          title="기능 준비중"
          onPress={handleRightButton}
          className="dashboard-action-button dashboard-right-button"
        />
      </div>

      <ThemedButton title="로그아웃" onPress={handleSignOut} color="#dc3545" />

      {showImagePicker && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal-content">
            <div className="dashboard-modal-header">
              <h2>오늘 사진 업로드</h2>
              <button onClick={handleImagePickerClose} className="dashboard-modal-close">
                ✕
              </button>
            </div>
            <ImagePicker formattedDate={getTodayFormatted()} onImageSelected={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
}
