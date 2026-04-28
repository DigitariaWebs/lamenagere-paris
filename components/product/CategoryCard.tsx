import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../../lib/constants";
import type { Category } from "../../lib/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(main)/categories/${category.id}`)}
      activeOpacity={0.8}
      className="flex-row items-center gap-4 p-6"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceContainerLow,
      }}
    >
      {category.image ? (
        <Image
          source={{ uri: category.image }}
          style={{ width: 80, height: 80, borderRadius: 8 }}
          contentFit="cover"
        />
      ) : (
        <View
          className="rounded-xl items-center justify-center"
          style={{
            width: 80,
            height: 80,
            backgroundColor: COLORS.surfaceContainerLow,
          }}
        >
          <MaterialCommunityIcons
            name={(category.icon as any) || "shape"}
            size={32}
            color={COLORS.primary}
          />
        </View>
      )}
      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{
            color: COLORS.onSurface,
            fontFamily: "Manrope_700Bold",
          }}
        >
          {category.name}
        </Text>
        {category.description && (
          <Text
            className="text-xs mt-1"
            style={{ color: COLORS.onSurfaceVariant }}
          >
            {category.description}
          </Text>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={COLORS.outlineVariant}
      />
    </TouchableOpacity>
  );
}
