"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Product {
  idProduct: number;
  namaProduk: string;
  deskripsi: string | null;
  harga: number;
  stok: number | null;
  kondisi: string | null;
  statusProduk: string | null;
  category: {
    namaKategori: string;
  } | null;
  seller: {
    nama: string;
    kabupatenKota: string;
    provinsi: string;
    toko: {
      namaToko: string;
    } | null;
  };
  productImage: {
    namaGambar: string;
    urutan: number | null;
  }[];
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Memuat produk...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Tidak ada produk tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.idProduct} href={`/catalog/${product.idProduct}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
            {/* Product Image */}
            <div className="w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
              {product.productImage && product.productImage.length > 0 ? (
                <img
                  src={`/fotoBarang/${product.productImage[0].namaGambar}`}
                  alt={product.namaProduk}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    if ((e.target as HTMLImageElement).parentElement) {
                      (e.target as HTMLImageElement).parentElement!.innerHTML =
                        '<p class="text-muted-foreground text-sm">Gambar tidak ditemukan</p>';
                    }
                  }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  Tidak ada gambar
                </p>
              )}
            </div>

            <CardContent className="p-4">
              {/* Category and Condition Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">
                  {product.category?.namaKategori || "Tanpa Kategori"}
                </Badge>
                {product.kondisi && (
                  <Badge variant="outline">{product.kondisi}</Badge>
                )}
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {product.namaProduk}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {product.deskripsi || "Tidak ada deskripsi"}
              </p>

              {/* Seller and Stock Info */}
              <div className="space-y-1 mb-3">
                <p className="text-xs text-muted-foreground">
                  Penjual:{" "}
                  {product.seller.toko?.namaToko || product.seller.nama}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lokasi: {product.seller.kabupatenKota},{" "}
                  {product.seller.provinsi}
                </p>
                <p className="text-xs text-muted-foreground">
                  Stok: {product.stok || 0} pcs
                </p>
              </div>

              {/* Price */}
              <p className="text-xl font-bold text-primary">
                Rp {product.harga.toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
