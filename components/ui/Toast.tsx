import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../lib/constants";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "info",
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const bgColors = {
    success: COLORS.success,
    error: COLORS.error,
    info: COLORS.primary,
  };

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(
        type === "error"
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success,
      );
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      translateY.value = withDelay(
        duration,
        withTiming(100, { duration: 300 }),
      );
      opacity.value = withDelay(
        duration,
        withTiming(0, { duration: 300 }, () => {
          runOnJS(onDismiss)();
        }),
      );
    }
  }, [visible, duration, onDismiss, opacity, translateY, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 100,
          left: 24,
          right: 24,
          backgroundColor: bgColors[type],
          borderRadius: 8,
          paddingVertical: 14,
          paddingHorizontal: 20,
          zIndex: 9999,
        },
        animatedStyle,
      ]}
    >
      <Text className="text-white text-sm font-medium text-center">
        {message}
      </Text>
    </Animated.View>
  );
}
