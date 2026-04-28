import type { CartItem } from "../../lib/types";

export type PaymentInput = {
  items: CartItem[];
  amountCents: number;
  currency: "eur";
  email?: string;
  shippingAddressId?: string;
  shippingMethod?: string;
};

export type PaymentResult =
  | { ok: true; paymentIntentId: string; orderId: string }
  | { ok: false; error: string };

const FAKE_DELAY_MS = 1500;

async function mockProcessPayment(input: PaymentInput): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, FAKE_DELAY_MS));
  if (input.amountCents <= 0) {
    return { ok: false, error: "Montant invalide" };
  }
  return {
    ok: true,
    paymentIntentId: `pi_mock_${Date.now()}`,
    orderId: `LMP-${Date.now()}`,
  };
}

// When backend + @stripe/stripe-react-native are available, swap this for:
//   1. POST /payments/create-intent → { clientSecret }
//   2. presentPaymentSheet({ clientSecret })
//   3. POST /orders → { orderId }
export async function processPayment(input: PaymentInput): Promise<PaymentResult> {
  return mockProcessPayment(input);
}
