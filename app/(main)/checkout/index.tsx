import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, TERRITORIES, DELIVERY_ESTIMATES } from "../../../lib/constants";
import { isValidPostalCode, isOverseas, formatPrice } from "../../../lib/utils";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import CheckoutSteps from "../../../components/cart/CheckoutSteps";
import { useCart } from "../../../features/cart/hooks";

const addressSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  street: z.string().min(1, "Adresse requise"),
  postalCode: z.string().min(1, "Code postal requis").refine(isValidPostalCode, "Code postal invalide"),
  city: z.string().min(1, "Ville requise"),
  territory: z.string().min(1, "Territoire requis"),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function CheckoutAddressScreen() {
  const router = useRouter();
  const { items, subtotal } = useCart();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      postalCode: "",
      city: "",
      territory: "metropole",
    },
  });

  const territory = watch("territory");
  const overseas = isOverseas(territory);

  const onSubmit = (data: AddressForm) => {
    router.push("/(main)/checkout/shipping");
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
        <CheckoutSteps currentStep={1} />

        <Text className="text-sm font-semibold mb-6" style={{ color: COLORS.onSurface }}>
          Informations de livraison
        </Text>

        <View className="gap-6">
          <Controller control={control} name="firstName" render={({ field: { onChange, value } }) => (
            <Input label="PRÉNOM" value={value} onChangeText={onChange} error={errors.firstName?.message} autoCapitalize="words" />
          )} />
          <Controller control={control} name="lastName" render={({ field: { onChange, value } }) => (
            <Input label="NOM" value={value} onChangeText={onChange} error={errors.lastName?.message} autoCapitalize="words" />
          )} />
          <Controller control={control} name="street" render={({ field: { onChange, value } }) => (
            <Input label="ADRESSE" value={value} onChangeText={onChange} error={errors.street?.message} autoCapitalize="sentences" />
          )} />
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller control={control} name="postalCode" render={({ field: { onChange, value } }) => (
                <Input label="CODE POSTAL" value={value} onChangeText={onChange} error={errors.postalCode?.message} keyboardType="number-pad" />
              )} />
            </View>
            <View className="flex-1">
              <Controller control={control} name="city" render={({ field: { onChange, value } }) => (
                <Input label="VILLE" value={value} onChangeText={onChange} error={errors.city?.message} autoCapitalize="words" />
              )} />
            </View>
          </View>

          {/* Territory selector */}
          <View>
            <Text className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: COLORS.outline }}>
              PAYS/TERRITOIRE
            </Text>
            <Controller control={control} name="territory" render={({ field: { onChange, value } }) => (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {TERRITORIES.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => onChange(t.value)}
                    className="rounded-full px-4 py-2"
                    style={{
                      backgroundColor: value === t.value ? COLORS.primary : "transparent",
                      borderWidth: 1,
                      borderColor: value === t.value ? COLORS.primary : `${COLORS.outlineVariant}33`,
                    }}
                  >
                    <Text className="text-xs" style={{ color: value === t.value ? COLORS.onPrimary : COLORS.onSurface }}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )} />
          </View>
        </View>

        {/* Shipping info */}
        <View className="rounded-xl p-6 mt-6 mb-6" style={{ backgroundColor: COLORS.surfaceContainerLow }}>
          <Text className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: COLORS.outline }}>
            ZONE DE LIVRAISON
          </Text>
          <Text className="text-sm" style={{ color: overseas ? COLORS.onSurfaceVariant : COLORS.onSurface }}>
            {overseas
              ? `Livraison par conteneur maritime : ${DELIVERY_ESTIMATES.OUTRE_MER}`
              : `Livraison en France métropolitaine : ${DELIVERY_ESTIMATES.METROPOLE}`}
          </Text>
          {overseas && (
            <Text className="text-xs mt-1" style={{ color: COLORS.onSurfaceVariant }}>
              Une équipe dédiée gérera votre expédition.
            </Text>
          )}
        </View>

        {/* Summary */}
        <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: COLORS.surfaceContainer }}>
          {items.map((item) => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text className="text-xs flex-1" style={{ color: COLORS.onSurface }} numberOfLines={1}>
                {item.product.name} x{item.quantity}
              </Text>
              <Text className="text-xs" style={{ color: COLORS.onSurface }}>
                {formatPrice((item.calculatedPrice || item.product.price || 0) * item.quantity)}
              </Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-2 pt-2" style={{ borderTopWidth: 1, borderTopColor: COLORS.surfaceContainerLow }}>
            <Text className="font-bold" style={{ color: COLORS.secondary, fontFamily: "Manrope_700Bold" }}>
              Total TTC
            </Text>
            <Text className="font-bold" style={{ color: COLORS.secondary, fontFamily: "Manrope_700Bold" }}>
              {formatPrice(subtotal)}
            </Text>
          </View>
        </View>

        <Button label="Continuer vers la livraison →" onPress={handleSubmit(onSubmit)} size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
}
