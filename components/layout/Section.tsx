import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../lib/constants";

interface SectionProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export default function Section({
  title,
  actionLabel,
  onAction,
  children,
}: SectionProps) {
  return (
    <View className="mb-10">
      <View className="flex-row items-center justify-between px-6 mb-6">
        <Text
          className="text-xl font-bold"
          style={{
            color: COLORS.primary,
            fontFamily: "Manrope_700Bold",
          }}
        >
          {title}
        </Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction}>
            <Text
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: COLORS.secondary }}
            >
              {actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
