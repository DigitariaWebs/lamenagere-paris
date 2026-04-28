import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { COLORS } from "../../lib/constants";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function FilterPills({
  options,
  selected,
  onToggle,
}: FilterPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onToggle(option.value)}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: isSelected ? COLORS.primary : "transparent",
              borderWidth: 1,
              borderColor: isSelected
                ? COLORS.primary
                : `${COLORS.outlineVariant}33`,
            }}
          >
            <Text
              className="text-xs uppercase font-semibold tracking-wider"
              style={{
                color: isSelected ? COLORS.onPrimary : COLORS.onSurface,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
