import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../lib/constants";
import { formatDate, formatPrice } from "../../../lib/utils";
import {
  useOrdersStore,
  ORDER_STATUS_LABELS,
  nextStatus,
} from "../../../features/orders/store";

export default function AdminOrdersScreen() {
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);
  const advance = useOrdersStore((s) => s.advanceStatus);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: COLORS.primary, fontFamily: "Manrope_700Bold" }}>
          Commandes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 12 }}>
        {orders.length === 0 ? (
          <Text style={{ fontSize: 13, color: COLORS.outline, fontFamily: "Inter_400Regular", marginTop: 40, textAlign: "center" }}>
            Aucune commande pour l'instant.
          </Text>
        ) : (
          orders.map((order) => {
            const next = nextStatus(order.status);
            const firstItem = order.items[0];
            return (
              <View
                key={order.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 14,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }}>
                    #{order.orderNumber}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color: COLORS.outline }}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                {firstItem && (
                  <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurface }} numberOfLines={1}>
                    {firstItem.product.name} × {firstItem.quantity}
                  </Text>
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ backgroundColor: `${COLORS.primary}18`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontFamily: "Inter_600SemiBold", color: COLORS.primary }}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: COLORS.secondary }}>
                    {formatPrice(order.total)}
                  </Text>
                </View>
                {next && (
                  <TouchableOpacity
                    onPress={() => advance(order.id)}
                    style={{
                      marginTop: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      paddingVertical: 10,
                      borderRadius: 9999,
                      backgroundColor: COLORS.primary,
                    }}
                  >
                    <MaterialCommunityIcons name="arrow-right" size={14} color="#fff" />
                    <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" }}>
                      Passer à : {ORDER_STATUS_LABELS[next]}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
