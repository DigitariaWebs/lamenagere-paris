import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, DELIVERY_ESTIMATES } from "../../lib/constants";

export default function DeliveryEstimate() {
  return (
    <View>
      <Text
        className="text-[10px] uppercase tracking-widest font-semibold mb-3"
        style={{ color: COLORS.outline }}
      >
        DÉLAI DE LIVRAISON ESTIMÉ
      </Text>
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="truck-outline"
            size={16}
            color={COLORS.onSurface}
          />
          <Text
            className="text-sm"
            style={{ color: COLORS.onSurface }}
          >
            Métropole : {DELIVERY_ESTIMATES.METROPOLE}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="ferry"
            size={16}
            color={COLORS.onSurfaceVariant}
          />
          <Text
            className="text-sm"
            style={{ color: COLORS.onSurfaceVariant }}
          >
            Outre-mer : {DELIVERY_ESTIMATES.OUTRE_MER}
          </Text>
        </View>
      </View>
    </View>
  );
}
