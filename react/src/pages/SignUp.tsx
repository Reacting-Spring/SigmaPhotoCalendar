import axiosInstance from "../api/AxiosInstance";
import { ThemedButton } from "../components/ThemedButton";
import { ThemedInput } from "../components/ThemedInput";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

export default function SignUp() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { access_token } = useAuthStore();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  }, [access_token, navigate]);

  const handleSignUp = async () => {
    console.log("회원가입 시도:", { id, password });
    try {
      const response = await axiosInstance.post("/signup", { id, password });
      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div>아이디</div>
      <ThemedInput
        onChange={(e) => setId(e.target.value)}
        value={id}
        placeholder="아이디를 입력하세요"
        style={{ marginBottom: 24 }}
      />
      <div>비밀번호</div>
      <ThemedInput
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="비밀번호를 입력하세요"
        type="password"
      />
      <Link to="/login" style={{ padding: 8 }}>
        <div style={{ color: "#4B72FA", marginTop: 16, fontSize: 16 }}>이미 계정이 있다면 로그인</div>
      </Link>
      <ThemedButton title="회원가입" onPress={handleSignUp} disabled={!id || !password} />
    </div>
  );
}
