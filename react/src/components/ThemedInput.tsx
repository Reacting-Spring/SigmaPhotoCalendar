import React from "react";
import "@/css/ThemedInput.css";

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function ThemedInput(props: ThemedInputProps) {
  const { style, className, ...otherProps } = props;

  return (
    <input
      {...otherProps}
      className={`themed-input ${className || ""}`}
      style={style}
      placeholder={props.placeholder}
    />
  );
}
