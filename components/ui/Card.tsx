import React from "react";
import { View, type ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  style?: ViewStyle;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  padding = "md",
  style,
}: CardProps) {
  return (
    <View
      className={`bg-white rounded-xl ${paddingMap[padding]}`}
      style={[
        {
          shadowColor: "rgba(26, 28, 28, 0.04)",
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 1,
          shadowRadius: 40,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
