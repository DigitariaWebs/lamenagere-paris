import { useOrdersStore } from "./store";

export const useOrders = () => {
  const orders = useOrdersStore((s) => s.orders);
  return { data: orders, isLoading: false };
};

export const useOrder = (orderId: string) => {
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === orderId));
  return { data: order, isLoading: false };
};
