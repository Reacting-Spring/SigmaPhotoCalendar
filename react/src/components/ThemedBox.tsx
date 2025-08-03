import { FaCheck } from "react-icons/fa";
import "@/css/ThemedBox.css";

interface ThemedBoxProps {
  onPress: () => void;
  isChecked?: boolean;
  label?: string;
}

export function ThemedBox({ onPress, isChecked, label }: ThemedBoxProps) {
  return (
    <div className="themed-box-container" onClick={onPress}>
      <div className={`themed-box-checkbox ${isChecked ? "checked" : ""}`}>
        {isChecked && <FaCheck size={12} color="white" />}
      </div>
      <span className="themed-box-label">{label}</span>
    </div>
  );
}
