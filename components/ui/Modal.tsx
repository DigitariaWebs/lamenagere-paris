import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-t-xl pt-6 pb-8 px-6"
              style={{ maxHeight: "80%" }}
            >
              <View className="flex-row items-center justify-between mb-6">
                {title && (
                  <Text
                    className="text-lg font-bold"
                    style={{
                      color: COLORS.onSurface,
                      fontFamily: "Manrope_700Bold",
                    }}
                  >
                    {title}
                  </Text>
                )}
                <TouchableOpacity onPress={onClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={COLORS.onSurface}
                  />
                </TouchableOpacity>
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
