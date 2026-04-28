import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  label: string;
  title: string;
}

export default function Stepper({
  currentStep,
  totalSteps,
  label,
  title,
}: StepperProps) {
  return (
    <View className="mb-6">
      <Text
        className="text-xs uppercase tracking-widest font-semibold mb-1"
        style={{ color: COLORS.outline }}
      >
        {label}
      </Text>
      <Text
        className="text-2xl font-bold mb-4"
        style={{
          color: COLORS.primaryContainer,
          fontFamily: "Manrope_700Bold",
        }}
      >
        {title}
      </Text>
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor:
                i < currentStep ? COLORS.primary : COLORS.surfaceDim,
            }}
          />
        ))}
      </View>
    </View>
  );
}
