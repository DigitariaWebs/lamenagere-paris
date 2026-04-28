import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { COLORS } from "../../lib/constants";

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: [number, number];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ImageCarousel({
  images,
  aspectRatio = [4, 5],
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const imageHeight = SCREEN_WIDTH * (aspectRatio[1] / aspectRatio[0]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (images.length === 0) {
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          height: imageHeight,
          backgroundColor: COLORS.surfaceContainerLow,
        }}
      />
    );
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: SCREEN_WIDTH, height: imageHeight }}
            contentFit="cover"
            placeholder={{ blurhash: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6." }}
            transition={300}
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View className="flex-row items-center justify-center gap-2 py-3">
          {images.map((_, index) => (
            <View
              key={index}
              className="rounded-full"
              style={{
                width: index === activeIndex ? 8 : 6,
                height: index === activeIndex ? 8 : 6,
                backgroundColor:
                  index === activeIndex ? COLORS.primary : COLORS.surfaceDim,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
