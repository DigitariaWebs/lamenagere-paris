import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "../../lib/mock-data";
import {
  sendLocalCampaign,
  ensureNotificationPermission,
  type CampaignTarget,
} from "../../lib/notifications";
import Button from "../../components/ui/Button";

type TargetKind = "home" | "product" | "category";

export default function CampaignsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("Nouveauté chez La Ménagère");
  const [body, setBody] = useState("Découvrez notre dernière collection.");
  const [targetKind, setTargetKind] = useState<TargetKind>("home");
  const [productId, setProductId] = useState(MOCK_PRODUCTS[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0]?.id ?? "");
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const requestPermission = async () => {
    const granted = await ensureNotificationPermission();
    setPermissionGranted(granted);
    if (!granted) {
      Alert.alert("Permission refusée", "Activez les notifications dans les paramètres système.");
    }
  };

  const sendTest = async () => {
    let target: CampaignTarget = { kind: "home" };
    if (targetKind === "product") target = { kind: "product", id: productId };
    if (targetKind === "category") target = { kind: "category", id: categoryId };

    const ok = await sendLocalCampaign({
      title,
      body,
      target,
      delaySeconds: 2,
    });

    if (!ok) {
      Alert.alert("Notification non envoyée", "Permission requise.");
      return;
    }
    Alert.alert("Programmée", "La notification arrivera dans ~2 secondes.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: COLORS.primary, fontFamily: "Manrope_700Bold" }}>
          Campagnes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 16 }}>
        <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.outline, lineHeight: 18 }}>
          Envoyez une notification de test à cet appareil. Quand un backend sera connecté, la même
          interface enverra à toute la base utilisateurs via Expo push.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: "#fff",
          }}
        >
          <MaterialCommunityIcons name="bell-ring-outline" size={18} color={COLORS.primary} />
          <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.onSurface }}>
            {permissionGranted === true
              ? "Permissions accordées"
              : permissionGranted === false
                ? "Permissions refusées — réessayer"
                : "Demander la permission"}
          </Text>
        </TouchableOpacity>

        <Field label="Titre">
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: COLORS.onSurface, paddingVertical: 8 }}
          />
        </Field>

        <Field label="Message">
          <TextInput
            value={body}
            onChangeText={setBody}
            multiline
            style={{ fontSize: 14, fontFamily: "Inter_400Regular", color: COLORS.onSurface, paddingVertical: 8, minHeight: 60 }}
          />
        </Field>

        <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.outline, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
          Cible
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["home", "product", "category"] as TargetKind[]).map((k) => (
            <TouchableOpacity
              key={k}
              onPress={() => setTargetKind(k)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 9999,
                backgroundColor: targetKind === k ? COLORS.primary : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter_600SemiBold",
                  color: targetKind === k ? "#fff" : COLORS.onSurfaceVariant,
                }}
              >
                {k === "home" ? "Accueil" : k === "product" ? "Produit" : "Catégorie"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {targetKind === "product" && (
          <Picker
            label="Produit"
            value={productId}
            onChange={setProductId}
            options={MOCK_PRODUCTS.map((p) => ({ value: p.id, label: p.name }))}
          />
        )}
        {targetKind === "category" && (
          <Picker
            label="Catégorie"
            value={categoryId}
            onChange={setCategoryId}
            options={MOCK_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
          />
        )}

        <Button label="ENVOYER LA NOTIFICATION TEST" onPress={sendTest} size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.outline, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12 }}>{children}</View>
    </View>
  );
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <View>
      <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.outline, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <TouchableOpacity
              key={o.value}
              onPress={() => onChange(o.value)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor: active ? COLORS.primary : "#fff",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Inter_500Medium",
                  color: active ? "#fff" : COLORS.onSurface,
                }}
              >
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
