import type { Order } from "../../lib/types";

export interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
}
