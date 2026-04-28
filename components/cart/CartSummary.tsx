import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";
import { formatPrice } from "../../lib/utils";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number | null;
  total: number;
}

export default function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant }}>
          Sous-total
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.onSurface }}>
          {formatPrice(subtotal)}
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant }}>
          Livraison estimée
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
          {shipping != null ? formatPrice(shipping) : "À déterminer"}
        </Text>
      </View>

      <View style={{ height: 1, backgroundColor: "#f0f0f0", marginBottom: 12 }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 15, fontFamily: "Manrope_700Bold", color: COLORS.primary }}>
          Total
        </Text>
        <Text style={{ fontSize: 18, fontFamily: "Manrope_700Bold", color: COLORS.secondary }}>
          {formatPrice(total)}
        </Text>
      </View>
    </View>
  );
}
