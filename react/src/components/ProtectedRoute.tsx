import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { showErrorToast } from "./Toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { access_token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!access_token) {
      navigate("/login");
    }
  }, [access_token, navigate]);

  useEffect(() => {
    const handleAuthExpired = () => {
      showErrorToast("로그아웃되었습니다. 다시 로그인해주세요.");
      navigate("/login");
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [navigate]);

  if (!access_token) {
    return null;
  }

  return <>{children}</>;
}
