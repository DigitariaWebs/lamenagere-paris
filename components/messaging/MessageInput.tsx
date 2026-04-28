import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../lib/constants";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (text.trim()) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSend(text.trim());
      setText("");
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
      }}
    >
      <TouchableOpacity
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: "#f5f5f5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="plus" size={20} color={COLORS.outline} />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: "#f5f5f5",
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 8,
          minHeight: 38,
          maxHeight: 100,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Écrire un message..."
          placeholderTextColor={COLORS.surfaceDim}
          style={{
            flex: 1,
            fontSize: 14,
            color: COLORS.onSurface,
            fontFamily: "Inter_400Regular",
            lineHeight: 20,
            paddingVertical: 0,
          }}
          multiline
          editable={!disabled}
        />
      </View>

      <TouchableOpacity
        onPress={handleSend}
        disabled={!canSend}
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: canSend ? COLORS.primary : "#f5f5f5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="send"
          size={18}
          color={canSend ? "#ffffff" : COLORS.surfaceDim}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
    </View>
  );
}
