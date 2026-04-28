import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../lib/constants";
import type { OrderStatus, QuoteStatus } from "../../lib/types";

interface StatusBadgeProps {
  status: OrderStatus | QuoteStatus;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  commande_confirmee: { label: "CONFIRMÉE", bg: COLORS.primary, text: COLORS.onPrimary },
  en_preparation: { label: "EN PRÉPARATION", bg: COLORS.primary, text: COLORS.onPrimary },
  en_attente_expedition: { label: "EN ATTENTE", bg: COLORS.secondary, text: COLORS.onPrimary },
  expediee: { label: "EXPÉDIÉE", bg: "transparent", text: COLORS.onSurface },
  livree: { label: "LIVRÉE", bg: COLORS.success, text: "#ffffff" },
  en_attente_devis: { label: "EN ATTENTE DE DEVIS", bg: COLORS.secondary, text: COLORS.onPrimary },
  devis_envoye: { label: "DEVIS PRÊT", bg: COLORS.success, text: "#ffffff" },
  devis_accepte: { label: "ACCEPTÉ", bg: COLORS.success, text: "#ffffff" },
  devis_rejete: { label: "REJETÉ", bg: COLORS.error, text: "#ffffff" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.toUpperCase(),
    bg: COLORS.outline,
    text: COLORS.onPrimary,
  };

  const isOutline = config.bg === "transparent";

  return (
    <View
      className="rounded-full py-1 px-3"
      style={{
        backgroundColor: config.bg,
        borderWidth: isOutline ? 1 : 0,
        borderColor: COLORS.outlineVariant,
      }}
    >
      <Text
        className="text-[10px] uppercase font-semibold tracking-widest"
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </View>
  );
}
