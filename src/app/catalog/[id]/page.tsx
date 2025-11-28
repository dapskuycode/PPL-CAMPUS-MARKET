"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/catalog/star-rating";
import { RatingFormModal } from "@/components/catalog/rating-form-modal";

interface Rating {
  idRating: number;
  nilai: number | null;
  komentar: string | null;
  namaPengunjung: string;
  email: string | null;
  noHP: string | null;
  tanggal: string | null;
}

interface ProductDetail {
  idProduct: number;
  namaProduk: string;
  deskripsi: string | null;
  harga: number;
  stok: number | null;
  kondisi: string | null;
  statusProduk: string | null;
  tanggalUpload: string | null;
  category: {
    namaKategori: string;
  } | null;
  seller: {
    nama: string;
    kabupatenKota: string;
    provinsi: string;
    toko: {
      namaToko: string;
      deskripsiSingkat: string | null;
    } | null;
  };
  productImage: {
    namaGambar: string;
    urutan: number | null;
  }[];
  rating: Rating[];
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState<{ nama?: string; role?: string } | null>(
    null
  );
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in (optional for viewing)
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch product detail
    fetchProductDetail();
  }, [params.id]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/catalog/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil detail produk");
      }

      setProduct(data.product);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (product && product.productImage.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.productImage.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product && product.productImage.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.productImage.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produk tidak ditemukan</p>
          <Link href="/catalog" className="text-primary hover:underline">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          <Link
            href="/catalog"
            className="text-2xl font-bold hover:text-primary transition-colors"
          >
            Campus Market
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <strong>{user?.nama}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground text-sm hover:bg-destructive/90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center text-primary hover:underline mb-6"
        >
          ← Kembali ke Katalog
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image Gallery */}
              <div>
                {product.productImage && product.productImage.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={`/fotoBarang/${product.productImage[currentImageIndex].namaGambar}`}
                        alt={product.namaProduk}
                        className="w-full h-full object-contain"
                      />

                      {/* Navigation Arrows */}
                      {product.productImage.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                          >
                            ←
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                          >
                            →
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      {product.productImage.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} /{" "}
                          {product.productImage.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {product.productImage.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.productImage.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                              currentImageIndex === index
                                ? "border-primary"
                                : "border-muted hover:border-muted-foreground"
                            }`}
                          >
                            <img
                              src={`/fotoBarang/${img.namaGambar}`}
                              alt={`${product.namaProduk} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Tidak ada gambar</p>
                  </div>
                )}
              </div>

              {/* Right Side - Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-3">
                    {product.namaProduk}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {product.category?.namaKategori || "Tanpa Kategori"}
                    </Badge>
                    {product.kondisi && (
                      <Badge variant="outline">{product.kondisi}</Badge>
                    )}
                  </div>
                </div>

                <div className="border-t border-b py-4">
                  <p className="text-3xl font-bold text-primary">
                    Rp {product.harga.toLocaleString("id-ID")}
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold text-lg mb-2">Deskripsi</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Stok</p>
                    <p className="font-semibold">
                      {product.stok !== null
                        ? `${product.stok} unit`
                        : "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">
                      {product.statusProduk || "-"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Informasi Penjual
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="font-semibold">
                        {product.seller.toko?.namaToko || product.seller.nama}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.seller.nama}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.seller.kabupatenKota},{" "}
                        {product.seller.provinsi}
                      </p>
                      {product.seller.toko?.deskripsiSingkat && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {product.seller.toko.deskripsiSingkat}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {product.tanggalUpload && (
                  <p className="text-sm text-muted-foreground">
                    Diupload pada{" "}
                    {new Date(product.tanggalUpload).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ratings and Comments Section */}
        {product.rating && product.rating.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Ulasan dan Komentar</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.rating.length} ulasan
                  </p>
                </div>
                <Button onClick={() => setRatingModalOpen(true)}>
                  Tulis Ulasan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Rating Summary */}
              <div className="pb-6 border-b">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Rating Keseluruhan
                </p>
                <StarRating
                  ratings={product.rating}
                  showCount={true}
                  size={20}
                />
              </div>

              {/* Individual Comments */}
              <div className="space-y-4">
                {product.rating.map((comment) => (
                  <div
                    key={comment.idRating}
                    className="pb-4 border-b last:border-0"
                  >
                    {/* Reviewer Name and Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{comment.namaPengunjung}</p>
                        {comment.tanggal && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        )}
                      </div>
                      {comment.nilai && (
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < (comment.nilai || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comment Text */}
                    {comment.komentar && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {comment.komentar}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating Form Modal */}
        {product && (
          <RatingFormModal
            isOpen={ratingModalOpen}
            onClose={() => setRatingModalOpen(false)}
            productId={product.idProduct}
            productName={product.namaProduk}
          />
        )}
      </main>
    </div>
  );
}
