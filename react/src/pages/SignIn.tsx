import useAuthStore from "@/store/AuthStore";
import axiosInstance from "@/api/AxiosInstance";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "@/components/Toast";
import "@/css/SignIn.css";

export default function SignIn() {
  const [user_id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { access_token } = useAuthStore();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  }, [access_token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user_id || !password) return;

    console.log("로그인 시도:", { user_id, password });
    try {
      const response = await axiosInstance.post("/auth/login", { user_id, password });

      if (response.status !== 200) {
        showErrorToast("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        return;
      }

      const { access_token } = response.data;
      useAuthStore.getState().setAccessToken(access_token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      navigate("/");
    } catch (error) {
      showErrorToast("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="left-text">아이디</div>
          <ThemedInput
            onChange={(e) => setId(e.target.value)}
            value={user_id}
            placeholder="아이디를 입력하세요"
            className="input-margin-bottom"
          />
        </div>
        <div className="input-container">
          <div className="left-text">비밀번호</div>
          <ThemedInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="비밀번호를 입력하세요"
            type="password"
          />
        </div>
        <ThemedButton title="로그인" type="submit" disabled={!user_id || !password} />
      </form>
    </div>
  );
}
