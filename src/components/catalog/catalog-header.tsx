"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, LogOut, LogIn, Search, ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface CatalogHeaderProps {
  userName?: string;
  userRole?: string;
  onLogout: () => void;
  isLoggedIn?: boolean;
}

export function CatalogHeader({
  userName,
  userRole,
  onLogout,
  isLoggedIn = false,
}: CatalogHeaderProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[CatalogHeader] handleSearch triggered");
    console.log("[CatalogHeader] searchValue:", searchValue);
    if (searchValue.trim()) {
      console.log(
        "[CatalogHeader] Redirecting to search with query:",
        searchValue
      );
      router.push(`/catalog?search=${encodeURIComponent(searchValue)}`);
    } else {
      console.log(
        "[CatalogHeader] Search value is empty, redirecting to catalog"
      );
      router.push("/catalog");
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Campus Market</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari produk, toko, kategori, atau lokasi"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/cart")}
                  className="gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden md:inline">Keranjang</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/orders")}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden md:inline">Pesanan</span>
                </Button>
                <div className="text-sm text-muted-foreground hidden md:block">
                  Halo, <strong>{userName}</strong>
                  <span className="ml-1 text-xs">({userRole})</span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/register")}
                >
                  Daftar
                </Button>
                <Button size="sm" onClick={() => router.push("/login")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
