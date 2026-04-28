import React, { useEffect } from "react";
import { View, Dimensions, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../lib/constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DOT_SIZE = 28;
const DOT_GAP = 18;

// Colors matching the logo
const DOT_COLORS = ["#4E8FD4", "#F5C518", "#E74040"];

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  // Dot animations — scale + opacity for each dot
  const dot1Scale = useSharedValue(0);
  const dot1Opacity = useSharedValue(0);
  const dot2Scale = useSharedValue(0);
  const dot2Opacity = useSharedValue(0);
  const dot3Scale = useSharedValue(0);
  const dot3Opacity = useSharedValue(0);

  // All dots fade out together
  const dotsGroupOpacity = useSharedValue(1);

  // Logo fade in
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);

  // Whole screen fade out at the end
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // Step 1: Dots appear one by one with spring bounce
    // Dot 1 appears at 200ms
    dot1Opacity.value = withDelay(200, withTiming(1, { duration: 200 }));
    dot1Scale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 180 }),
    );

    // Dot 2 appears at 400ms
    dot2Opacity.value = withDelay(400, withTiming(1, { duration: 200 }));
    dot2Scale.value = withDelay(
      400,
      withSpring(1, { damping: 12, stiffness: 180 }),
    );

    // Dot 3 appears at 600ms
    dot3Opacity.value = withDelay(600, withTiming(1, { duration: 200 }));
    dot3Scale.value = withDelay(
      600,
      withSpring(1, { damping: 12, stiffness: 180 }),
    );

    // Step 2: Hold dots for a moment, then fade them out at 1600ms
    dotsGroupOpacity.value = withDelay(
      1600,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }),
    );

    // Step 3: Logo fades in at 2000ms
    logoOpacity.value = withDelay(
      2000,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
    logoScale.value = withDelay(
      2000,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );

    // Step 4: Whole screen fades out at 3400ms
    screenOpacity.value = withDelay(
      3400,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }, () => {
        runOnJS(onFinish)();
      }),
    );
  }, [
    dot1Scale,
    dot1Opacity,
    dot2Scale,
    dot2Opacity,
    dot3Scale,
    dot3Opacity,
    dotsGroupOpacity,
    logoOpacity,
    logoScale,
    screenOpacity,
    onFinish,
  ]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
    transform: [{ scale: dot1Scale.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
    transform: [{ scale: dot2Scale.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
    transform: [{ scale: dot3Scale.value }],
  }));

  const dotsGroupStyle = useAnimatedStyle(() => ({
    opacity: dotsGroupOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.background,
          zIndex: 9999,
          alignItems: "center",
          justifyContent: "center",
        },
        screenStyle,
      ]}
    >
      {/* Dots */}
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: DOT_GAP,
            position: "absolute",
          },
          dotsGroupStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: DOT_COLORS[0],
            },
            dot1Style,
          ]}
        />
        <Animated.View
          style={[
            {
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: DOT_COLORS[1],
            },
            dot2Style,
          ]}
        />
        <Animated.View
          style={[
            {
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: DOT_COLORS[2],
            },
            dot3Style,
          ]}
        />
      </Animated.View>

      {/* Logo */}
      <Animated.View
        style={[
          {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
          },
          logoStyle,
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={{
            width: SCREEN_WIDTH * 0.6,
            height: SCREEN_WIDTH * 0.6 * 0.5,
            resizeMode: "contain",
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
