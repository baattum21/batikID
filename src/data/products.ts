import type { Product } from "../types/product";

/** Katalog pengujian capstone — selaras dengan tabel order_items & produk ID 1–8. */
export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Batik Tulis Mega Mendung",
    price: 850_000,
    description:
      "Batik tulis motif Mega Mendung khas Cirebon. Awan mendung melambangkan ketenangan dan kepemimpinan.",
    imageUrl: "/products/mega-mendung.jpg",
    stock: 12,
  },
  {
    id: 2,
    name: "Batik Cap Parang Rusak",
    price: 320_000,
    description:
      "Batik cap motif Parang Rusak dari Yogyakarta. Pola diagonal klasik untuk acara resmi.",
    imageUrl: "/products/parang-rusak.jpg",
    stock: 25,
  },
  {
    id: 3,
    name: "Batik Tulis Kawung Premium",
    price: 1_200_000,
    description:
      "Batik tulis motif Kawung premium. Geometri kotak melambangkan kesucian dan keteguhan.",
    imageUrl: "/products/kawung.jpg",
    stock: 8,
  },
  {
    id: 4,
    name: "Batik Cap Semen Rante",
    price: 275_000,
    description:
      "Batik cap motif Semen Rante dengan isian flora. Cocok untuk keseharian maupun pesta.",
    imageUrl: "/products/semen-rante.jpg",
    stock: 30,
  },
  {
    id: 5,
    name: "Batik Tulis Sido Mukti",
    price: 980_000,
    description:
      "Batik tulis motif Sido Mukti khas Solo. Simbol harapan dan kebahagiaan dalam pernikahan.",
    imageUrl: "/products/sido-mukti.jpg",
    stock: 10,
  },
  {
    id: 6,
    name: "Batik Cap Truntum",
    price: 310_000,
    description:
      "Batik cap motif Truntum dari Yogyakarta. Motif bunga melambangkan cinta yang tumbuh kembali.",
    imageUrl: "/products/truntum.jpg",
    stock: 22,
  },
  {
    id: 7,
    name: "Batik Tulis Pring Sedapur",
    price: 720_000,
    description:
      "Batik tulis motif Pring Sedapur. Pola bambu dan dedaunan khas keraton Yogyakarta.",
    imageUrl: "/products/pring-sedapur.jpg",
    stock: 14,
  },
  {
    id: 8,
    name: "Batik Cap Lasem Merah",
    price: 450_000,
    description:
      "Batik cap Lasem dengan dominasi merah. Perpaduan motif Jawa dan pesisir Lasem.",
    imageUrl: "/products/lasem-merah.jpg",
    stock: 18,
  },
];

/** Gabungkan API (harga/nama/stok = sumber checkout) dengan gambar lokal di FE. */
export function mergeWithCatalog(remote: Product[]): Product[] {
  if (remote.length === 0) return CATALOG_PRODUCTS;

  const remoteById = new Map(remote.map(p => [p.id, p]));
  return CATALOG_PRODUCTS.map(local => {
    const item = remoteById.get(local.id);
    if (!item) return local;
    return {
      ...item,
      imageUrl: local.imageUrl,
      description: item.description || local.description,
    };
  });
}
