export interface CheckoutItemPayload {
  productId: number;
  qty: number;
  unitPrice: number;
}

export interface ShipmentCheckpoint {
  label: string;
  scheduledAt: string;
}

export interface ShipmentSchedule {
  estimatedArrival: string;
  checkpoints: ShipmentCheckpoint[];
}

export interface CheckoutPayload {
  items: CheckoutItemPayload[];
  totalAmount: number;
}

export interface CheckoutResponse {
  orderId: string;
  totalAmount: number;
  shipment?: ShipmentSchedule;
  /** Present when the API is configured with Midtrans; open with Snap `pay`. */
  snapToken?: string;
  message?: string;
}
