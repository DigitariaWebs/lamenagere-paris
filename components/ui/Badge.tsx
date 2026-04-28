import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "outline";
}

export default function Badge({ label, variant = "primary" }: BadgeProps) {
  const styles = {
    primary: {
      bg: COLORS.primary,
      text: COLORS.onPrimary,
    },
    secondary: {
      bg: COLORS.secondaryContainer,
      text: COLORS.secondary,
    },
    success: {
      bg: COLORS.success,
      text: "#ffffff",
    },
    outline: {
      bg: "transparent",
      text: COLORS.onSurface,
    },
  };

  const s = styles[variant];

  return (
    <View
      className="rounded-full py-1 px-3"
      style={{
        backgroundColor: s.bg,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: COLORS.outlineVariant,
      }}
    >
      <Text
        className="text-[10px] uppercase font-semibold tracking-widest"
        style={{ color: s.text }}
      >
        {label}
      </Text>
    </View>
  );
}
