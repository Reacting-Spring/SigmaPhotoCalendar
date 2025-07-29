import ImagePicker from "@/components/ImagePicker";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DateDetailScreen() {
    const { date } = useLocalSearchParams();
    const formattedDate =
        typeof date === "string" && date
            ? `${date.substring(0, 4)}년 ${parseInt(date.substring(4, 6), 10)}월 ${parseInt(
                  date.substring(6, 8),
                  10
              )}일`
            : "날짜 없음";

    return (
        <View style={styles.container}>
            <ThemedText style={styles.text}>{formattedDate}</ThemedText>
            <ImagePicker formattedDate={formattedDate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#ccc",
        textAlign: "center",
    },
});
