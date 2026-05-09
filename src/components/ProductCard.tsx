import type { Product } from "../types/product";
import { formatRupiah } from "../utils/format";
import { Link } from "react-router-dom";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/product/${p.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 text-5xl transition duration-300 group-hover:scale-105">
            <span className="drop-shadow-sm">👘</span>
          </div>
        )}

        <div className="p-5">
          <h2 className="font-semibold text-stone-900 transition group-hover:text-amber-700">
            {p.name}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-stone-500">
            {p.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <p className="font-bold text-stone-900">
              {formatRupiah(p.price)}
            </p>

            <span className="text-xs font-medium text-amber-700">
              Lihat →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}