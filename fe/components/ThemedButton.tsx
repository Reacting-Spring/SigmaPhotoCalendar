import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ThemedButton({ title, onPress, disabled, style, textStyle }: ThemedButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#4B72FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: {
    backgroundColor: '#B0B0B0',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'NoonnuBasicGothicRegular',
  },
});