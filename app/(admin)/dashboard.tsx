import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import Card from "../../components/ui/Card";

const SHORTCUTS = [
  { label: "Produits", icon: "package-variant", path: "/(admin)/products" },
  { label: "Commandes", icon: "clipboard-list-outline", path: "/(admin)/orders" },
  { label: "Devis", icon: "file-document-outline", path: "/(admin)/quotes" },
  { label: "Messages", icon: "message-outline", path: "/(admin)/messages" },
  { label: "Mise en avant", icon: "star-outline", path: "/(admin)/featured" },
  { label: "Campagnes", icon: "bullhorn-outline", path: "/(admin)/campaigns" },
] as const;

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View className="px-6 py-4">
        <Text className="text-2xl" style={{ color: COLORS.primary, fontFamily: "Manrope_700Bold" }}>
          Tableau de bord
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 16 }}>
        <Card padding="lg">
          <Text className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: COLORS.outline }}>COMMANDES</Text>
          <Text className="text-3xl mt-1" style={{ color: COLORS.onSurface, fontFamily: "Manrope_700Bold" }}>0</Text>
        </Card>
        <Card padding="lg">
          <Text className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: COLORS.outline }}>DEVIS EN ATTENTE</Text>
          <Text className="text-3xl mt-1" style={{ color: COLORS.onSurface, fontFamily: "Manrope_700Bold" }}>0</Text>
        </Card>
        <Card padding="lg">
          <Text className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: COLORS.outline }}>MESSAGES NON LUS</Text>
          <Text className="text-3xl mt-1" style={{ color: COLORS.onSurface, fontFamily: "Manrope_700Bold" }}>0</Text>
        </Card>

        <Text className="text-[10px] uppercase tracking-widest font-semibold mt-2" style={{ color: COLORS.outline }}>
          GESTION
        </Text>
        {SHORTCUTS.map((s) => (
          <TouchableOpacity
            key={s.path}
            onPress={() => router.push(s.path as any)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 14,
              backgroundColor: "#fff",
              borderRadius: 12,
            }}
          >
            <MaterialCommunityIcons name={s.icon as any} size={20} color={COLORS.primary} />
            <Text style={{ flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: COLORS.onSurface }}>
              {s.label}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.outline} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
