import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../lib/constants";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  compact = false,
}: QuantitySelectorProps) {
  const handleDecrement = async () => {
    if (quantity > min) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = async () => {
    if (quantity < max) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onQuantityChange(quantity + 1);
    }
  };

  const size = compact ? "w-8 h-8" : "w-10 h-10";
  const iconSize = compact ? 16 : 20;

  return (
    <View className="flex-row items-center rounded-full overflow-hidden"
      style={{ backgroundColor: COLORS.surfaceContainerLow }}
    >
      <TouchableOpacity
        onPress={handleDecrement}
        className={`${size} items-center justify-center`}
        activeOpacity={0.7}
        disabled={quantity <= min}
        style={{ opacity: quantity <= min ? 0.3 : 1 }}
      >
        <MaterialCommunityIcons
          name="minus"
          size={iconSize}
          color={COLORS.onSurface}
        />
      </TouchableOpacity>

      <View className={compact ? "px-2" : "px-4"}>
        <Text
          className="text-sm font-semibold text-center"
          style={{
            color: COLORS.onSurface,
            minWidth: 20,
          }}
        >
          {quantity}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleIncrement}
        className={`${size} items-center justify-center`}
        activeOpacity={0.7}
        disabled={quantity >= max}
        style={{ opacity: quantity >= max ? 0.3 : 1 }}
      >
        <MaterialCommunityIcons
          name="plus"
          size={iconSize}
          color={COLORS.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
}
