import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import { formatDate } from "../../lib/utils";
import type { OrderTimelineEntry } from "../../lib/types";

interface OrderTimelineProps {
  timeline: OrderTimelineEntry[];
}

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <View className="gap-0">
      {timeline.map((entry, index) => {
        const isLast = index === timeline.length - 1;
        return (
          <View key={entry.status} className="flex-row gap-4">
            <View className="items-center">
              {entry.completed ? (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: COLORS.success }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={14}
                    color="#fff"
                  />
                </View>
              ) : (
                <View
                  className="w-6 h-6 rounded-full"
                  style={{
                    borderWidth: 2,
                    borderColor: entry.timestamp
                      ? COLORS.primary
                      : COLORS.surfaceDim,
                    backgroundColor: entry.timestamp
                      ? COLORS.primary
                      : "transparent",
                  }}
                />
              )}
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 32,
                    backgroundColor: entry.completed
                      ? COLORS.success
                      : COLORS.surfaceDim,
                  }}
                />
              )}
            </View>

            <View className="flex-1 pb-6">
              <Text
                className="text-sm font-semibold"
                style={{
                  color: entry.completed || entry.timestamp
                    ? COLORS.onSurface
                    : COLORS.surfaceDim,
                }}
              >
                {entry.label}
              </Text>
              {entry.timestamp && (
                <Text
                  className="text-xs mt-0.5"
                  style={{ color: COLORS.outline }}
                >
                  {formatDate(entry.timestamp)}
                </Text>
              )}
              {entry.note && (
                <Text
                  className="text-xs mt-1"
                  style={{ color: COLORS.onSurfaceVariant }}
                >
                  {entry.note}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
