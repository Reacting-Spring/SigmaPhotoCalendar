import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface ThemedInputProps extends TextInputProps {}

export function ThemedInput(props: ThemedInputProps) {
    const { style, ...otherProps } = props;

    return (
        <TextInput
            {...otherProps}
            style={[styles.input, style, { fontFamily: "NoonnuBasicGothicRegular" }]}
            placeholderTextColor="#aaa"
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    input: {
        width: "80%",
        maxWidth: 300,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
