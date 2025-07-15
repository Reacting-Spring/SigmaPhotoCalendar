import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CalendarContext, useCalendar } from "./CalendarContext";

SplashScreen.preventAutoHideAsync();

function DashboardHeader() {
  const { year, month, setYear, setMonth } = useCalendar();

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={handlePrevMonth}>
        <Text style={{ fontSize: 20, color: "#4B72FA", paddingHorizontal: 8 }}>{"◀"}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontFamily: "NoonnuBasicGothicRegular", minWidth: 90, textAlign: "center" }}>
        {year}년 {month + 1}월
      </Text>
      <TouchableOpacity onPress={handleNextMonth}>
        <Text style={{ fontSize: 20, color: "#4B72FA", paddingHorizontal: 8 }}>{"▶"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    async function loadAppResources() {
      try {
        await Font.loadAsync({
          'NoonnuBasicGothicRegular': require('../assets/fonts/NoonnuBasicGothicRegular.otf'), // 경로가 정확한지 확인!
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync();
      }
    }

    loadAppResources();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CalendarContext.Provider value={{ year, month, setYear, setMonth }}>
      <Stack>
        <Stack.Screen
          name="SignIn"
          options={{
            title: "로그인",
            headerTitleStyle: {
              fontFamily: 'NoonnuBasicGothicRegular',
              fontWeight: 'bold',
              fontSize: 24
            },
            headerLeft: () => null
          }} />
        <Stack.Screen
          name="SignUp"
          options={{
            title: "회원가입",
            headerTitleStyle: {
              fontFamily: 'NoonnuBasicGothicRegular',
              fontWeight: 'bold',
              fontSize: 24
            },
            headerLeft: () => null
          }}
        />
        <Stack.Screen
          name="Dashboard"
          options={{
            headerTitle: () => <DashboardHeader />,
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: 'NoonnuBasicGothicRegular',
              fontWeight: 'bold',
              fontSize: 24
            },
            headerLeft: () => null
          }} />
        <Stack.Screen
          name="date/[date]"
          options={{
            headerTitle: () => null,
            headerTitleStyle: {
              fontFamily: 'NoonnuBasicGothicRegular',
              fontWeight: 'bold',
              fontSize: 24
            }
          }} />
      </Stack>
    </CalendarContext.Provider>
  );
}
