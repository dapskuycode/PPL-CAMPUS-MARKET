"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash, IconPlus, IconEye } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  idProduct: number;
  namaProduk: string;
  harga: number;
  stok: number;
  kondisi: string;
  statusProduk: string;
  category: {
    namaKategori: string;
  } | null;
  productImage: Array<{
    namaGambar: string;
  }>;
}

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "penjual") {
      router.push("/catalog");
      return;
    }

    setUser(parsedUser);
    fetchProducts(parsedUser.idUser);
  }, [router]);

  const fetchProducts = async (sellerId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?sellerId=${sellerId}`, {
        headers: {
          "x-user-data": localStorage.getItem("user") || "",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || data);
      } else {
        console.error("Error fetching products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/seller/products/${deletingProduct}`, {
        method: "DELETE",
        headers: {
          "x-user-data": localStorage.getItem("user") || "",
        },
      });

      if (response.ok) {
        // Refresh products list
        if (user) {
          await fetchProducts(user.idUser);
        }
        setShowDeleteDialog(false);
        setDeletingProduct(null);
      } else {
        const data = await response.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan saat menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <SellerSidebar user={user} />
      <SidebarInset>
        <SellerHeader userName={user.nama} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Produk Saya</CardTitle>
                <CardDescription>
                  Kelola semua produk yang Anda jual
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Belum ada produk. Mulai tambahkan produk Anda!
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/products/new")}
                    className="gap-2"
                  >
                    <IconPlus className="h-4 w-4" />
                    Tambah Produk Pertama
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Gambar</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead className="text-center">Stok</TableHead>
                        <TableHead className="text-center">Kondisi</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        {/* <TableHead className="text-right">Aksi</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.idProduct}>
                          <TableCell>
                            {product.productImage &&
                            product.productImage.length > 0 ? (
                              <img
                                src={`/fotoBarang/${product.productImage[0].namaGambar}`}
                                alt={product.namaProduk}
                                className="h-16 w-16 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/100x100/png?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.namaProduk}
                          </TableCell>
                          <TableCell>
                            {product.category?.namaKategori || "-"}
                          </TableCell>
                          <TableCell>{formatPrice(product.harga)}</TableCell>
                          <TableCell className="text-center">
                            {product.stok}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                product.kondisi === "baru"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.kondisi}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                product.statusProduk === "aktif"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.statusProduk}
                            </Badge>
                          </TableCell>
                          {/* <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => router.push(`/product/${product.idProduct}`)} title="Lihat Produk">
                                <IconEye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/products/edit/${product.idProduct}`)} title="Edit Produk">
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setDeletingProduct(product.idProduct);
                                  setShowDeleteDialog(true);
                                }}
                                title="Hapus Produk"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Produk</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak
                dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
              >
                Batal
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
