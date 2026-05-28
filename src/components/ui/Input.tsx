import React from 'react';
import { TextInput, Text, View } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ label, value, onChangeText, keyboardType = 'default', placeholder }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 text-base"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );
};
