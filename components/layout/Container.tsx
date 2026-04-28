import React from "react";
import { View } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  padded?: boolean;
}

export default function Container({
  children,
  padded = true,
}: ContainerProps) {
  return (
    <View className={padded ? "px-6" : ""}>
      {children}
    </View>
  );
}
