import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../lib/constants";

const SECTIONS = [
  {
    title: "1. Responsable du traitement",
    body: "La Ménagère Paris SAS, dont le siège social est situé à Paris, est responsable du traitement de vos données personnelles dans le cadre de l'utilisation de l'application mobile.",
  },
  {
    title: "2. Données collectées",
    body: "Nous collectons les données suivantes :\n\n• Données d'identification : nom, prénom, adresse e-mail, numéro de téléphone\n• Données professionnelles (compte pro) : nom de l'entreprise, numéro SIRET\n• Données de livraison : adresses postales, territoire\n• Données de commande : historique d'achats, devis, paniers\n• Données techniques : type d'appareil, version de l'application, notifications push",
  },
  {
    title: "3. Finalités du traitement",
    body: "Vos données sont traitées pour :\n\n• La gestion de votre compte utilisateur\n• Le traitement et le suivi de vos commandes et devis\n• La communication relative à vos commandes (e-mails, notifications)\n• L'amélioration de nos services et de l'expérience utilisateur\n• Le respect de nos obligations légales et réglementaires",
  },
  {
    title: "4. Base légale",
    body: "Le traitement de vos données repose sur :\n\n• L'exécution du contrat (commandes, livraisons)\n• Votre consentement (notifications marketing, cookies)\n• Notre intérêt légitime (amélioration des services, sécurité)\n• Nos obligations légales (facturation, comptabilité)",
  },
  {
    title: "5. Durée de conservation",
    body: "• Données de compte : conservées pendant toute la durée de votre inscription, puis 3 ans après la dernière activité\n• Données de commande : 10 ans (obligation comptable)\n• Données de navigation : 13 mois maximum\n• Données de prospection : 3 ans après le dernier contact",
  },
  {
    title: "6. Partage des données",
    body: "Vos données peuvent être partagées avec :\n\n• Nos prestataires de paiement (Stripe)\n• Nos partenaires logistiques (transporteurs)\n• Nos hébergeurs (serveurs sécurisés en UE)\n\nNous ne vendons jamais vos données personnelles à des tiers.",
  },
  {
    title: "7. Vos droits",
    body: "Conformément au RGPD, vous disposez des droits suivants :\n\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement (« droit à l'oubli »)\n• Droit à la portabilité\n• Droit d'opposition et de limitation du traitement\n• Droit de retirer votre consentement\n\nPour exercer vos droits, contactez-nous à : dpo@lamenagereparis.fr",
  },
  {
    title: "8. Sécurité",
    body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement SSL/TLS, stockage sécurisé (expo-secure-store), accès restreint aux données.",
  },
  {
    title: "9. Cookies et traceurs",
    body: "L'application peut utiliser des technologies de suivi à des fins d'analyse et d'amélioration de l'expérience. Vous pouvez désactiver les notifications et le suivi dans les paramètres de l'application.",
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Manrope_700Bold", color: COLORS.onSurface }}>
          Politique de confidentialité
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.outline, marginBottom: 20 }}>
          Dernière mise à jour : 1er janvier 2026
        </Text>

        <View style={{ backgroundColor: "#ffffff", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color={COLORS.primary} />
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: COLORS.primary }}>
              Conforme RGPD
            </Text>
          </View>
          <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant, lineHeight: 18 }}>
            La Ménagère Paris s'engage à protéger votre vie privée et à traiter vos données personnelles de manière transparente et sécurisée.
          </Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 15, fontFamily: "Manrope_700Bold", color: COLORS.onSurface, marginBottom: 8 }}>
              {section.title}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.onSurfaceVariant, lineHeight: 21 }}>
              {section.body}
            </Text>
          </View>
        ))}

        <View style={{ backgroundColor: "#ffffff", borderRadius: 14, padding: 16, marginTop: 8 }}>
          <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.outline, lineHeight: 18 }}>
            Délégué à la protection des données : dpo@lamenagereparis.fr{"\n"}
            Autorité de contrôle : CNIL — www.cnil.fr
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
