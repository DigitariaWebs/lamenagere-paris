import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { forgotPasswordApi } from "../../features/auth/api";

const schema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      await forgotPasswordApi(data.email);
      setSent(true);
      setTimeout(() => router.replace("/(auth)/login"), 5000);
    } catch {
      // still show success for security
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.primary} />
      </View>

      <View className="px-6 flex-1">
        {!sent ? (
          <>
            <Text
              className="text-2xl mb-4"
              style={{ color: COLORS.primaryContainer, fontFamily: "Manrope_700Bold" }}
            >
              Mot de passe oublié ?
            </Text>
            <Text className="text-sm mb-8" style={{ color: COLORS.onSurfaceVariant }}>
              Entrez votre adresse e-mail et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </Text>

            <View className="mb-8">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="EMAIL"
                    placeholder="nom@example.com"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    keyboardType="email-address"
                  />
                )}
              />
            </View>

            <Button
              label="Envoyer le lien"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              size="lg"
            />
          </>
        ) : (
          <View className="items-center pt-16">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: COLORS.primary }}
            >
              <MaterialCommunityIcons name="check" size={32} color="#fff" />
            </View>
            <Text
              className="text-xl mb-4"
              style={{ color: COLORS.primary, fontFamily: "Manrope_700Bold" }}
            >
              Lien envoyé !
            </Text>
            <Text
              className="text-sm text-center mb-8"
              style={{ color: COLORS.onSurfaceVariant }}
            >
              Vérifiez votre e-mail pour le lien de réinitialisation.
            </Text>
            <Button
              label="Revenir à la connexion"
              onPress={() => router.replace("/(auth)/login")}
              variant="secondary"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
