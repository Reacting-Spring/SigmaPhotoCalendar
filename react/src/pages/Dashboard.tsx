import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "@/components/Calendar";
import { useCalendar } from "@/context/calendar-context";
import axiosInstance from "@/api/AxiosInstance";
import useAuthStore from "@/store/AuthStore";
import { showErrorToast, showSuccessToast } from "@/components/Toast";
import "@/css/Dashboard.css";

export default function Dashboard() {
  const { year, month, goToPrevMonth, goToNextMonth } = useCalendar();
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDayPress = (dateTag: string) => {
    navigate(`/date/${dateTag}`);
  };

  const handleSignOutClick = () => {
    setShowLogoutModal(true);
  };

  const handleSignOutConfirm = async () => {
    console.log("로그아웃 시도");
    setIsLoggingOut(true);
    try {
      await axiosInstance.post("/auth/logout");
      useAuthStore.getState().clearAccessToken();
      showSuccessToast("로그아웃되었습니다.");
    } catch (error: any) {
      showErrorToast("로그아웃 중 오류가 발생했습니다.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleSignOutCancel = () => {
    setShowLogoutModal(false);
  };

  const handlePhotoUpload = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const formattedDate = getTodayFormatted();
    console.log(`${formattedDate}의 사진 업로드`);
    try {
      const formData = new FormData();
      formData.append("images", file);
      formData.append("date", formattedDate);
      await axiosInstance.post("/files/upload", formData);
      showSuccessToast("오늘의 사진이 성공적으로 업로드되었습니다.");
    } catch (error: any) {
      if (error.response?.status === 413) {
        showErrorToast("이미지 용량이 너무 큽니다. 다시 시도해주세요.");
      } else {
        showErrorToast("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="dashboard-container">
      {/* 숨겨진 카메라 input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="dashboard-hidden-input"
      />
      {/* 오른쪽 위 로그아웃 버튼 */}
      <button className="dashboard-logout-button" onClick={handleSignOutClick}>
        로그아웃
      </button>
      <div className="dashboard-header">
        <button onClick={goToPrevMonth} className="month-button">
          ◀
        </button>
        <h1 className="dashboard-title">
          {year}년 {month}월
        </h1>
        <button onClick={goToNextMonth} className="month-button">
          ▶
        </button>
      </div>
      <Calendar year={year} month={month - 1} onDayPress={handleDayPress} /> {/* Calendar는 0-indexed month를 기대 */}
      {/* 큰 정사각형 사진 촬영 버튼 */}
      <button className="dashboard-photo-button" onClick={handlePhotoUpload}>
        <div className="dashboard-photo-icon"></div> {/* 아이콘 제거, 원래대로 빈 div */}
      </button>
      <div className="dashboard-photo-text">당일 사진</div>
      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleSignOutCancel}>
          <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <h3>로그아웃 확인</h3>
            </div>
            <div className="logout-modal-body">
              <p>정말로 로그아웃하시겠습니까?</p>
            </div>
            <div className="logout-modal-actions">
              <button className="logout-modal-confirm" onClick={handleSignOutCancel} disabled={isLoggingOut}>
                취소
              </button>
              <button className="logout-modal-cancel" onClick={handleSignOutConfirm} disabled={isLoggingOut}>
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
