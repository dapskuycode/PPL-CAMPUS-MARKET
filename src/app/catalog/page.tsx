"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryBrowse } from "@/components/catalog/category-browse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconShoppingCart, IconSearch } from "@tabler/icons-react";
import { Product, Rating } from "@/types/product";

interface Category {
  idCategory: number;
  namaKategori: string;
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ nama?: string; role?: string } | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch categories
    fetchCategories();

    // Read parameters dari URL
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    console.log("[CatalogPage] Search param from URL:", searchParam);
    console.log("[CatalogPage] Category param from URL:", categoryParam);

    // Validate and clean parameters
    const validSearchParam =
      searchParam && searchParam !== "undefined" ? searchParam : "";
    const validCategoryParam =
      categoryParam &&
      categoryParam !== "undefined" &&
      !isNaN(Number(categoryParam))
        ? categoryParam
        : "";

    setSearchQuery(validSearchParam);
    setSelectedCategory(validCategoryParam);

    // Fetch products dengan filter
    fetchProducts(validSearchParam, validCategoryParam);
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (query: string = "", categoryId: string = "") => {
    try {
      setLoading(true);

      console.log(
        "[fetchProducts] Called with query:",
        query,
        "categoryId:",
        categoryId
      );

      // Build URL dengan parameter
      // Jika ada search query, gunakan endpoint search yang sudah mendukung pencarian:
      // - Nama produk
      // - Kategori produk
      // - Nama toko
      // - Lokasi (kabupaten/kota dan provinsi)
      let url = "/api/catalog";
      const params = new URLSearchParams();

      if (query && query.trim() !== "") {
        // Gunakan endpoint search untuk pencarian multi-field
        url = "/api/catalog/search";
        params.append("q", query);
        console.log("[fetchProducts] Using search endpoint with query:", query);
      } else {
        // Gunakan endpoint catalog biasa untuk filter kategori
        if (
          categoryId &&
          categoryId.trim() !== "" &&
          !isNaN(Number(categoryId))
        ) {
          params.append("categories", categoryId);
          console.log("[fetchProducts] Added categories param:", categoryId);
        }
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log("[fetchProducts] Final URL:", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(
        "[fetchProducts] Response OK:",
        response.ok,
        "Products count:",
        data.products?.length
      );
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error("Failed to fetch products:", data);
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
      <CatalogHeader
        userName={user?.nama}
        userRole={user?.role}
        onLogout={handleLogout}
        isLoggedIn={!!user}
      />

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
                <CardDescription className="text-base mt-1">
                  {searchQuery
                    ? `Hasil pencarian untuk: "${searchQuery}"`
                    : selectedCategory
                    ? `Menampilkan produk kategori: ${
                        categories.find(
                          (c) => c.idCategory === parseInt(selectedCategory)
                        )?.namaKategori || "..."
                      }`
                    : "Jelajahi semua produk yang tersedia di Campus Market"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Category Browse Section */}
        {!searchQuery && !selectedCategory && (
          <CategoryBrowse categories={categories} />
        )}

        {/* Selected Category Info with Clear Filter */}
        {selectedCategory && !searchQuery && (
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/catalog")}
            >
              ← Lihat Semua Kategori
            </Button>
          </div>
        )}

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
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "Tidak Ada Hasil" : "Belum Ada Produk"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchQuery
                  ? `Tidak ditemukan produk yang sesuai dengan pencarian "${searchQuery}". Coba kata kunci lain.`
                  : "Saat ini belum ada produk yang tersedia. Silakan cek kembali nanti."}
              </p>
              {user?.role === "penjual" && !searchQuery && (
                <Button onClick={() => router.push("/dashboard")}>
                  Mulai Jual Produk
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <ProductGrid products={products} loading={false} />
        )}
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
