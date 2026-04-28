import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../lib/constants";

export default function PromoBanner() {
  return (
    <View
      style={{
        marginHorizontal: 12,
        marginTop: 4,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF7ED",
      }}
    >
      <MaterialCommunityIcons name="check-bold" size={14} color={COLORS.success} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: COLORS.success }}>
        Livraison gratuite
      </Text>
      <View style={{ width: 1, height: 14, backgroundColor: COLORS.outlineVariant }} />
      <MaterialCommunityIcons name="check-bold" size={14} color={COLORS.success} />
      <Text style={{ flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold", color: COLORS.success }}>
        Ajustement prix 30 j
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.success} />
    </View>
  );
}
