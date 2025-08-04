import { useState, useEffect } from "react";
import "@/css/ConfirmDialog.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  details?: string[];
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  title,
  message,
  details,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  type = "warning",
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 200);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return "🗑";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  return (
    <div className={`confirm-overlay ${isVisible ? "visible" : ""}`}>
      <div className={`confirm-dialog ${type} ${isVisible ? "visible" : ""}`}>
        <div className="confirm-header">
          <span className="confirm-icon">{getIcon()}</span>
          <h3 className="confirm-title">{title}</h3>
        </div>

        <div className="confirm-content">
          <p className="confirm-message">{message}</p>

          {details && details.length > 0 && (
            <div className="confirm-details">
              <div className="details-list">
                {details.map((detail, index) => (
                  <div key={index} className="detail-item">
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="confirm-actions">
          <button className="confirm-button cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className={`confirm-button confirm ${type}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// 확인 다이얼로그 관리자 컴포넌트
interface ConfirmDialogManagerProps {
  children: React.ReactNode;
}

export function ConfirmDialogManager({ children }: ConfirmDialogManagerProps) {
  const [dialog, setDialog] = useState<{
    id: string;
    title: string;
    message: string;
    details?: string[];
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
  } | null>(null);

  const showConfirmDialog = (
    title: string,
    message: string,
    options: {
      details?: string[];
      confirmText?: string;
      cancelText?: string;
      type?: "danger" | "warning" | "info";
    } = {}
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substr(2, 9);

      setDialog({
        id,
        title,
        message,
        details: options.details,
        confirmText: options.confirmText,
        cancelText: options.cancelText,
        type: options.type,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  };

  // 전역 함수로 등록
  useEffect(() => {
    (window as any).showConfirmDialog = showConfirmDialog;
    return () => {
      delete (window as any).showConfirmDialog;
    };
  }, []);

  return (
    <>
      {children}
      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          details={dialog.details}
          onConfirm={dialog.onConfirm}
          onCancel={dialog.onCancel}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          type={dialog.type}
        />
      )}
    </>
  );
}

// 편의 함수들
export const showConfirm = (
  title: string,
  message: string,
  options: {
    details?: string[];
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
  } = {}
): Promise<boolean> => {
  if ((window as any).showConfirmDialog) {
    return (window as any).showConfirmDialog(title, message, options);
  }
  // 폴백으로 기본 confirm 사용
  return Promise.resolve(confirm(`${title}\n\n${message}`));
};

export const showDeleteConfirm = (itemName: string, details?: string[]): Promise<boolean> => {
  return showConfirm("삭제 확인", `"${itemName}"을(를) 삭제하시겠습니까?`, {
    details,
    confirmText: "삭제",
    cancelText: "취소",
    type: "danger",
  });
};

export const showMultiDeleteConfirm = (count: number, itemNames: string[]): Promise<boolean> => {
  return showConfirm("삭제 확인", `선택된 ${count}개의 이미지를 삭제하시겠습니까?`, {
    details: itemNames,
    confirmText: "삭제",
    cancelText: "취소",
    type: "danger",
  });
};
