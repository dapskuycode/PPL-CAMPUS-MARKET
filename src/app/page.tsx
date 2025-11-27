"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { ProductGrid } from "@/components/catalog/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconShoppingCart, IconSearch } from "@tabler/icons-react";

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
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
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
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader userName={user?.nama} userRole={user?.role} onLogout={handleLogout} isLoggedIn={!!user} />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <IconShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">Katalog Produk</CardTitle>
                <CardDescription className="text-base mt-1">Jelajahi semua produk yang tersedia di Campus Market</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-muted rounded-full mb-4">
                <IconSearch className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum Ada Produk</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">Saat ini belum ada produk yang tersedia. Silakan cek kembali nanti.</p>
              {user?.role === "penjual" && <Button onClick={() => router.push("/dashboard")}>Mulai Jual Produk</Button>}
            </CardContent>
          </Card>
        ) : (
          <ProductGrid products={products} loading={false} />
        )}
      </main>
    </div>
  );
}
