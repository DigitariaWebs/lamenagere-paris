import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS, ACCOUNT_TYPES } from "../../lib/constants";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";
import { useAuthStore } from "../../features/auth/store";
import type { AccountType } from "../../lib/types";

const baseSchema = z
  .object({
    accountType: z.enum(["particulier", "professionnel"]),
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    email: z.string().min(1, "Email requis").email("Email invalide"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
    company: z.string().optional(),
    siret: z.string().optional(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => data.acceptTerms === true, {
    message: "Vous devez accepter les conditions",
    path: ["acceptTerms"],
  })
  .refine(
    (data) =>
      data.accountType !== "professionnel" || (data.company?.trim().length ?? 0) > 0,
    { message: "Nom de l'entreprise requis", path: ["company"] },
  )
  .refine(
    (data) =>
      data.accountType !== "professionnel" || /^\d{14}$/.test((data.siret ?? "").replace(/\s/g, "")),
    { message: "SIRET invalide (14 chiffres)", path: ["siret"] },
  );

const registerSchema = baseSchema;
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" as const });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: "particulier",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      company: "",
      siret: "",
      acceptTerms: false,
    },
  });

  const accountType = watch("accountType");
  const setAccountType = (type: AccountType) => setValue("accountType", type, { shouldValidate: false });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        accountType,
        company: data.company,
        siret: data.siret,
      });
    } catch {
      setToast({
        visible: true,
        message: error || "Erreur lors de l’inscription",
        type: "error",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="close" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text
            className="text-xs uppercase tracking-widest"
            style={{ color: COLORS.outline }}
          >
            CRÉER UN COMPTE
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <View className="px-6 mb-2">
            <Text
              className="text-3xl"
              style={{ color: COLORS.primaryContainer, fontFamily: "Manrope_700Bold" }}
            >
              Créer un compte
            </Text>
          </View>
          <View className="px-6 mb-8">
            <Text
              className="text-xs uppercase tracking-widest"
              style={{ color: COLORS.outline }}
            >
              L'EXCELLENCE DU MOBILIER PARISIEN
            </Text>
          </View>

          {/* Account type toggle */}
          <View className="flex-row gap-4 px-6 mb-8">
            {(["particulier", "professionnel"] as AccountType[]).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setAccountType(type)}
                className="flex-1 py-3 rounded-full items-center"
                style={{
                  backgroundColor: accountType === type ? COLORS.primary : "transparent",
                  borderWidth: accountType === type ? 0 : 1,
                  borderColor: `${COLORS.outlineVariant}33`,
                }}
              >
                <Text
                  className="text-sm font-semibold uppercase"
                  style={{
                    color: accountType === type ? COLORS.onPrimary : COLORS.onSurface,
                  }}
                >
                  {type === "particulier" ? "PARTICULIER" : "PROFESSIONNEL"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form fields */}
          <View className="px-6 gap-6">
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input label="NOM" value={value} onChangeText={onChange} error={errors.lastName?.message} autoCapitalize="words" />
              )}
            />
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <Input label="PRÉNOM" value={value} onChangeText={onChange} error={errors.firstName?.message} autoCapitalize="words" />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input label="EMAIL" placeholder="nom@example.com" value={value} onChangeText={onChange} error={errors.email?.message} keyboardType="email-address" />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input label="TÉLÉPHONE" placeholder="+33 6 00 00 00 00" value={value ?? ""} onChangeText={onChange} keyboardType="phone-pad" />
              )}
            />

            {accountType === "professionnel" && (
              <>
                <Controller
                  control={control}
                  name="company"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="NOM DE L'ENTREPRISE"
                      value={value ?? ""}
                      onChangeText={onChange}
                      error={errors.company?.message}
                      autoCapitalize="words"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="siret"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="SIRET"
                      placeholder="14 chiffres"
                      value={value ?? ""}
                      onChangeText={onChange}
                      error={errors.siret?.message}
                      keyboardType="number-pad"
                    />
                  )}
                />
              </>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input label="MOT DE PASSE" value={value} onChangeText={onChange} error={errors.password?.message} secureTextEntry />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input label="CONFIRMER MOT DE PASSE" value={value} onChangeText={onChange} error={errors.confirmPassword?.message} secureTextEntry />
              )}
            />

            {/* Terms checkbox */}
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className="flex-row gap-3"
                >
                  <View
                    className="w-5 h-5 rounded items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: value ? COLORS.primary : "transparent",
                      borderWidth: value ? 0 : 1.5,
                      borderColor: COLORS.outlineVariant,
                    }}
                  >
                    {value && (
                      <MaterialCommunityIcons name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <Text className="flex-1 text-sm" style={{ color: COLORS.onSurface }}>
                    J'accepte les conditions générales et la politique de confidentialité de La Ménagère Paris
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.acceptTerms && (
              <Text className="text-xs" style={{ color: COLORS.error }}>
                {errors.acceptTerms.message}
              </Text>
            )}

            <Button
              label="CRÉER MON COMPTE"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
            />
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center mt-8 mb-12">
            <Text className="text-sm" style={{ color: COLORS.outline }}>
              Déjà un compte ?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-sm font-bold" style={{ color: COLORS.primary }}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => {
          setToast((prev) => ({ ...prev, visible: false }));
          clearError();
        }}
      />
    </SafeAreaView>
  );
}
