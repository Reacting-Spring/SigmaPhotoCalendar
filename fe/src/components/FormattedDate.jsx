function FormattedDate({ year, month }) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1~12

    return (
        <>
            <p className="text-3xl font-bold pl-4 pt-4 pb-4 mt-2">
                {year ?? currentYear}년 {month ?? currentMonth}월
            </p>
        </>
    );
}

export default FormattedDate;
