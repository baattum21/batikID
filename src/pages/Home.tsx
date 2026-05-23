import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

export default function Home() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setData)
      .catch(() => setError("Produk gagal dimuat. Coba lagi nanti."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 rounded-3xl border border-amber-100 bg-white/70 p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
          Batik Id
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900 md:text-4xl">
          Koleksi Batik Pilihan
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Delapan motif andalan — dari Mega Mendung hingga Lasem Merah — siap untuk gaya formal maupun santai.
        </p>
      </div>

      {isLoading && (
        <p className="rounded-2xl border border-amber-100 bg-white p-5 text-stone-600">Memuat produk...</p>
      )}

      {error && !isLoading && (
        <p className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">{error}</p>
      )}

      {!isLoading && !error && (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {data.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
        </section>
      )}
    </main>
  );
}