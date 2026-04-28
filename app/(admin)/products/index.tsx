import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminPlaceholder() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-bold" style={{ color: "#002444" }}>
          Admin — En cours de développement
        </Text>
      </View>
    </SafeAreaView>
  );
}
