import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";
import type { Order, OrderStatus, OrderTimelineEntry, ShippingZone } from "../../lib/types";
import { MOCK_PRODUCTS } from "../../lib/mock-data";

const STATUS_FLOW: OrderStatus[] = [
  "commande_confirmee",
  "en_preparation",
  "en_attente_expedition",
  "expediee",
  "livree",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  commande_confirmee: "Commande confirmée",
  en_preparation: "En préparation",
  en_attente_expedition: "En attente d'expédition",
  expediee: "Expédiée",
  livree: "Livrée",
};

function buildTimeline(currentStatus: OrderStatus, createdAt: string): OrderTimelineEntry[] {
  const currentIdx = STATUS_FLOW.indexOf(currentStatus);
  return STATUS_FLOW.map((status, i) => ({
    status,
    label: STATUS_LABELS[status],
    timestamp:
      i <= currentIdx
        ? new Date(new Date(createdAt).getTime() + i * 86400000).toISOString()
        : undefined,
    completed: i < currentIdx,
  }));
}

function makeMockOrder(opts: {
  id: string;
  orderNumber: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  territory?: ShippingZone;
}): Order | null {
  const product = MOCK_PRODUCTS.find((p) => p.id === opts.productId);
  if (!product || !product.price) return null;
  const subtotal = product.price * opts.quantity;
  const shippingCost = 0;
  return {
    id: opts.id,
    orderNumber: opts.orderNumber,
    items: [
      {
        id: `${opts.id}-i1`,
        product,
        quantity: opts.quantity,
        price: product.price,
      },
    ],
    status: opts.status,
    total: subtotal + shippingCost,
    subtotal,
    shippingCost,
    shippingAddress: {
      id: "addr-mock",
      firstName: "Jean",
      lastName: "Laurent",
      street: "12 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
      country: "France",
      territory: opts.territory ?? "metropole",
    },
    territory: opts.territory ?? "metropole",
    shippingMethod: "standard",
    estimatedDelivery: "2-3 semaines",
    createdAt: opts.createdAt,
    timeline: buildTimeline(opts.status, opts.createdAt),
  };
}

const SEED_ORDERS: Order[] = [
  makeMockOrder({
    id: "ord1",
    orderNumber: "LMP-2026-001",
    productId: "s1",
    quantity: 1,
    status: "en_preparation",
    createdAt: "2026-04-02T10:00:00Z",
  }),
  makeMockOrder({
    id: "ord2",
    orderNumber: "LMP-2026-002",
    productId: "ch1",
    quantity: 1,
    status: "expediee",
    createdAt: "2026-03-20T14:30:00Z",
  }),
].filter((o): o is Order => Boolean(o));

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  advanceStatus: (orderId: string) => void;
  setStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      advanceStatus: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        const idx = STATUS_FLOW.indexOf(order.status);
        if (idx < 0 || idx >= STATUS_FLOW.length - 1) return;
        const nextStatus = STATUS_FLOW[idx + 1];
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status: nextStatus, timeline: buildTimeline(nextStatus, o.createdAt) }
              : o,
          ),
        }));
      },

      setStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, status, timeline: buildTimeline(status, o.createdAt) }
              : o,
          ),
        })),
    }),
    {
      name: "orders-storage",
      storage: createJSONStorage(() => persistStorage),
    },
  ),
);

export const ORDER_STATUS_LABELS = STATUS_LABELS;
export const ORDER_STATUS_FLOW = STATUS_FLOW;

export function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}
