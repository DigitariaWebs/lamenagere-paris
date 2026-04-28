import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../lib/constants";
import { formatPrice, formatDate } from "../../lib/utils";
import type { Order } from "../../lib/types";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(main)/orders/${order.id}`)}
      activeOpacity={0.9}
    >
      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: COLORS.outline }}
            >
              COMMANDE
            </Text>
            <Text
              className="font-bold"
              style={{
                color: COLORS.onSurface,
                fontFamily: "Manrope_700Bold",
              }}
            >
              {order.orderNumber}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm" style={{ color: COLORS.secondary }}>
            {order.items.length} article{order.items.length > 1 ? "s" : ""}{" "}
            · {formatPrice(order.total)}
          </Text>
          <Text
            className="text-xs"
            style={{ color: COLORS.outline }}
          >
            {formatDate(order.createdAt)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
