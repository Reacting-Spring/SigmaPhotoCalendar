import { useState } from "react";
import FormattedDate from "./FormattedDate.jsx";
import Calendar from "./Calendar.jsx";
import Logout from "./Logout.jsx";

function DashboardPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear()); // 현재 연도
    const [month, setMonth] = useState(today.getMonth() + 1); // 현재 월 (1~12)
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

    // 연도 변경
    const handleYearChange = (event) => {
        setYear(Number(event.target.value));
    };

    // 월 변경
    const handleMonthChange = (event) => {
        setMonth(Number(event.target.value));
    };

    return (
        <>
            <div className="flex flex-col">
                <div className="flex">
                    <button className="ml-2">
                        <img src="/menu.png" className="scale-70" alt="menu" />
                    </button>
                    <FormattedDate year={year} month={month} />
                    <button onClick={() => setIsModalOpen(true)}>
                        <img src="/down.png" className="scale-70" alt="down" />
                    </button>
                    <Logout />
                </div>

                {/* 연도 & 월 선택 모달 */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="bg-white shadow-lg rounded-lg p-6 w-80 border border-gray-300"
                            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
                        >
                            <h2 className="text-2xl font-bold text-center mb-4">연도 & 월 선택</h2>

                            {/* 연도 선택 */}
                            <select value={year} onChange={handleYearChange} className="w-full border p-2 text-lg mb-4">
                                {Array.from({ length: 10 }, (_, i) => {
                                    const optionYear = today.getFullYear() - i;
                                    return (
                                        <option key={optionYear} value={optionYear}>
                                            {optionYear}년
                                        </option>
                                    );
                                })}
                            </select>

                            {/* 월 선택 */}
                            <select
                                value={month}
                                onChange={handleMonthChange}
                                className="w-full border p-2 text-lg mb-4"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}월
                                    </option>
                                ))}
                            </select>

                            {/* 닫기 버튼 */}
                            <button
                                className="bg-blue-500 text-white text-lg w-full p-2 rounded-md"
                                onClick={() => setIsModalOpen(false)}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                )}

                {/* 선택된 연도 & 월이 반영된 캘린더 */}
                <Calendar year={year} month={month} />

                {/* 하단 버튼 */}
                <button
                    className="bg-stone-700 text-white text-2xl p-4 w-full transition duration-200 fixed bottom-0
                    active:bg-gradient-to-r active:from-blue-500 active:to-purple-500"
                >
                    + 새 일정
                </button>
            </div>
        </>
    );
}

export default DashboardPage;
