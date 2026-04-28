import React from "react";
import { View } from "react-native";
import { COLORS } from "../../lib/constants";

interface DividerProps {
  color?: string;
  thickness?: number;
}

export default function Divider({
  color = COLORS.surfaceContainerLow,
  thickness = 1,
}: DividerProps) {
  return (
    <View
      style={{
        height: thickness,
        backgroundColor: color,
        width: "100%",
      }}
    />
  );
}
