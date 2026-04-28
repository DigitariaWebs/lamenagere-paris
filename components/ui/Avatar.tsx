import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";
import { getInitials } from "../../lib/utils";

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
}

export default function Avatar({
  firstName,
  lastName,
  size = 48,
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: COLORS.primary,
      }}
    >
      <Text
        className="text-white font-bold"
        style={{
          fontSize: size * 0.38,
          fontFamily: "Manrope_700Bold",
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
