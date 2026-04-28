import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../../lib/constants";
import { formatPrice } from "../../../lib/utils";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import CheckoutSteps from "../../../components/cart/CheckoutSteps";
import { useCart } from "../../../features/cart/hooks";
import { processPayment } from "../../../features/cart/payment";
import { useOrdersStore } from "../../../features/orders/store";
import type { Order } from "../../../lib/types";

export default function CheckoutPaymentScreen() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await processPayment({
      items,
      amountCents: Math.round(subtotal * 100),
      currency: "eur",
    });
    setLoading(false);

    if (!result.ok) {
      Alert.alert("Paiement refusé", result.error);
      return;
    }

    const now = new Date().toISOString();
    const order: Order = {
      id: result.orderId,
      orderNumber: result.orderId,
      items: items.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.calculatedPrice ?? item.product.price ?? 0,
        customDimensions: item.customDimensions,
      })),
      status: "commande_confirmee",
      total: subtotal,
      subtotal,
      shippingCost: 0,
      shippingAddress: {
        id: "addr-mock",
        firstName: "Jean",
        lastName: "Laurent",
        street: "12 rue de Rivoli",
        postalCode: "75001",
        city: "Paris",
        country: "France",
        territory: "metropole",
      },
      territory: "metropole",
      shippingMethod: "standard",
      estimatedDelivery: "2-3 semaines",
      createdAt: now,
      timeline: [
        { status: "commande_confirmee", label: "Commande confirmée", timestamp: now, completed: false },
        { status: "en_preparation", label: "En préparation", completed: false },
        { status: "en_attente_expedition", label: "En attente d'expédition", completed: false },
        { status: "expediee", label: "Expédiée", completed: false },
        { status: "livree", label: "Livrée", completed: false },
      ],
    };
    addOrder(order);
    clearCart();
    router.replace("/(main)/checkout/confirmation");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold" style={{ color: COLORS.primary, fontFamily: "Manrope_700Bold" }}>
          Paiement
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <CheckoutSteps currentStep={3} />

        <View className="gap-6 mb-8">
          <Input label="TITULAIRE DE LA CARTE" value={cardName} onChangeText={setCardName} autoCapitalize="words" />
          <Input label="NUMÉRO DE CARTE" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" placeholder="1234 5678 9012 3456" />
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input label="EXPIRATION" value={expiry} onChangeText={setExpiry} placeholder="MM/AA" keyboardType="number-pad" />
            </View>
            <View className="flex-1">
              <Input label="CVC" value={cvc} onChangeText={setCvc} placeholder="123" keyboardType="number-pad" secureTextEntry />
            </View>
          </View>
        </View>

        <View className="rounded-xl p-6 mb-8" style={{ backgroundColor: COLORS.surfaceContainerLow }}>
          <View className="flex-row justify-between">
            <Text className="font-bold" style={{ color: COLORS.primary, fontFamily: "Manrope_800ExtraBold" }}>Total à payer</Text>
            <Text className="text-lg font-bold" style={{ color: COLORS.secondary, fontFamily: "Manrope_700Bold" }}>
              {formatPrice(subtotal)}
            </Text>
          </View>
        </View>

        <Button label="Valider la commande" onPress={handlePayment} loading={loading} size="lg" />

        <Text className="text-[10px] text-center mt-4" style={{ color: COLORS.outline }}>
          Paiement sécurisé par Stripe. Vos données sont chiffrées.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
