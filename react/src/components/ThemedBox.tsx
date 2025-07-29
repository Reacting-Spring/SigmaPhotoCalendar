import React from "react";
import { FaCheck } from "react-icons/fa"; // 웹 아이콘 대체
// ThemedText가 따로 없다면 그냥 <span>으로 대체 가능

interface ThemedBoxProps {
  onPress: () => void;
  isChecked?: boolean;
  label?: string;
}

export function ThemedBox({ onPress, isChecked, label }: ThemedBoxProps) {
  return (
    <div style={styles.checkboxContainer} onClick={onPress}>
      <div
        style={{
          ...styles.checkbox,
          ...(isChecked ? styles.checkedCheckbox : {}),
        }}
      >
        {isChecked && <FaCheck size={12} color="white" />}
      </div>
      <span style={styles.label}>{label}</span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  checkboxContainer: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    marginBottom: 10,
    cursor: "pointer",
  },
  checkbox: {
    width: 20,
    height: 20,
    border: "1px solid #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 4,
  },
  checkedCheckbox: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  label: {
    fontSize: 16,
  },
};
