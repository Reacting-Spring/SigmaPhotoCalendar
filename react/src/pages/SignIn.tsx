import useAuthStore from "../store/AuthStore";
import axiosInstance from "../api/AxiosInstance";
import { ThemedBox } from "../components/ThemedBox";
import { ThemedButton } from "../components/ThemedButton";
import { ThemedInput } from "../components/ThemedInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [user_id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [saveSignIn, setSaveSignIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    console.log("로그인 시도:", { user_id, password }, `저장 여부: ${saveSignIn}`);
    try {
      const response = await axiosInstance.post("/auth/login", { user_id, password });
      console.log("로그인 성공:", response.data);

      const token = response.data;

      if (token) {
        if (saveSignIn) {
          await useAuthStore.getState().setAccessToken(token);
          console.log("토큰 저장 성공");
        }

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        console.error("로그인 실패: 토큰이 없습니다.");
      }

      return navigate("/Dashboard");
    } catch (error) {
      console.error("로그인 실패:", error);
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
        onChangeText={setId}
        value={user_id}
        placeholder="아이디를 입력하세요"
        keyboardType="default"
        style={{ marginBottom: 24 }}
      />
      <div>비밀번호</div>
      <ThemedInput
        onChangeText={setPassword}
        value={password}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        keyboardType="default"
      />
      <Link to="/SignUp" style={{ padding: 8 }}>
        <div style={{ color: "#4B72FA", marginTop: 16, fontSize: 16 }}>계정이 없다면 회원가입</div>
      </Link>
      <ThemedBox onPress={handleSaveSignIn} isChecked={saveSignIn} label="로그인 정보 저장" />
      <ThemedButton title="로그인" onPress={handleSignIn} disabled={!user_id || !password} />
    </>
  );
}
