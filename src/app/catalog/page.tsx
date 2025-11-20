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

export default function CatalogPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
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
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleAllCategoriesToggle = () => {
    setShowAllCategories(true);
    setSelectedCategories([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Campus Market</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">
              Halo, <strong>{user.nama}</strong> ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {user.role === "penjual" && user.toko && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900">Toko Anda</h3>
            <p className="text-blue-700">{user.toko.namaToko}</p>
            {user.toko.deskripsiSingkat && (
              <p className="text-sm text-blue-600 mt-1">{user.toko.deskripsiSingkat}</p>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sticky top-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Filter Kategori</h3>
              
              <div className="space-y-3">
                {/* All Categories */}
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={showAllCategories}
                    onChange={handleAllCategoriesToggle}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Semua Kategori
                  </span>
                </label>

                <div className="border-t border-gray-200 my-2"></div>

                {/* Category List */}
                {categories.map((category) => (
                  <label
                    key={category.idCategory}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.idCategory)}
                      onChange={() => handleCategoryToggle(category.idCategory)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.namaKategori}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {showAllCategories 
                ? "Semua Produk" 
                : `Produk (${selectedCategories.length} kategori dipilih)`}
            </h2>
            
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
                    href={`/catalog/${product.idProduct}`}
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
    </div>
  );
}
