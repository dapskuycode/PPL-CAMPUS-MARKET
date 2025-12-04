"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  idCart: number;
  quantity: number;
  product: {
    idProduct: number;
    namaProduk: string;
    harga: number;
    stok: number;
    kondisi: string;
    productImage: {
      namaGambar: string;
    }[];
    seller: {
      nama: string;
      toko: {
        namaToko: string;
      } | null;
    };
  };
}

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchCart();
  }, [router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/cart");
      const data = await response.json();

      if (response.ok) {
        setCartItems(data.cart);
      } else {
        console.error("Failed to fetch cart:", data.error);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (idCart: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(idCart);
      const response = await authFetch(`/api/cart/${idCart}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCart();
      } else {
        alert(data.error || "Gagal mengupdate quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Terjadi kesalahan saat mengupdate quantity");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (idCart: number) => {
    if (!confirm("Hapus item dari keranjang?")) return;

    try {
      setUpdating(idCart);
      const response = await authFetch(`/api/cart/${idCart}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCart();
      } else {
        alert(data.error || "Gagal menghapus item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Terjadi kesalahan saat menghapus item");
    } finally {
      setUpdating(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.product.harga) * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/catalog")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali Belanja
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Keranjang Belanja
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Keranjang Belanja Kosong
              </h3>
              <p className="text-muted-foreground mb-6">
                Anda belum menambahkan produk ke keranjang
              </p>
              <Button onClick={() => router.push("/catalog")}>
                Mulai Belanja
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.idCart}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
                        {item.product.productImage.length > 0 ? (
                          <Image
                            src={item.product.productImage[0].namaGambar}
                            alt={item.product.namaProduk}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {item.product.namaProduk}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product.seller.toko?.namaToko ||
                            item.product.seller.nama}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {item.product.kondisi}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Stok: {item.product.stok}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          Rp {Number(item.product.harga).toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.idCart)}
                          disabled={updating === item.idCart}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.idCart, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 || updating === item.idCart
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.idCart, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.product.stok ||
                              updating === item.idCart
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-sm font-semibold mt-2">
                          Subtotal: Rp{" "}
                          {(
                            Number(item.product.harga) * item.quantity
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Belanja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Item ({cartItems.length})
                      </span>
                      <span>
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        pcs
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Harga</span>
                      <span className="font-bold text-2xl text-primary">
                        Rp {calculateSubtotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => router.push("/checkout")}
                  >
                    Lanjut ke Checkout
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Dengan melanjutkan, Anda menyetujui syarat dan ketentuan
                    yang berlaku
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
