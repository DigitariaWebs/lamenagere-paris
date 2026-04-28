import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";

interface SearchBarProps {
  value: string;
  onChangeText: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "RECHERCHER",
}: SearchBarProps) {
  return (
    <View
      className="flex-row items-center rounded-lg py-2 px-4"
      style={{ backgroundColor: COLORS.surfaceContainerLow }}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color={COLORS.outline}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.surfaceDim}
        className="flex-1 ml-2 text-sm"
        style={{
          color: COLORS.onSurface,
          fontFamily: "Inter_400Regular",
        }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={COLORS.outline}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
