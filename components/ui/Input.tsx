import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type KeyboardTypeOptions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  suffix?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType,
  suffix,
  disabled = false,
  multiline = false,
  numberOfLines,
  autoCapitalize = "none",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? COLORS.error
    : isFocused
      ? COLORS.primary
      : COLORS.outlineVariant;

  return (
    <View>
      {label && (
        <Text
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontFamily: "Inter_600SemiBold",
            color: COLORS.outline,
            marginBottom: 4,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.surfaceDim}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 0,
            fontSize: 14,
            color: COLORS.onSurface,
            backgroundColor: "transparent",
            fontFamily: "Inter_400Regular",
          }}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 8 }}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={COLORS.outline}
            />
          </TouchableOpacity>
        )}
        {suffix && (
          <Text
            style={{
              fontSize: 14,
              marginLeft: 8,
              color: COLORS.outline,
              fontFamily: "Inter_400Regular",
            }}
          >
            {suffix}
          </Text>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontSize: 12,
            marginTop: 4,
            color: COLORS.error,
            fontFamily: "Inter_400Regular",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
