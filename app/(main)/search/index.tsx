import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../lib/constants";
import { pickVisualSearchImage } from "../../../lib/visual-search";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  PRODUCT_IMAGES,
  getProductImage,
} from "../../../lib/mock-data";
import { formatPrice } from "../../../lib/utils";
import { useSearchStore } from "../../../features/search/store";
import type { Product } from "../../../lib/types";

const { width: W } = Dimensions.get("window");
const PAGE_PAD = 16;
const CAT_GAP = 10;
const CAT_W = (W - PAGE_PAD * 2 - CAT_GAP) / 2;

const CATEGORY_COVERS: Record<string, any> = {
  "1": PRODUCT_IMAGES.portePivotante,
  "2": PRODUCT_IMAGES.cuisineLuxeIlot,
  "3": PRODUCT_IMAGES.canapeModulable,
  "4": PRODUCT_IMAGES.chambreRoyale,
  "5": PRODUCT_IMAGES.baieCoulissante,
  "6": PRODUCT_IMAGES.buffetMiroir,
};

const POPULAR_QUERIES = [
  "Cuisine îlot",
  "Porte d'entrée",
  "Canapé",
  "Chambre complète",
  "Baie vitrée",
  "Décoration",
];

const TRENDING_PRODUCT_IDS = ["c2", "ch1", "p1", "s1"];

function score(haystack: string, needle: string) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  if (h.includes(n)) return 50;
  return 0;
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ image?: string }>();
  const [query, setQuery] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visualMatches, setVisualMatches] = useState<Product[]>([]);
  const recent = useSearchStore((s) => s.recent);
  const pushRecent = useSearchStore((s) => s.pushRecent);
  const clearRecent = useSearchStore((s) => s.clearRecent);

  // Pick up image param from SearchBar camera tap
  useEffect(() => {
    if (params.image && params.image !== imageUri) {
      runVisualSearch(params.image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.image]);

  const runVisualSearch = (uri: string) => {
    Keyboard.dismiss();
    setImageUri(uri);
    setQuery("");
    setAnalyzing(true);
    setVisualMatches([]);
    // Pseudo-deterministic shuffle from URI hash so matches feel "matched"
    const seed = Array.from(uri).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const shuffled = [...MOCK_PRODUCTS].sort(
      (a, b) => ((a.id.charCodeAt(0) + seed) % 7) - ((b.id.charCodeAt(0) + seed) % 7),
    );
    setTimeout(() => {
      setVisualMatches(shuffled.slice(0, 8));
      setAnalyzing(false);
    }, 1400);
  };

  const launchPicker = async () => {
    const uri = await pickVisualSearchImage();
    if (!uri) return;
    runVisualSearch(uri);
  };

  const clearVisualSearch = () => {
    setImageUri(null);
    setVisualMatches([]);
    setAnalyzing(false);
  };

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return MOCK_PRODUCTS
      .map((p) => ({
        product: p,
        s: Math.max(
          score(p.name, q),
          score(p.description, q) * 0.6,
          score(p.category.name, q) * 0.8,
        ),
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.product);
  }, [query]);

  const open = (productId: string) => {
    pushRecent(query);
    Keyboard.dismiss();
    router.push(`/(main)/products/${productId}`);
  };

  const openCategory = (catId: string) => {
    Keyboard.dismiss();
    router.push(`/(main)/categories/${catId}`);
  };

  const trending = TRENDING_PRODUCT_IDS
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof MOCK_PRODUCTS)[number] => Boolean(p));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ── Header ─────────────────────────────── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 9999,
            backgroundColor: "#fff",
          }}
        >
          <MaterialCommunityIcons name="magnify" size={18} color={COLORS.outline} />
          <TextInput
            value={query}
            onChangeText={(v) => {
              setQuery(v);
              if (v.trim().length > 0) clearVisualSearch();
            }}
            placeholder="Rechercher un produit, une catégorie…"
            placeholderTextColor={COLORS.outline}
            autoFocus={!imageUri}
            returnKeyType="search"
            onSubmitEditing={() => pushRecent(query)}
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "Inter_400Regular",
              color: COLORS.onSurface,
            }}
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={16} color={COLORS.outline} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={launchPicker} hitSlop={8}>
              <MaterialCommunityIcons name="camera-outline" size={20} color={COLORS.onSurface} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {imageUri ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Visual search header ───────────── */}
          <View
            style={{
              marginHorizontal: PAGE_PAD,
              marginTop: 6,
              padding: 12,
              borderRadius: 14,
              backgroundColor: "#fff",
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: COLORS.surfaceContainer }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }}>
                Recherche par image
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.outline, marginTop: 2 }}>
                {analyzing ? "Analyse en cours…" : `${visualMatches.length} suggestions visuelles`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={clearVisualSearch}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.surfaceContainer,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="close" size={16} color={COLORS.onSurface} />
            </TouchableOpacity>
          </View>

          {analyzing ? (
            <View style={{ paddingTop: 60, alignItems: "center" }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.onSurface, marginTop: 12 }}>
                Identification du produit…
              </Text>
              <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline, marginTop: 4 }}>
                Comparaison avec notre catalogue
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: PAGE_PAD, marginTop: 18 }}>
              <SectionHeader title="Suggestions visuelles" />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {visualMatches.map((p, idx) => {
                  const img = getProductImage(p.images[0]);
                  const matchPct = 92 - idx * 4;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      activeOpacity={0.92}
                      onPress={() => open(p.id)}
                      style={{
                        width: (W - PAGE_PAD * 2 - 10) / 2,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          aspectRatio: 1,
                          backgroundColor: COLORS.surfaceContainer,
                        }}
                      >
                        {img && <Image source={img} style={{ width: "100%", height: "100%" }} resizeMode="cover" />}
                        <View
                          style={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            backgroundColor: COLORS.primary,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text style={{ fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: 0.5 }}>
                            {matchPct}% MATCH
                          </Text>
                        </View>
                      </View>
                      <View style={{ padding: 8 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Inter_500Medium",
                            color: COLORS.onSurface,
                          }}
                          numberOfLines={2}
                        >
                          {p.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: "Manrope_700Bold",
                            color: COLORS.secondary,
                            marginTop: 2,
                          }}
                        >
                          {p.price ? formatPrice(p.price) : "Sur devis"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      ) : query.trim() === "" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Recent searches ────────────────── */}
          {recent.length > 0 && (
            <View style={{ paddingHorizontal: PAGE_PAD, marginTop: 6 }}>
              <SectionHeader
                title="Recherches récentes"
                actionLabel="Effacer"
                onAction={clearRecent}
              />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {recent.map((q) => (
                  <TouchableOpacity
                    key={q}
                    onPress={() => setQuery(q)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingLeft: 12,
                      paddingRight: 10,
                      paddingVertical: 7,
                      borderRadius: 9999,
                      backgroundColor: "#fff",
                    }}
                  >
                    <MaterialCommunityIcons name="history" size={12} color={COLORS.outline} />
                    <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.onSurface }}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── Popular queries ────────────────── */}
          <View style={{ paddingHorizontal: PAGE_PAD, marginTop: 22 }}>
            <SectionHeader title="Recherches populaires" />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {POPULAR_QUERIES.map((q, i) => (
                <TouchableOpacity
                  key={q}
                  onPress={() => setQuery(q)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: 10,
                    paddingRight: 12,
                    paddingVertical: 7,
                    borderRadius: 9999,
                    backgroundColor: "#fff",
                  }}
                >
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: i < 3 ? COLORS.secondary : COLORS.surfaceContainer,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Inter_700Bold",
                        color: i < 3 ? "#fff" : COLORS.outline,
                      }}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.onSurface }}>
                    {q}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Categories grid ────────────────── */}
          <View style={{ marginTop: 24 }}>
            <View style={{ paddingHorizontal: PAGE_PAD }}>
              <SectionHeader title="Parcourir par catégorie" />
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingHorizontal: PAGE_PAD,
                gap: CAT_GAP,
              }}
            >
              {MOCK_CATEGORIES.map((cat) => {
                const cover = CATEGORY_COVERS[cat.id];
                const count = MOCK_PRODUCTS.filter((p) => p.category.id === cat.id).length;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.92}
                    onPress={() => openCategory(cat.id)}
                    style={{
                      width: CAT_W,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      padding: 8,
                      backgroundColor: "#fff",
                      borderRadius: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        overflow: "hidden",
                        backgroundColor: COLORS.surfaceContainer,
                      }}
                    >
                      {cover && (
                        <Image source={cover} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Inter_600SemiBold",
                          color: COLORS.onSurface,
                        }}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
                        {count} article{count > 1 ? "s" : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Trending products ──────────────── */}
          {trending.length > 0 && (
            <View style={{ marginTop: 26 }}>
              <View style={{ paddingHorizontal: PAGE_PAD }}>
                <SectionHeader title="Tendances" />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: PAGE_PAD, gap: 12 }}
                keyboardShouldPersistTaps="handled"
              >
                {trending.map((p) => {
                  const img = getProductImage(p.images[0]);
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => open(p.id)}
                      activeOpacity={0.92}
                      style={{ width: 140 }}
                    >
                      <View
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: 12,
                          overflow: "hidden",
                          backgroundColor: COLORS.surfaceContainer,
                          marginBottom: 6,
                        }}
                      >
                        {img && <Image source={img} style={{ width: "100%", height: "100%" }} resizeMode="cover" />}
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Inter_500Medium",
                          color: COLORS.onSurface,
                        }}
                        numberOfLines={1}
                      >
                        {p.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "Manrope_700Bold",
                          color: COLORS.secondary,
                          marginTop: 1,
                        }}
                      >
                        {p.price ? formatPrice(p.price) : "Sur devis"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: PAGE_PAD, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {results.length === 0 ? (
            <View style={{ paddingTop: 60, alignItems: "center" }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.surfaceContainer,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialCommunityIcons name="magnify-close" size={26} color={COLORS.outline} />
              </View>
              <Text style={{ fontSize: 14, color: COLORS.onSurface, fontFamily: "Inter_600SemiBold" }}>
                Aucun résultat pour « {query} »
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.outline,
                  fontFamily: "Inter_400Regular",
                  marginTop: 4,
                  textAlign: "center",
                  paddingHorizontal: 32,
                }}
              >
                Essayez un autre terme ou parcourez par catégorie.
              </Text>
            </View>
          ) : (
            results.map((item, i) => {
              const img = getProductImage(item.images[0]);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => open(item.id)}
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    padding: 12,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  {img && <Image source={img} style={{ width: 56, height: 56, borderRadius: 8 }} resizeMode="cover" />}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
                      {item.category.name}
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: "Manrope_700Bold", color: COLORS.secondary, marginTop: 2 }}>
                      {item.price ? formatPrice(item.price) : "Sur devis"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Inter_600SemiBold",
          color: COLORS.outline,
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontSize: 12, color: COLORS.secondary, fontFamily: "Inter_500Medium" }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
