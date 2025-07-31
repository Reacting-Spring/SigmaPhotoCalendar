import ImagePicker from "../../components/ImagePicker";
import { useParams } from "react-router-dom";
import React from "react";

export default function DateDetailScreen() {
  const { date } = useParams();
  const formattedDate =
    typeof date === "string" && date
      ? `${date.substring(0, 4)}년 ${parseInt(date.substring(4, 6), 10)}월 ${parseInt(date.substring(6, 8), 10)}일`
      : "날짜 없음";

  return (
    <div style={styles.container}>
      <div style={styles.text}>{formattedDate}</div>
      <ImagePicker formattedDate={formattedDate} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100vh",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
  },
};
