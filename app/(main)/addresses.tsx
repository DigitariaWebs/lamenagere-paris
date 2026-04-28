import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import { useAuthStore } from "../../features/auth/store";
import Button from "../../components/ui/Button";

export default function AddressesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addresses = user?.addresses || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Manrope_700Bold", color: COLORS.onSurface }}>
          Mes Adresses
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Add button */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: "#ffffff",
            borderRadius: 14,
            paddingVertical: 16,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: `${COLORS.outlineVariant}66`,
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.secondary} />
          <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: COLORS.secondary }}>
            Ajouter une adresse
          </Text>
        </TouchableOpacity>

        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <View
              key={addr.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface, marginBottom: 4 }}>
                    {addr.firstName} {addr.lastName}
                  </Text>
                  <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant, lineHeight: 20 }}>
                    {addr.street}{"\n"}{addr.postalCode} {addr.city}
                  </Text>
                  {addr.isDefault && (
                    <View style={{ marginTop: 8, alignSelf: "flex-start", backgroundColor: `${COLORS.primary}12`, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.primary }}>Par défaut</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity style={{ padding: 4 }}>
                    <MaterialCommunityIcons name="pencil-outline" size={18} color={COLORS.outline} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 4 }}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#f0ebe6", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <MaterialCommunityIcons name="map-marker-outline" size={28} color={COLORS.secondary} />
            </View>
            <Text style={{ fontSize: 15, fontFamily: "Manrope_700Bold", color: COLORS.onSurface, marginBottom: 4 }}>
              Aucune adresse
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant, textAlign: "center" }}>
              Ajoutez une adresse de livraison{"\n"}pour accélérer vos commandes
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
