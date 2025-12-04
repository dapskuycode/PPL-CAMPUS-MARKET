"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/fetch-helper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ProductForm } from "./product-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  idProduct: number;
  namaProduk: string;
  harga: number;
  stok: number | null;
  kondisi: string | null;
  statusProduk: string | null;
  category: {
    namaKategori: string;
  } | null;
}

export function SellerProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | undefined>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);

  const fetchProducts = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const response = await authFetch(`/api/products?sellerId=${user.idUser}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (productId: number) => {
    setEditingProduct(productId);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const response = await authFetch(`/api/products/${deletingProduct}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.idProduct !== deletingProduct));
        setShowDeleteDialog(false);
        setDeletingProduct(null);
      } else {
        alert("Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    fetchProducts();
  };

  if (showForm) {
    return (
      <div className="px-4 lg:px-6">
        <ProductForm
          productId={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Produk Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Memuat data produk...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Produk Saya</CardTitle>
          <CardDescription>Kelola produk yang Anda jual</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada produk. Gunakan menu "Tambah Produk" di sidebar untuk memulai.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.idProduct}>
                    <TableCell className="font-medium">{product.namaProduk}</TableCell>
                    <TableCell>{product.category?.namaKategori || "-"}</TableCell>
                    <TableCell>Rp {product.harga.toLocaleString("id-ID")}</TableCell>
                    <TableCell>{product.stok || 0}</TableCell>
                    <TableCell>{product.kondisi && <Badge variant="outline">{product.kondisi}</Badge>}</TableCell>
                    <TableCell>
                      <Badge variant={product.statusProduk === "tersedia" ? "default" : "secondary"}>{product.statusProduk || "Draft"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product.idProduct)}>
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingProduct(product.idProduct);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingProduct(null);
              }}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
