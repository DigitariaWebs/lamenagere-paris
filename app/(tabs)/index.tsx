import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../lib/constants";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  getProductImage,
} from "../../lib/mock-data";
import { formatPrice } from "../../lib/utils";
import type { Product } from "../../lib/types";
import { useFavoritesStore } from "../../features/favorites/store";
import { useCartStore } from "../../features/cart/store";
import { useFeaturedProducts } from "../../features/featured/store";
import HeroCarousel from "../../components/HeroCarousel";
import SearchBar from "../../components/SearchBar";
import PromoBanner from "../../components/PromoBanner";

const { width: W } = Dimensions.get("window");
const GUTTER = 8;
const COL_W = (W - 12 * 2 - GUTTER) / 2;

type FilterKind = "all" | "deals" | "rated" | "best";

// ─── Top category tabs (underline) ────────────────────────
function TopCategoryTabs({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const cats = [{ id: "all", name: "Tout" }, ...MOCK_CATEGORIES];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 22, paddingVertical: 10 }}
    >
      {cats.map((cat) => {
        const isActive = cat.id === active;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(cat.id);
            }}
            style={{ alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: isActive ? 17 : 15,
                fontFamily: isActive ? "Manrope_700Bold" : "Inter_500Medium",
                color: isActive ? COLORS.onSurface : COLORS.outline,
                paddingBottom: 6,
              }}
            >
              {cat.name}
            </Text>
            {isActive && (
              <View
                style={{
                  width: 22,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: COLORS.primary,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Filter chips ─────────────────────────────────────────
const FILTER_CHIPS: { id: FilterKind; label: string; icon?: any }[] = [
  { id: "all", label: "Tout" },
  { id: "deals", label: "Promos", icon: "lightning-bolt" },
  { id: "rated", label: "5★ Notés", icon: "star" },
  { id: "best", label: "Best-sellers", icon: "thumb-up" },
];

function FilterChips({
  active,
  onSelect,
}: {
  active: FilterKind;
  onSelect: (k: FilterKind) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 18, paddingVertical: 8 }}
    >
      {FILTER_CHIPS.map((chip) => {
        const isActive = chip.id === active;
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            {chip.icon && (
              <MaterialCommunityIcons
                name={chip.icon}
                size={14}
                color={isActive ? COLORS.onSurface : COLORS.outline}
              />
            )}
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: isActive ? "Manrope_700Bold" : "Inter_500Medium",
                  color: isActive ? COLORS.onSurface : COLORS.outline,
                  paddingBottom: 4,
                }}
              >
                {chip.label}
              </Text>
              {isActive && (
                <View
                  style={{
                    width: 18,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: COLORS.primary,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Product card (Temu-style) ────────────────────────────
function ProductCardTemu({ product, imgHeight }: { product: Product; imgHeight: number }) {
  const router = useRouter();
  const isFav = useFavoritesStore((s) => s.favorites.includes(product.id));
  const toggleFav = useFavoritesStore((s) => s.toggleFavorite);
  const addItem = useCartStore((s) => s.addItem);
  const imgSource = getProductImage(product.images[0]);

  const isQuoteOnly = product.productType === "quote_only";

  const handleFav = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFav(product.id);
  };

  const handleAdd = async () => {
    if (isQuoteOnly) {
      router.push(`/(main)/quote-request/${product.id}`);
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product, 1);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/(main)/products/${product.id}`)}
      style={{
        width: COL_W,
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: GUTTER,
      }}
    >
      {/* Image */}
      <View style={{ width: COL_W, height: imgHeight, backgroundColor: COLORS.surfaceContainer }}>
        {imgSource && (
          <Image
            source={imgSource}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}
        <TouchableOpacity
          onPress={handleFav}
          hitSlop={8}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.85)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name={isFav ? "heart" : "heart-outline"}
            size={14}
            color={isFav ? "#E74040" : COLORS.onSurface}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ padding: 8 }}>
        {/* Savings badge row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 }}>
          <View
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 1,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" }}>
              ÉCO
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              fontFamily: "Inter_500Medium",
              color: COLORS.onSurface,
            }}
            numberOfLines={2}
          >
            {product.name}
          </Text>
        </View>

        {/* Rating + sold (mocked from id) */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <MaterialCommunityIcons
              key={i}
              name="star"
              size={10}
              color={i < 4 ? COLORS.onSurface : COLORS.outlineVariant}
            />
          ))}
          <Text style={{ fontSize: 10, fontFamily: "Inter_500Medium", color: COLORS.outline, marginLeft: 2 }}>
            {(product.id.charCodeAt(0) % 5) + 1}K+ vendus
          </Text>
        </View>

        {/* Price + add */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            {isQuoteOnly ? (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Manrope_700Bold",
                  color: COLORS.secondary,
                  fontStyle: "italic",
                }}
              >
                Sur devis
              </Text>
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: "Inter_500Medium",
                    color: COLORS.secondary,
                    marginBottom: -2,
                  }}
                >
                  Dernier jour
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Manrope_800ExtraBold",
                    color: COLORS.secondary,
                  }}
                >
                  {formatPrice(product.price ?? 0)}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAdd}
            hitSlop={6}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.outline,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <MaterialCommunityIcons
              name={isQuoteOnly ? "file-document-edit-outline" : "cart-plus"}
              size={16}
              color={COLORS.onSurface}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Two-column masonry feed ──────────────────────────────
type FeedItem = { key: string; product: Product; imgHeight: number };

function MasonryFeed({ items }: { items: FeedItem[] }) {
  const left: FeedItem[] = [];
  const right: FeedItem[] = [];
  items.forEach((it, i) => {
    (i % 2 === 0 ? left : right).push(it);
  });

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 12, gap: GUTTER }}>
      <View style={{ flex: 1 }}>
        {left.map((it) => (
          <ProductCardTemu key={it.key} product={it.product} imgHeight={it.imgHeight} />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {right.map((it) => (
          <ProductCardTemu key={it.key} product={it.product} imgHeight={it.imgHeight + 30} />
        ))}
      </View>
    </View>
  );
}

// ─── Home screen ──────────────────────────────────────────
const PAGE_SIZE = 8;
const NEAR_BOTTOM_PX = 600;

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(PAGE_SIZE);
  const featured = useFeaturedProducts();

  const products = useMemo(() => {
    let list = activeCategory === "all" ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category.id === activeCategory);
    if (activeFilter === "deals") {
      list = list.filter((p) => p.priceMode === "fixed");
    } else if (activeFilter === "rated") {
      list = list.filter((_, i) => i % 2 === 0);
    } else if (activeFilter === "best") {
      list = featured.length > 0 ? featured : list.slice(0, 8);
    }
    return list;
  }, [activeCategory, activeFilter, featured]);

  // Reset pagination when filters change
  useEffect(() => {
    setLoaded(PAGE_SIZE);
  }, [activeCategory, activeFilter]);

  // Build the FIFO-cycled feed up to `loaded`
  const feed = useMemo<FeedItem[]>(() => {
    if (products.length === 0) return [];
    const items: FeedItem[] = [];
    for (let i = 0; i < loaded; i++) {
      const product = products[i % products.length];
      const cycle = Math.floor(i / products.length);
      const variance = (product.id.charCodeAt(product.id.length - 1) % 5) * 18;
      items.push({
        key: `${product.id}-${cycle}-${i}`,
        product,
        imgHeight: 160 + variance,
      });
    }
    return items;
  }, [products, loaded]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoaded(PAGE_SIZE);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (distanceFromBottom < NEAR_BOTTOM_PX && products.length > 0) {
        setLoaded((prev) => prev + PAGE_SIZE);
      }
    },
    [products.length],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SearchBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickyHeaderIndices={[0]}
        onScroll={onScroll}
        scrollEventThrottle={64}
      >
        <View style={{ backgroundColor: COLORS.background }}>
          <TopCategoryTabs active={activeCategory} onSelect={setActiveCategory} />
        </View>

        <PromoBanner />

        <HeroCarousel />

        <FilterChips active={activeFilter} onSelect={setActiveFilter} />

        <MasonryFeed items={feed} />

        {products.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
              Aucun produit trouvé.
            </Text>
          </View>
        ) : (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
