import React from "react";

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function ThemedInput(props: ThemedInputProps) {
  const { style, ...otherProps } = props;

  return (
    <input
      {...otherProps}
      style={{
        ...styles.input,
        ...(style as React.CSSProperties),
        fontFamily: "NoonnuBasicGothicRegular",
      }}
      placeholder={props.placeholder}
    />
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    height: "100%",
  },
  input: {
    width: "80%",
    maxWidth: 300,
    border: "1px solid gray",
    borderRadius: 20,
    padding: "10px 20px",
    outline: "none",
  },
};
