"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, MapPin, ArrowLeft } from "lucide-react";

interface CartItem {
  idCart: number;
  quantity: number;
  product: {
    idProduct: number;
    namaProduk: string;
    harga: number;
    productImage: {
      namaGambar: string;
    }[];
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    paymentMethod: "",
    shippingAddress: "",
    orderNotes: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Set default shipping address dari data user
    const defaultAddress = `${parsedUser.alamatJalan}, RT ${parsedUser.rt}/RW ${parsedUser.rw}, ${parsedUser.namaKelurahan}, ${parsedUser.kecamatan || ""}, ${parsedUser.kabupatenKota}, ${parsedUser.provinsi}`;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: defaultAddress,
    }));

    fetchCart();
  }, [router]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/cart");
      const data = await response.json();

      if (response.ok) {
        if (data.cart.length === 0) {
          alert("Keranjang kosong");
          router.push("/cart");
          return;
        }
        setCartItems(data.cart);
      } else {
        alert(data.error || "Gagal memuat keranjang");
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Terjadi kesalahan");
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.product.harga) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      alert("Pilih metode pembayaran");
      return;
    }

    if (!formData.shippingAddress.trim()) {
      alert("Alamat pengiriman harus diisi");
      return;
    }

    try {
      setSubmitting(true);
      const response = await authFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order berhasil dibuat!");
        router.push(`/orders/${data.order.idOrder}`);
      } else {
        alert(data.error || "Gagal membuat order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Terjadi kesalahan saat membuat order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Memuat data checkout...</p>
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
              onClick={() => router.push("/cart")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Keranjang
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Checkout
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alamat Pengiriman */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Alamat Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Alamat Lengkap *</Label>
                    <Textarea
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shippingAddress: e.target.value,
                        }))
                      }
                      rows={4}
                      required
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Pastikan alamat sudah benar dan lengkap
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Metode Pembayaran */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Pilih Metode *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transfer">
                          Transfer Bank
                        </SelectItem>
                        <SelectItem value="cod">
                          COD (Cash on Delivery)
                        </SelectItem>
                        <SelectItem value="e-wallet">E-Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="orderNotes">Catatan (Opsional)</Label>
                    <Textarea
                      id="orderNotes"
                      value={formData.orderNotes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          orderNotes: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Tambahkan catatan untuk penjual"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.idCart}
                        className="flex justify-between text-sm"
                      >
                        <span className="flex-1 truncate">
                          {item.product.namaProduk} x{item.quantity}
                        </span>
                        <span className="font-medium ml-2">
                          Rp{" "}
                          {(
                            Number(item.product.harga) * item.quantity
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>Rp {calculateTotal().toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Biaya Pengiriman
                      </span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      Rp {calculateTotal().toLocaleString("id-ID")}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? "Memproses..." : "Buat Pesanan"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Dengan membuat pesanan, Anda menyetujui syarat dan ketentuan
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
