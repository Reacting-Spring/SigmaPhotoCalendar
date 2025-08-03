import { useState } from "react";

import ImagePicker from "@/components/ImagePicker";
import ImageList from "@/components/ImageList";
import { useParams } from "react-router-dom";
import "@/css/DateDetail.css";

export default function DateDetailScreen() {
  const [imageShowing, setImageShowing] = useState(true);

  const { date } = useParams();
  const koreanDate =
    typeof date === "string" && date
      ? `${date.substring(0, 4)}년 ${parseInt(date.substring(4, 6), 10)}월 ${parseInt(date.substring(6, 8), 10)}일`
      : "날짜 없음";

  const formatDate = `${date?.substring(0, 4)}-${date?.substring(4, 6)}-${date?.substring(6, 8)}`;

  return (
    <>
      <div className="date-container">
        <div className="date-text">{koreanDate}</div>
        {imageShowing ? <ImageList formattedDate={formatDate} /> : <ImagePicker formattedDate={formatDate} />}
      </div>
      <button className="mode-change" onClick={() => (imageShowing ? setImageShowing(false) : setImageShowing(true))}>
        {imageShowing ? <>📷</> : <>🖼️</>}
      </button>
    </>
  );
}
