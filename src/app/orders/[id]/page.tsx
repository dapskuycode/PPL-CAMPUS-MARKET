"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Image from "next/image";

interface OrderDetail {
  idOrder: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  orderDate: string;
  orderNotes: string | null;
  user: {
    nama: string;
    email: string;
    noHP: string;
  };
  orderItem: {
    quantity: number;
    price: number;
    product: {
      idProduct: number;
      namaProduk: string;
      kondisi: string;
      productImage: {
        namaGambar: string;
      }[];
      seller: {
        nama: string;
        idUser: number;
        toko: {
          namaToko: string;
        } | null;
      };
    };
  }[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    fetchOrderDetail();
  }, [params.id, router]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/orders/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        alert(data.error || "Gagal memuat detail order");
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      alert("Terjadi kesalahan");
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      paid: "default",
      processing: "default",
      shipped: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Menunggu Pembayaran",
      paid: "Sudah Dibayar",
      processing: "Diproses",
      shipped: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      transfer: "Transfer Bank",
      cod: "COD (Cash on Delivery)",
      "e-wallet": "E-Wallet",
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
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
              onClick={() => router.push("/orders")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6" />
                Detail Pesanan #{order.idOrder}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Status Pesanan
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Tanggal Pesanan
                    </p>
                    <p className="font-medium">
                      {new Date(order.orderDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Produk Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.orderItem.map((item, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border">
                        {item.product.productImage.length > 0 ? (
                          <Image
                            src={item.product.productImage[0].namaGambar}
                            alt={item.product.namaProduk}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {item.product.namaProduk}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product.seller.toko?.namaToko ||
                            item.product.seller.nama}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {item.product.kondisi}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {item.quantity} x Rp{" "}
                            {Number(item.price).toLocaleString("id-ID")}
                          </span>
                          <span className="font-semibold">
                            Rp{" "}
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < order.orderItem.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.orderNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Catatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.orderNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pembeli Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Info Pembeli
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{order.user.nama}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.user.noHP}</span>
                </div>
              </CardContent>
            </Card>

            {/* Alamat Pengiriman */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.shippingAddress}</p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </p>
              </CardContent>
            </Card>

            {/* Total */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal Produk
                    </span>
                    <span>
                      Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                    </span>
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
                    Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
