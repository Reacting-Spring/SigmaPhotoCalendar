import axiosInstance from '@/api/AxiosInstance';
import { ThemedBox } from "@/components/ThemedBox";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { Link, Redirect } from 'expo-router';
import React, { useState } from "react";
import { View } from "react-native";

export default function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [saveSignIn, setSaveSignIn] = useState(false);

  const handleSignIn = async() => {
    console.log("로그인 시도:", { id, password }, `저장 여부: ${saveSignIn}`);
    try {
      const response = await axiosInstance.post('/signin', {id, password});
      console.log("로그인 성공:", response.data);
      return <Redirect href="/Dashboard" />;
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };
    
  const handleSaveSignIn = () => {
    setSaveSignIn(!saveSignIn);
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
      <Link href="/SignUp" style={{ padding: 8}}>
        <ThemedText style={{ color: '#4B72FA', marginTop: 16, fontSize: 16}}>계정이 없다면 회원가입</ThemedText>
      </Link>
      <ThemedBox 
        onPress={handleSaveSignIn}
        isChecked={saveSignIn}
        label="로그인 정보 저장"
      />
      <ThemedButton
        title="로그인"
        onPress={handleSignIn}
        disabled={!id || !password}
      />
    </View>
  );
}