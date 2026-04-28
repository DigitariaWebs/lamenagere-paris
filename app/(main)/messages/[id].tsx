import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../lib/constants";
import { formatPrice } from "../../../lib/utils";
import MessageBubble from "../../../components/messaging/MessageBubble";
import MessageInput from "../../../components/messaging/MessageInput";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  getProductImage,
} from "../../../lib/mock-data";
import type { Message } from "../../../lib/types";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES[id] || []);

  const productImg = conversation?.product?.images[0]
    ? getProductImage(conversation.product.images[0])
    : null;

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 150);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      const newMsg: Message = {
        id: `local-${Date.now()}`,
        conversationId: id,
        content,
        sender: "user",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [id],
  );

  if (!conversation) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter_500Medium", color: COLORS.onSurfaceVariant }}>
          Conversation introuvable
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.onSurface} />
        </TouchableOpacity>

        {/* Vendor avatar */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="store" size={18} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }}>
            {conversation.vendorName}
          </Text>
          <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline }}>
            Répond généralement en 2h
          </Text>
        </View>

        <TouchableOpacity>
          <MaterialCommunityIcons name="phone-outline" size={22} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Product context card */}
          {conversation.product && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/(main)/products/${conversation.product!.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#ffffff",
                borderRadius: 12,
                padding: 10,
                marginBottom: 16,
                alignSelf: "center",
                maxWidth: "90%",
                shadowColor: "rgba(0,0,0,0.04)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              {productImg && (
                <Image
                  source={productImg}
                  style={{ width: 44, height: 44, borderRadius: 8 }}
                  resizeMode="cover"
                />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: COLORS.onSurface }}
                  numberOfLines={1}
                >
                  {conversation.product.name}
                </Text>
                <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.secondary }}>
                  {conversation.product.price
                    ? formatPrice(conversation.product.price)
                    : "Sur devis"}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.outline} />
            </TouchableOpacity>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;
            return (
              <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} />
            );
          })}
        </ScrollView>

        {/* Input */}
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#ffffff" }}>
          <MessageInput onSend={handleSend} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
