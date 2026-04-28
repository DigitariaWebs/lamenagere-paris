import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../lib/constants";
import { pickVisualSearchImage } from "../lib/visual-search";

export default function SearchBar({ placeholder = "Rechercher La Ménagère" }: { placeholder?: string }) {
  const router = useRouter();

  const handleCamera = async () => {
    const uri = await pickVisualSearchImage();
    if (!uri) return;
    router.push({ pathname: "/(main)/search", params: { image: uri } });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingTop: 4,
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: COLORS.outlineVariant,
          paddingLeft: 18,
          paddingRight: 6,
          paddingVertical: 6,
          gap: 8,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(main)/search")}
          style={{ flex: 1 }}
        >
          <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
            {placeholder}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCamera} hitSlop={8}>
          <MaterialCommunityIcons name="camera-outline" size={20} color={COLORS.onSurface} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(main)/search")}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: COLORS.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="magnify" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
