import { useCart } from "../contexts/CartContext";
import { formatRupiah } from "../utils/format";
import { checkout, getHealth } from "../services/api";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { CheckoutResponse, ShipmentSchedule } from "../types/order";
import { loadMidtransSnapScript } from "../utils/midtransSnap";
import { buildSimulatedShipment } from "../utils/shipment";

export default function Cart() {
  const { cart, increase, decrease, remove, clearCart, total } = useCart();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shipment, setShipment] = useState<ShipmentSchedule | null>(null);

  const onCheckout = async () => {
    if (!isAuthenticated || !token) {
      navigate("/login?redirect=/cart");
      return;
    }

    setError("");
    setMessage("");
    setShipment(null);
    setIsCheckingOut(true);
    try {
      const clientKeyPreview = import.meta.env.VITE_MIDTRANS_CLIENT_KEY?.trim();
      const health = await getHealth();
      if (health.snapEnabled && !clientKeyPreview) {
        setError(
          "Backend mengaktifkan Midtrans Snap, tetapi VITE_MIDTRANS_CLIENT_KEY kosong. Buat/ubah file .env di folder batik-fe (salin dari .env.example), isi VITE_MIDTRANS_CLIENT_KEY dengan Client Key sandbox dari https://dashboard.sandbox.midtrans.com/settings/config_info lalu stop dan jalankan ulang npm run dev."
        );
        return;
      }

      const payload = {
        items: cart.map(item => ({
          productId: item.id,
          qty: item.qty,
          unitPrice: item.price,
        })),
        totalAmount: total,
      };
      const result = await checkout(payload, token);

      const finalizeSuccess = (order: CheckoutResponse, fromSnap?: boolean) => {
        const fallbackSimulation = buildSimulatedShipment(
          cart.reduce((acc, item) => acc + item.qty, 0),
          total
        );
        setShipment(order.shipment || fallbackSimulation);
        clearCart();
        if (fromSnap) {
          setMessage("Pembayaran dikonfirmasi. Pesanan kamu sedang diproses.");
        } else {
          setMessage(order.message || "Checkout berhasil! Pesanan kamu sedang diproses.");
        }
      };

      if (result.snapToken) {
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY?.trim();
        if (!clientKey) {
          setError(
            `Pesanan ${result.orderId} sudah dibuat di server, tetapi VITE_MIDTRANS_CLIENT_KEY belum diatur di frontend. Isi di file .env lalu jalankan ulang dev server.`
          );
          return;
        }

        const useProd = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true";
        await loadMidtransSnapScript(clientKey, useProd);

        if (!window.snap?.pay) {
          setError("Midtrans Snap tidak tersedia setelah skrip dimuat. Periksa pemblokir iklan atau konsol browser.");
          return;
        }

        let paymentSettled = false;
        await new Promise<void>(resolve => {
          window.snap!.pay(result.snapToken!, {
            language: "id",
            onSuccess: () => {
              paymentSettled = true;
              finalizeSuccess(result, true);
              resolve();
            },
            onPending: () => {
              paymentSettled = true;
              finalizeSuccess(result, true);
              resolve();
            },
            onError: () => {
              setError("Pembayaran gagal. Silakan coba lagi.");
              resolve();
            },
            onClose: () => {
              if (!paymentSettled) {
                setMessage(
                  `Pembayaran belum diselesaikan. ID pesanan: ${result.orderId}. Barang tetap di keranjang — jangan checkout ulang untuk pesanan yang sama kecuali kamu sengaja membuat pesanan baru.`
                );
              }
              resolve();
            },
          });
        });
      } else {
        finalizeSuccess(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout gagal. Silakan coba lagi.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Keranjang Belanja</h1>

      {message && <p className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

      {cart.length === 0 && (
        <p className="rounded-2xl border border-amber-100 bg-white p-6 text-stone-600">
          Keranjang masih kosong. Yuk pilih produk batik favoritmu.
        </p>
      )}

      {cart.map(i => (
        <div key={i.id} className="mb-3 flex justify-between rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <div>
            <h2 className="font-semibold text-stone-900">{i.name}</h2>
            <p className="text-sm text-stone-500">{formatRupiah(i.price)}</p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => decrease(i.id)}
                className="h-8 w-8 rounded-md border border-amber-200 text-stone-700 transition hover:bg-amber-50"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{i.qty}</span>
              <button
                onClick={() => increase(i.id)}
                className="h-8 w-8 rounded-md border border-amber-200 text-stone-700 transition hover:bg-amber-50"
              >
                +
              </button>
            </div>
          </div>

          <button onClick={() => remove(i.id)} className="text-sm font-medium text-red-600 hover:underline">
            Hapus
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="font-semibold text-stone-900">Total: {formatRupiah(total)}</p>

          <button
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="mt-4 w-full rounded-xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
          >
            {isCheckingOut ? "Menyiapkan pembayaran..." : "Bayar sekarang"}
          </button>
        </div>
      )}

      {shipment && (
        <section className="mt-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Simulasi Status Pengiriman</h2>
          <p className="mt-1 text-sm text-stone-600">
            Estimasi tiba: {new Date(shipment.estimatedArrival).toLocaleString("id-ID")}
          </p>
          <div className="mt-4 space-y-3">
            {shipment.checkpoints.map(point => (
              <div key={`${point.label}-${point.scheduledAt}`} className="rounded-xl bg-amber-50 p-3">
                <p className="font-medium text-stone-800">{point.label}</p>
                <p className="text-sm text-stone-600">
                  {new Date(point.scheduledAt).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}