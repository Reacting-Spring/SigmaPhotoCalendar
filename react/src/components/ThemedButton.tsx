import React from "react";

interface ThemedButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
}

export function ThemedButton({ title, onPress, disabled, style, textStyle, type = "button" }: ThemedButtonProps) {
  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      style={{
        height: 40,
        width: "80%",
        maxWidth: 300,
        backgroundColor: disabled ? "#B0B0B0" : "#4B72FA",
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.2s",
        fontFamily: "NoonnuBasicGothicRegular",
        ...style,
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: 16,
          ...textStyle,
        }}
      >
        {title}
      </span>
    </button>
  );
}
