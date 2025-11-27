"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  idCategory: number;
  namaKategori: string;
}

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
    toko: {
      namaToko: string;
    } | null;
  };
  productImage: {
    namaGambar: string;
    urutan: number | null;
  }[];
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);

  useEffect(() => {
    // Check if user is logged in (optional for home page)
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Redirect admin to admin page
      if (parsedUser.role === "admin") {
        router.push("/admin");
        return;
      }
    }
    
    fetchCategories();
    fetchProducts();
  }, [router]);

  useEffect(() => {
    // Refetch products when category filter changes
    fetchProducts();
  }, [selectedCategories, showAllCategories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/catalog");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "/api/catalog";
      if (!showAllCategories && selectedCategories.length > 0) {
        url += `?categories=${selectedCategories.join(",")}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setShowAllCategories(false);
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        const newSelected = prev.filter((id) => id !== categoryId);
        if (newSelected.length === 0) {
          setShowAllCategories(true);
        }
        return newSelected;
      }
      return [...prev, categoryId];
    });
  };

  const handleAllCategoriesToggle = () => {
    setShowAllCategories(true);
    setSelectedCategories([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600">
            Campus Market
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-zinc-600">
                  <strong>{user.nama}</strong>
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
                <button
                  onClick={() => setOpenRegister(true)}
                  className="rounded-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700"
                >
                  Register
                </button>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Kategori</h2>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAllCategories}
                    onChange={handleAllCategoriesToggle}
                    className="mr-3 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700">Semua Kategori</span>
                </label>
                {categories.map((category) => (
                  <label key={category.idCategory} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.idCategory)}
                      onChange={() => handleCategoryToggle(category.idCategory)}
                      className="mr-3 w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-700">{category.namaKategori}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Katalog Produk</h1>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Memuat produk...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Tidak ada produk tersedia.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.idProduct}
                    href={`/product/${product.idProduct}`}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      {product.productImage && product.productImage.length > 0 ? (
                        <img
                          src={`/fotoBarang/${product.productImage[0].namaGambar}`}
                          alt={product.namaProduk}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Image load error:", product.productImage[0].namaGambar);
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<p class="text-gray-400 text-sm">Gambar tidak ditemukan</p>';
                          }}
                        />
                      ) : (
                        <p className="text-gray-400 text-sm">Tidak memiliki gambar</p>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {product.category?.namaKategori || "Tanpa Kategori"}
                        </span>
                        {product.kondisi && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {product.kondisi}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {product.namaProduk}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.deskripsi || "Tidak ada deskripsi"}
                      </p>
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Penjual: {product.seller.toko?.namaToko || product.seller.nama}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stok: {product.stok || 0} pcs
                        </p>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        Rp {product.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {openRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenRegister(false)}
          />

          <div className="relative z-10 w-[92%] max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-black mb-4">Daftar sebagai</h2>
            <p className="text-sm text-zinc-600 mb-6">Pilih peran untuk proses registrasi.</p>

            <div className="flex gap-3">
              <Link
                href="/register?role=pembeli"
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700"
                onClick={() => setOpenRegister(false)}
              >
                Pembeli
              </Link>
              <Link
                href="/register?role=penjual"
                className="flex-1 rounded-md border border-zinc-200 px-4 py-2 text-center text-zinc-800 hover:bg-zinc-50"
                onClick={() => setOpenRegister(false)}
              >
                Penjual
              </Link>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setOpenRegister(false)}
                className="text-sm text-zinc-600 hover:underline"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
