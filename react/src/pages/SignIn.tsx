import useAuthStore from "../store/AuthStore";
import axiosInstance from "../api/AxiosInstance";
import { ThemedBox } from "../components/ThemedBox";
import { ThemedButton } from "../components/ThemedButton";
import { ThemedInput } from "../components/ThemedInput";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [user_id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [saveSignIn, setSaveSignIn] = useState(false);
  const navigate = useNavigate();
  const { access_token } = useAuthStore();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (access_token) {
      navigate("/");
    }
  }, [access_token, navigate]);

  const handleSignIn = async () => {
    console.log("로그인 시도:", { user_id, password }, `저장 여부: ${saveSignIn}`);
    try {
      const response = await axiosInstance.post("/auth/login", { user_id, password });

      if (response.status !== 200) {
        alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        return;
      }

      const { access_token } = response.data;
      useAuthStore.getState().setAccessToken(access_token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      navigate("/");
    } catch (error) {
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleSaveSignIn = () => {
    setSaveSignIn(!saveSignIn);
  };

  return (
    <>
      <div>아이디</div>
      <ThemedInput
        onChange={(e) => setId(e.target.value)}
        value={user_id}
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
      <Link to="/SignUp" style={{ padding: 8 }}>
        <div style={{ color: "#4B72FA", marginTop: 16, fontSize: 16 }}>계정이 없다면 회원가입</div>
      </Link>
      <ThemedBox onPress={handleSaveSignIn} isChecked={saveSignIn} label="로그인 정보 저장" />
      <ThemedButton title="로그인" onPress={handleSignIn} disabled={!user_id || !password} />
    </>
  );
}
