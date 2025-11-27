"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductFormProps {
  productId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    namaProduk: "",
    deskripsi: "",
    harga: "",
    stok: "",
    kondisi: "baru",
    idCategory: "",
  });

  // Ambil data kategori
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Jika edit, ambil data produk
  useEffect(() => {
    if (productId) {
      fetch(`/api/catalog/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          const product = data.product;
          setFormData({
            namaProduk: product.namaProduk,
            deskripsi: product.deskripsi || "",
            harga: product.harga.toString(),
            stok: product.stok?.toString() || "0",
            kondisi: product.kondisi || "baru",
            idCategory: product.category?.idCategory?.toString() || "",
          });
        })
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      // Upload images first if there are new images
      let imageFilenames: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach((file: File) => {
          uploadFormData.append("images", file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload images");
        }

        const uploadResult = await uploadResponse.json();
        imageFilenames = uploadResult.files;
      }

      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageFilenames,
          idSeller: user.idUser,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menyimpan produk");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productId ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="namaProduk">Nama Produk *</Label>
            <Input id="namaProduk" value={formData.namaProduk} onChange={(e) => setFormData({ ...formData, namaProduk: e.target.value })} placeholder="Contoh: Laptop Asus ROG" required />
          </div>

          <div>
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Deskripsi produk..." rows={4} />
          </div>

          <div>
            <Label htmlFor="harga">Harga (Rp) *</Label>
            <Input id="harga" type="number" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} placeholder="50000" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kondisi">Kondisi</Label>
              <Select value={formData.kondisi} onValueChange={(value) => setFormData({ ...formData, kondisi: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="bekas">Bekas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stok">Stok *</Label>
              <Input id="stok" type="number" value={formData.stok} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} placeholder="10" required />
            </div>
          </div>

          <div>
            <Label htmlFor="idCategory">Kategori *</Label>
            <Select value={formData.idCategory} onValueChange={(value) => setFormData({ ...formData, idCategory: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.idCategory} value={cat.idCategory.toString()}>
                    {cat.namaKategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="images">Gambar Produk</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles(files);
              }}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-1">Pilih hingga 5 gambar (JPG, PNG, max 5MB per file)</p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : productId ? "Update" : "Tambah Produk"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
