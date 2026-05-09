import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { formatRupiah } from "../utils/format";

export default function Detail() {
  const { id } = useParams();
  const [p, setP] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then(d => {
        setP(d.find((x: Product) => x.id === Number(id)) ?? null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-6 py-8 text-stone-600">Memuat produk...</div>;
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
          Produk tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-6 py-8 md:grid-cols-2">
      {p.imageUrl ? (
        <img src={p.imageUrl} alt={p.name} className="h-80 w-full rounded-3xl border border-amber-100 object-cover shadow-sm" />
      ) : (
        <div className="flex h-80 items-center justify-center rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 text-8xl shadow-sm">
          👘
        </div>
      )}

      <div>
        <Link to="/" className="text-sm font-medium text-amber-700 hover:underline">
          ← Kembali ke katalog
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-stone-900">{p.name}</h1>
        <p className="mt-3 leading-relaxed text-stone-600">{p.description}</p>
        <p className="mt-6 text-2xl font-bold text-stone-900">{formatRupiah(p.price)}</p>

        <button
          onClick={() => addToCart(p)}
          className="mt-6 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </main>
  );
}