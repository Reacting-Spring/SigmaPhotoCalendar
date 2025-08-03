import { useState, useEffect } from "react";
import "@/css/Toast.css";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // 애니메이션 완료 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`toast ${type} ${isVisible ? "" : "hidden"}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="toast-close-button"
      >
        ×
      </button>
    </div>
  );
}

// Toast 관리자 컴포넌트
interface ToastManagerProps {
  children: React.ReactNode;
}

export function ToastManager({ children }: ToastManagerProps) {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      duration: number;
    }>
  >([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 전역 함수로 등록
  useEffect(() => {
    (window as any).showToast = showToast;
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

// 편의 함수들
export const showSuccessToast = (message: string) => {
  if ((window as any).showToast) {
    (window as any).showToast(message, "success");
  }
};

export const showErrorToast = (message: string) => {
  if ((window as any).showToast) {
    (window as any).showToast(message, "error");
  }
};

export const showInfoToast = (message: string) => {
  if ((window as any).showToast) {
    (window as any).showToast(message, "info");
  }
};
