import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { VideoView, useVideoPlayer } from "expo-video";
import { COLORS } from "../lib/constants";
import { PRODUCT_IMAGES } from "../lib/mock-data";
import { useHeroSlides, type HeroSlide } from "../features/featured/store";

const { width: W } = Dimensions.get("window");
const HERO_W = W - 48;
const HERO_H = 200;
const AUTO_ADVANCE_MS = 5000;

function resolveImage(src: string) {
  if (/^https?:\/\//.test(src)) return { uri: src };
  return (PRODUCT_IMAGES as any)[src] ?? null;
}

function VideoSlide({ slide, muted, onTap }: { slide: HeroSlide; muted: boolean; onTap: () => void }) {
  const player = useVideoPlayer(slide.src, (p) => {
    p.loop = true;
    p.muted = muted;
    p.play();
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onTap} style={{ width: HERO_W, height: HERO_H }}>
      <VideoView
        player={player}
        style={{ width: HERO_W, height: HERO_H, borderRadius: 16 }}
        contentFit="cover"
        nativeControls={false}
      />
    </TouchableOpacity>
  );
}

function ImageSlide({ slide, onTap }: { slide: HeroSlide; onTap: () => void }) {
  const source = resolveImage(slide.src);
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onTap} style={{ width: HERO_W, height: HERO_H }}>
      {source ? (
        <Image source={source} style={{ width: HERO_W, height: HERO_H, borderRadius: 16 }} resizeMode="cover" />
      ) : (
        <View style={{ width: HERO_W, height: HERO_H, borderRadius: 16, backgroundColor: COLORS.surfaceContainer }} />
      )}
    </TouchableOpacity>
  );
}

export default function HeroCarousel() {
  const slides = useHeroSlides();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * HERO_W, animated: true });
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / HERO_W);
    if (i !== index) setIndex(i);
  };

  const handleSlideTap = (slide: HeroSlide) => {
    if (slide.kind === "video") {
      setMuted((m) => !m);
      return;
    }
    if (slide.productId) {
      router.push(`/(main)/products/${slide.productId}`);
    } else if (slide.categoryId) {
      router.push(`/(main)/categories/${slide.categoryId}`);
    }
  };

  if (slides.length === 0) return null;

  return (
    <View style={{ marginHorizontal: 24, marginBottom: 24 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={HERO_W}
        decelerationRate="fast"
        style={{ borderRadius: 16 }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: HERO_W, height: HERO_H, position: "relative" }}>
            {slide.kind === "video" ? (
              <VideoSlide slide={slide} muted={muted} onTap={() => handleSlideTap(slide)} />
            ) : (
              <ImageSlide slide={slide} onTap={() => handleSlideTap(slide)} />
            )}

            {(slide.title || slide.subtitle) && (
              <LinearGradient
                colors={["transparent", "rgba(0,36,68,0.65)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 110,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  justifyContent: "flex-end",
                  padding: 18,
                }}
                pointerEvents="none"
              >
                {slide.subtitle && (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "Inter_600SemiBold",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {slide.subtitle}
                  </Text>
                )}
                {slide.title && (
                  <Text
                    style={{
                      fontSize: 20,
                      color: "#fff",
                      fontFamily: "Manrope_700Bold",
                    }}
                  >
                    {slide.title}
                  </Text>
                )}
              </LinearGradient>
            )}
          </View>
        ))}
      </ScrollView>

      {slides.length > 1 && (
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === index ? COLORS.primary : COLORS.outlineVariant,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
