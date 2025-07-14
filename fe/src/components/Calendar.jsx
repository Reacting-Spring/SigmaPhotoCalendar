import dayjs from "dayjs";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import UploadImage from "./UploadImage.jsx";
import ImageList from "./ImageList.jsx";

function Calendar({ year, month }) {
  // 선택한 연도 & 월 설정
  const today = useMemo(
    () =>
      dayjs()
        .year(year)
        .month(month - 1),
    [year, month]
  );
  const startDay = today.startOf("month").day(); // 해당 월의 시작 요일
  const daysInMonth = today.daysInMonth(); // 해당 월의 총 일수

  // 현재 날짜와 현재 월, 연도
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const currentDate = dayjs().date();

  // 이전 달 정보 가져오기
  const prevMonth = today.subtract(1, "month");
  const daysInPrevMonth = prevMonth.daysInMonth();

  // 전체 날짜 배열 생성 (메모이제이션)
  const days = useMemo(() => {
    const calendarDays = [];

    // 이전 달 날짜 채우기
    for (let i = startDay - 1; i >= 0; i--) {
      calendarDays.push({ date: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // 이번 달 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ date: i, isCurrentMonth: true });
    }

    // 다음 달 날짜 채우기 (42칸 유지)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({ date: i, isCurrentMonth: false });
    }

    return calendarDays;
  }, [startDay, daysInPrevMonth, daysInMonth]);

  // 모달 상태 관리
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedDate: null,
    isCameraActivated: false,
  });

  // 이전 선택된 날짜 추적
  const prevSelectedDateRef = useRef(null);

  // 날짜 클릭 시 모달 열기 (메모이제이션)
  const handleDateClick = useCallback(
    (date) => {
      // 이미 같은 날짜가 선택되어 있고 모달이 열려있는 경우 무시
      if (prevSelectedDateRef.current === date && modalState.isOpen) {
        return;
      }

      prevSelectedDateRef.current = date;

      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        selectedDate: date,
        isCameraActivated: false,
      }));
    },
    [modalState.isOpen]
  );

  // 모달 닫기 (메모이제이션)
  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      selectedDate: null,
      isCameraActivated: false,
    }));
  }, []);

  // 카메라 켜고 끄기 (메모이제이션)
  const toggleCamera = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isCameraActivated: !prev.isCameraActivated,
    }));
  }, []);

  return (
    <>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 bg-stone-500 text-white p-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="text-center text-xl">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {days.map((item, index) => {
          const isSunday = index % 7 === 0; // 일요일
          const isSaturday = index % 7 === 6; // 토요일
          const isToday =
            item.isCurrentMonth && item.date === currentDate && year === currentYear && month === currentMonth;

          // 날짜 색상 설정
          const textColor = item.isCurrentMonth
            ? isSunday
              ? "text-red-500"
              : isSaturday
              ? "text-blue-500"
              : "text-black"
            : isSunday
            ? "text-red-200"
            : isSaturday
            ? "text-blue-200"
            : "text-gray-300";

          return (
            <div
              key={index}
              onClick={() => item.isCurrentMonth && handleDateClick(item.date)}
              className={`pt-6 pb-6 text-center font-bold text-2xl
                         ${item.isCurrentMonth ? "cursor-pointer hover:bg-stone-100" : ""} 
                         ${textColor} ${isToday ? "border-2 border-gray-400" : ""}`}
            >
              {item.date}
            </div>
          );
        })}
      </div>

      {/* 날짜 선택 모달 */}
      {modalState.isOpen && modalState.selectedDate && (
        <div
          className={`fixed inset-x-0 bottom-0 z-50 transform transition-all duration-300 ease-in-out
                     ${modalState.isOpen ? "bottom-0" : "bottom-[-100%]"}`}
          style={{ height: "70%" }}
        >
          <div
            className="bg-white shadow-lg rounded-t-lg p-6 w-full border border-gray-300"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
          >
            <h2 className="text-2xl font-bold text-center mb-4">{modalState.selectedDate}일</h2>

            {/* 카메라 토글 버튼 */}
            <div className="flex justify-center mb-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={toggleCamera}>
                <img src="/camera.png" className="scale-70" alt="camera" />
              </button>
            </div>

            {/* 이미지 업로드 또는 이미지 목록 표시 */}
            {modalState.isCameraActivated ? (
              <UploadImage />
            ) : (
              <ImageList selectedDate={modalState.selectedDate} year={year} month={month} />
            )}

            {/* 닫기 버튼 */}
            <button
              className="bg-blue-500 text-white text-lg w-full p-2 mt-4 rounded-md hover:bg-blue-600 transition-colors"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;
