import dayjs from "dayjs";
import { useState, useEffect } from "react";
import UploadImage from "./UploadImage.jsx";
import ImageList from "./ImageList.jsx";

function Calendar({ year, month }) {
    const today = dayjs()
        .year(year)
        .month(month - 1); // 선택한 연도 & 월 설정
    const startDay = today.startOf("month").day(); // 해당 월의 시작 요일
    const daysInMonth = today.daysInMonth(); // 해당 월의 총 일수

    // 현재 날짜와 현재 월, 연도
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;
    const currentDate = dayjs().date();

    // 이전 달 정보 가져오기
    const prevMonth = today.subtract(1, "month");
    const daysInPrevMonth = prevMonth.daysInMonth();

    // 전체 날짜 배열 생성
    const days = [];

    // 이전 달 날짜 채우기
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ date: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // 이번 달 날짜 채우기
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: i, isCurrentMonth: true });
    }

    // 다음 달 날짜 채우기 (42칸 유지)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: i, isCurrentMonth: false });
    }

    // 날짜 클릭 시 모달 열기 위한 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCameraActivated, setIsCameraActivated] = useState(false);

    // 날짜 클릭 시 모달 열기
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    // 모달 열리고 닫힐 때 애니메이션 효과
    const [modalClass, setModalClass] = useState("bottom-[-100%]"); // 초기 상태: 화면 아래에 숨겨진 상태

    useEffect(() => {
        if (isModalOpen) {
            setModalClass("bottom-0"); // 모달 열리면 화면 하단에 고정
        } else {
            setModalClass("bottom-[-100%]"); // 모달 닫히면 화면 아래로 내려가게
        }
    }, [isModalOpen]);

    // 카메라 켜고 끄기
    function shiftCamera() {
        if (isCameraActivated) {
            setIsCameraActivated(false);
        } else {
            setIsCameraActivated(true);
        }
    }

    return (
        <>
            {/* 캘린더 날짜들 */}
            <div className="grid grid-cols-7 gap-2 bg-stone-500 text-white p-2">
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <div key={day} className="text-center text-xl">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {days.map((item, index) => {
                    const isSunday = index % 7 === 0; // 일요일
                    const isSaturday = index % 7 === 6; // 토요일

                    let textColor = "text-black"; // 기본 색상
                    let borderClass = ""; // 기본 테두리

                    // 오늘 날짜에 테두리를 추가 (오늘의 연도와 월일 때만)
                    if (
                        item.isCurrentMonth &&
                        item.date === currentDate &&
                        year === currentYear &&
                        month === currentMonth
                    ) {
                        borderClass = "border-2 border-gray-400"; // 현재 날짜 테두리 (옅은 회색)
                    }

                    if (item.isCurrentMonth) {
                        if (isSunday) textColor = "text-red-500";
                        if (isSaturday) textColor = "text-blue-500";
                    } else {
                        if (isSunday) textColor = "text-red-200";
                        else if (isSaturday) textColor = "text-blue-200";
                        else textColor = "text-gray-300";
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => item.isCurrentMonth && handleDateClick(item.date)} // 날짜 클릭 시 모달 열기
                            className={`pt-6 pb-6 text-center font-bold text-2xl
                                ${item.isCurrentMonth ? "cursor-pointer hover:bg-stone-100" : ""} 
                                ${textColor} ${borderClass}`}
                        >
                            {item.date}
                        </div>
                    );
                })}
            </div>

            {/* 날짜 선택 모달 */}
            {isModalOpen && selectedDate && (
                <div
                    className={`fixed inset-x-0 bottom-0 z-50 transform transition-all duration-300 ease-in-out ${modalClass}`}
                    style={{ height: "70%" }} // 모달 높이를 70%로 설정
                >
                    <div
                        className="bg-white shadow-lg rounded-t-lg p-6 w-full border border-gray-300"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">{selectedDate}일</h2>
                        {/* 모달 내용 */}
                        <div className="text-center">
                            {/* 여기에 날짜에 맞는 일정을 추가하거나 다른 내용을 넣을 수 있습니다 */}
                            <p>여기에 {selectedDate}일에 대한 내용이 표시됩니다.</p>
                        </div>
                        <button className="ml-2" onClick={shiftCamera}>
                            <img src="/camera.png" className="scale-70" alt="camera" />
                        </button>

                        {isCameraActivated && <UploadImage />}
                        {!isCameraActivated && <ImageList selectedDate={selectedDate} />}

                        {/* 닫기 버튼 */}
                        <button
                            className="bg-blue-500 text-white text-lg w-full p-2 mt-4 rounded-md"
                            onClick={() => setIsModalOpen(false)} // 모달 닫기
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
