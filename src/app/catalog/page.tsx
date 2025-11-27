"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { ProductGrid } from "@/components/catalog/product-grid";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/catalog");
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader userName={user.nama} userRole={user.role} onLogout={handleLogout} />

      <main className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Katalog Produk</h1>
          <p className="text-muted-foreground">Jelajahi semua produk yang tersedia di Campus Market</p>
        </div>

        <ProductGrid products={products} loading={loading} />
      </main>
    </div>
  );
}
