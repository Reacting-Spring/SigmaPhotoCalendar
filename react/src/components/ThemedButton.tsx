import "@/css/ThemedButton.css";

interface ThemedButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function ThemedButton({ title, onPress, disabled, type = "button" }: ThemedButtonProps) {
  return (
    <button type={type} onClick={onPress} disabled={disabled} className="themed-button">
      <span className="themed-button-text">{title}</span>
    </button>
  );
}
