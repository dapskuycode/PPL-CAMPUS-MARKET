"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
    toko: {
      namaToko: string;
      deskripsiSingkat: string | null;
    } | null;
  };
  productImage: {
    namaGambar: string;
    urutan: number | null;
  }[];
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // Check if user is logged in (optional for viewing)
    const userData = localStorage.getItem("user");
    console.log("=== DEBUG LOGIN STATE ===");
    console.log("localStorage user:", userData);

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user:", parsedUser);
        console.log("Has idUser?", parsedUser?.idUser);

        if (parsedUser && parsedUser.idUser) {
          setUser(parsedUser);
          setIsLoggedIn(true);
          console.log("✅ User is logged in");
        } else {
          setUser(null);
          setIsLoggedIn(false);
          console.log("❌ User data invalid, not logged in");
        }
      } catch (e) {
        console.log("❌ Error parsing user data:", e);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
      console.log("❌ No user data in localStorage");
    }

    console.log("isLoggedIn state:", isLoggedIn);
    console.log("========================");

    // Fetch product detail
    fetchProductDetail();
  }, [params.id]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/product/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil detail produk");
      }

      setProduct(data.product);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
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
    setUser(null);
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleAddToCart = async () => {
    if (!user) {
      if (confirm("Anda harus login terlebih dahulu. Login sekarang?")) {
        router.push("/login");
      }
      return;
    }

    if (!product || product.stok === null || product.stok < 1) {
      alert("Produk tidak tersedia atau stok habis");
      return;
    }

    try {
      setAddingToCart(true);
      const response = await authFetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProduct: product.idProduct,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Produk berhasil ditambahkan ke keranjang!");
      } else {
        alert(data.error || "Gagal menambahkan ke keranjang");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Terjadi kesalahan saat menambahkan ke keranjang");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Produk tidak ditemukan</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600"
          >
            Campus Market
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-zinc-600">
                  <strong>{user?.nama || "User"}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-white text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700"
                >
                  Daftar
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:underline mb-6"
        >
          ← Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-6">
          {/* Left Side - Image Gallery */}
          <div>
            {product.productImage && product.productImage.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`/fotoBarang/${product.productImage[currentImageIndex].namaGambar}`}
                    alt={product.namaProduk}
                    className="w-full h-full object-contain"
                  />

                  {/* Navigation Arrows */}
                  {product.productImage.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                      >
                        ←
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product.productImage.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {product.productImage.length}
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
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          currentImageIndex === index
                            ? "border-blue-600"
                            : "border-gray-300 hover:border-gray-400"
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
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Tidak ada gambar</p>
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.namaProduk}
              </h1>
              <div className="flex gap-2 mb-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {product.category?.namaKategori || "Tanpa Kategori"}
                </span>
                {product.kondisi && (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {product.kondisi}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-3xl font-bold text-blue-600">
                Rp {product.harga.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Deskripsi</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.deskripsi || "Tidak ada deskripsi"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Stok</p>
                <p className="font-semibold">
                  {product.stok !== null
                    ? `${product.stok} unit`
                    : "Tidak tersedia"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold capitalize">
                  {product.statusProduk || "-"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-2">Informasi Penjual</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-800">
                  {product.seller.toko?.namaToko || product.seller.nama}
                </p>
                {product.seller.toko?.deskripsiSingkat && (
                  <p className="text-sm text-gray-600 mt-1">
                    {product.seller.toko.deskripsiSingkat}
                  </p>
                )}
              </div>
            </div>

            {product.tanggalUpload && (
              <p className="text-sm text-gray-500">
                Diupload pada{" "}
                {new Date(product.tanggalUpload).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {/* Add to Cart Button */}
            <div className="border-t border-gray-200 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={
                  addingToCart ||
                  !product.stok ||
                  product.stok < 1 ||
                  product.statusProduk !== "aktif"
                }
                size="lg"
                className="w-full"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addingToCart
                  ? "Menambahkan..."
                  : !product.stok || product.stok < 1
                  ? "Stok Habis"
                  : product.statusProduk !== "aktif"
                  ? "Produk Tidak Aktif"
                  : "Tambah ke Keranjang"}
              </Button>
              {!user && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Login terlebih dahulu untuk berbelanja
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
