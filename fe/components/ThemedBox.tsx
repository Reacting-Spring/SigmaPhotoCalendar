import { ThemedText } from "@/components/ThemedText";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ThemedBoxProps {
    onPress: () => void;
    isChecked?: boolean;
    label?: string;
}

export function ThemedBox({ onPress, isChecked, label }: ThemedBoxProps) {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
        {isChecked && <Icon name="check" size={18} color="white" />}
      </View>
        <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  checkedCheckbox: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  label: {
    fontSize: 16,
  },
});