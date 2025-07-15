import axiosInstance from '@/api/AxiosInstance';
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { Link, Redirect } from 'expo-router';
import { useState } from "react";
import { View } from "react-native";

export default function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async() => {
    console.log("회원가입 시도:", { id, password });
    try {
      const response = await axiosInstance.post('/signup', {id, password});
      console.log("회원가입 성공:", response.data);
      return <Redirect href="/SignIn" />;
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>아이디</ThemedText>
      <ThemedInput
        onChangeText={setId}
        value={id}
        placeholder="아이디를 입력하세요"
        keyboardType="default"
        style={{ marginBottom: 24 }}
      />
      <ThemedText>비밀번호</ThemedText>
      <ThemedInput
        onChangeText={setPassword}
        value={password}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        keyboardType="default"
      />
      <Link href="/SignIn" style={{ padding: 8 }}>
        <ThemedText style={{ color: '#4B72FA', marginTop: 16, fontSize: 16 }}>이미 계정이 있다면 로그인</ThemedText>
      </Link>
      <ThemedButton
        title="회원가입"
        onPress={handleSignUp}
        disabled={!id || !password}
        />
    </View>
  );
}