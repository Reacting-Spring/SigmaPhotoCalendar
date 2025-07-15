import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {}

export function ThemedText(props: ThemedTextProps) {
  const { style, ...otherProps } = props;

  return (
    <Text
      {...props}
      style={[styles.defaultFont, style]}
    />
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'NoonnuBasicGothicRegular',
    fontSize: 20
  },
});