import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../../lib/constants";
import { formatPrice } from "../../../lib/utils";
import EmptyState from "../../../components/ui/EmptyState";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  getProductImage,
  PRODUCT_IMAGES,
  CATEGORY_BG,
} from "../../../lib/mock-data";
import { useFavoritesStore } from "../../../features/favorites/store";

const { width: W } = Dimensions.get("window");
const CARD_W = (W - 20 * 2 - 12) / 2;

// Hero images per category
const CATEGORY_HEROES: Record<string, any> = {
  "1": PRODUCT_IMAGES.portePrestige,
  "2": PRODUCT_IMAGES.cuisineLuxeIlot,
  "3": PRODUCT_IMAGES.canapeBordeaux,
  "4": PRODUCT_IMAGES.chambreRoyale,
  "5": PRODUCT_IMAGES.baieCoulissante,
  "6": PRODUCT_IMAGES.buffetMiroir,
};

function ProductCard({ product, index }: { product: (typeof MOCK_PRODUCTS)[0]; index: number }) {
  const router = useRouter();
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);
  const isFav = useFavoritesStore((s) => s.favorites.includes(product.id));
  const imgSource = getProductImage(product.images[0]);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/(main)/products/${product.id}`)}
      style={{
        width: CARD_W,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: CATEGORY_BG[index % CATEGORY_BG.length],
        marginBottom: 12,
      }}
    >
      {/* Favorite */}
      <TouchableOpacity
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleFav(product.id);
        }}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: "rgba(255,255,255,0.7)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={isFav ? "heart" : "heart-outline"}
          size={14}
          color={isFav ? "#E74040" : COLORS.onSurfaceVariant}
        />
      </TouchableOpacity>

      {imgSource && (
        <Image
          source={imgSource}
          style={{ width: "100%", height: CARD_W * 0.85 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 10 }}>
        <Text
          style={{ fontSize: 13, fontFamily: "Manrope_700Bold", color: COLORS.onSurface, marginBottom: 2 }}
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text
          style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant, marginBottom: 4 }}
          numberOfLines={1}
        >
          par La Ménagère Paris
        </Text>
        {product.price ? (
          <Text style={{ fontSize: 14, fontFamily: "Manrope_700Bold", color: COLORS.secondary }}>
            {formatPrice(product.price)}
          </Text>
        ) : (
          <Text style={{ fontSize: 12, fontFamily: "Inter_500Medium", color: COLORS.secondary, fontStyle: "italic" }}>
            Sur devis
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CategoryProductsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const category = MOCK_CATEGORIES.find((c) => c.id === id);
  const products = MOCK_PRODUCTS.filter((p) => p.category.id === id);
  const heroImage = CATEGORY_HEROES[id];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero header with image */}
        <View>
          {heroImage && (
            <Image source={heroImage} style={{ width: W, height: 220 }} resizeMode="cover" />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "transparent", "rgba(0,0,0,0.4)"]}
            locations={[0, 0.4, 1]}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Nav */}
          <SafeAreaView edges={["top"]} style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" }}
              >
                <MaterialCommunityIcons name="chevron-left" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" }}
              >
                <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Category title overlay */}
          <View style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
            <Text style={{ fontSize: 24, fontFamily: "Manrope_700Bold", color: "#fff" }}>
              {category?.name || "Produits"}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
              {products.length} article{products.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Product grid */}
        {products.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 20,
              paddingTop: 20,
              gap: 12,
            }}
          >
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="magnify"
            title="Aucun produit"
            message="Cette catégorie sera bientôt disponible"
            action={{ label: "Retour", onPress: () => router.back() }}
          />
        )}
      </ScrollView>
    </View>
  );
}
