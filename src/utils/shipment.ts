import type { ShipmentSchedule } from "../types/order";

const toIso = (date: Date) => date.toISOString();

export const buildSimulatedShipment = (
  itemCount: number,
  totalAmount: number,
  fromDate = new Date()
): ShipmentSchedule => {
  const complexityFactor = Math.ceil(totalAmount / 250000);
  const prepHours = 2 + Math.max(1, itemCount);
  const packingHours = prepHours + complexityFactor;
  const handoverHours = packingHours + 6;
  const travelHours = handoverHours + 20 + complexityFactor * 2;

  const packedDate = new Date(fromDate.getTime() + packingHours * 60 * 60 * 1000);
  const handoverDate = new Date(fromDate.getTime() + handoverHours * 60 * 60 * 1000);
  const deliveredDate = new Date(fromDate.getTime() + travelHours * 60 * 60 * 1000);

  return {
    estimatedArrival: toIso(deliveredDate),
    checkpoints: [
      { label: "Pembayaran diverifikasi", scheduledAt: toIso(fromDate) },
      { label: "Pesanan diproses gudang", scheduledAt: toIso(packedDate) },
      { label: "Diserahkan ke kurir", scheduledAt: toIso(handoverDate) },
      { label: "Estimasi tiba", scheduledAt: toIso(deliveredDate) },
    ],
  };
};
