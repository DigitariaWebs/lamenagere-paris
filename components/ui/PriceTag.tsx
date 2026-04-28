import React from "react";
import { Text } from "react-native";
import { COLORS } from "../../lib/constants";
import { formatPrice } from "../../lib/utils";

interface PriceTagProps {
  price: number;
  currency?: "EUR";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export default function PriceTag({
  price,
  currency = "EUR",
  size = "md",
}: PriceTagProps) {
  return (
    <Text
      className={`font-bold ${sizeStyles[size]}`}
      style={{
        color: COLORS.secondary,
        fontFamily: "Manrope_700Bold",
      }}
    >
      {formatPrice(price, currency)}
    </Text>
  );
}
