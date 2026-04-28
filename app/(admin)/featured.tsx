import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, getProductImage } from "../../lib/mock-data";
import { useFeaturedStore, type HeroSlide } from "../../features/featured/store";
import Button from "../../components/ui/Button";

type Tab = "products" | "slides";

export default function AdminFeaturedScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const featuredIds = useFeaturedStore((s) => s.featuredProductIds);
  const slides = useFeaturedStore((s) => s.heroSlides);
  const toggleFeatured = useFeaturedStore((s) => s.toggleFeaturedProduct);
  const addSlide = useFeaturedStore((s) => s.addSlide);
  const removeSlide = useFeaturedStore((s) => s.removeSlide);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: COLORS.primary, fontFamily: "Manrope_700Bold" }}>
          Mise en avant
        </Text>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 24, gap: 8, marginBottom: 16 }}>
        {([
          { key: "products", label: "Produits vedette" },
          { key: "slides", label: "Slides accueil" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 9999,
              backgroundColor: tab === t.key ? COLORS.primary : "#fff",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Inter_600SemiBold",
                color: tab === t.key ? "#fff" : COLORS.onSurfaceVariant,
              }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "products" ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 8 }}>
          <Text style={{ fontSize: 12, color: COLORS.outline, marginBottom: 8, fontFamily: "Inter_400Regular" }}>
            Sélectionnez les produits affichés dans le bloc "Produits" en page d'accueil. {featuredIds.length} sélectionnés.
          </Text>
          {MOCK_PRODUCTS.map((p) => {
            const img = getProductImage(p.images[0]);
            const selected = featuredIds.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => toggleFeatured(p.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: selected ? COLORS.primary : "transparent",
                }}
              >
                {img && (
                  <Image source={img} style={{ width: 56, height: 56, borderRadius: 8 }} resizeMode="cover" />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
                    {p.category.name}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={selected ? "check-circle" : "circle-outline"}
                  size={24}
                  color={selected ? COLORS.primary : COLORS.outlineVariant}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 12 }}>
          <SlideEditor onAdd={addSlide} />

          <Text style={{ fontSize: 12, color: COLORS.outline, marginTop: 8, fontFamily: "Inter_400Regular" }}>
            {slides.length} slide(s) actif(s) sur l'accueil.
          </Text>

          {slides.map((slide) => {
            const img = slide.kind === "image" ? getProductImage(slide.src) : null;
            return (
              <View
                key={slide.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                }}
              >
                {img ? (
                  <Image source={img} style={{ width: 64, height: 48, borderRadius: 8 }} resizeMode="cover" />
                ) : (
                  <View style={{ width: 64, height: 48, borderRadius: 8, backgroundColor: COLORS.surfaceContainer, alignItems: "center", justifyContent: "center" }}>
                    <MaterialCommunityIcons name={slide.kind === "video" ? "video" : "image"} size={20} color={COLORS.outline} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }} numberOfLines={1}>
                    {slide.title || "(sans titre)"}
                  </Text>
                  <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline }} numberOfLines={1}>
                    {slide.kind.toUpperCase()} · {slide.src}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Supprimer ce slide ?", "", [
                      { text: "Annuler", style: "cancel" },
                      { text: "Supprimer", style: "destructive", onPress: () => removeSlide(slide.id) },
                    ])
                  }
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SlideEditor({ onAdd }: { onAdd: (slide: HeroSlide) => void }) {
  const [kind, setKind] = useState<"image" | "video">("image");
  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [productId, setProductId] = useState("");

  const submit = () => {
    if (!src.trim()) {
      Alert.alert("Source requise", "Indiquez le nom d'image (ex: cuisineLuxeIlot) ou l'URL vidéo.");
      return;
    }
    onAdd({
      id: `slide-${Date.now()}`,
      kind,
      src: src.trim(),
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      productId: productId.trim() || undefined,
    });
    setSrc("");
    setTitle("");
    setSubtitle("");
    setProductId("");
  };

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, gap: 10 }}>
      <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }}>
        Ajouter un slide
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["image", "video"] as const).map((k) => (
          <TouchableOpacity
            key={k}
            onPress={() => setKind(k)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9999,
              backgroundColor: kind === k ? COLORS.primary : COLORS.surfaceContainer,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Inter_600SemiBold",
                color: kind === k ? "#fff" : COLORS.onSurfaceVariant,
              }}
            >
              {k.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SimpleField label={kind === "image" ? "Image (clé ou URL)" : "URL vidéo (mp4/hls)"} value={src} onChange={setSrc} placeholder={kind === "image" ? "ex: cuisineLuxeIlot" : "https://..."} />
      <SimpleField label="Titre" value={title} onChange={setTitle} />
      <SimpleField label="Sous-titre" value={subtitle} onChange={setSubtitle} />
      <SimpleField label="ID produit (optionnel)" value={productId} onChange={setProductId} placeholder="ex: c1" />

      <Button label="AJOUTER" onPress={submit} size="md" />
    </View>
  );
}

function SimpleField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View>
      <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.outline, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.outlineVariant}
        style={{
          fontSize: 14,
          fontFamily: "Inter_400Regular",
          color: COLORS.onSurface,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.outlineVariant,
        }}
      />
    </View>
  );
}
