import "@/css/ThemedButton.css";

interface ThemedButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  color?: string;
}

export function ThemedButton({ title, onPress, disabled, type = "button", color }: ThemedButtonProps) {
  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      className="themed-button"
      style={{ backgroundColor: color }}
    >
      <span className="themed-button-text">{title}</span>
    </button>
  );
}
