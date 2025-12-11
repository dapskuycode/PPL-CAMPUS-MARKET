"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryTable } from "@/components/admin/category-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";

interface Category {
  idCategory: number;
  namaKategori: string;
  _count: {
    product: number;
  };
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/catalog");
      return;
    }
    setUser(parsedUser);
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await authFetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await authFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ namaKategori: categoryName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add category");
      }

      setCategoryName("");
      setIsAddDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim() || !selectedCategory) {
      alert("Nama kategori tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await authFetch("/api/admin/categories", {
        method: "PATCH",
        body: JSON.stringify({
          idCategory: selectedCategory.idCategory,
          namaKategori: categoryName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update category");
      }

      setCategoryName("");
      setSelectedCategory(null);
      setIsEditDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await authFetch(
        `/api/admin/categories?idCategory=${selectedCategory.idCategory}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }

      setSelectedCategory(null);
      setIsDeleteDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.namaKategori);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (!user) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar
        variant="inset"
        user={{
          name: user?.nama || "Admin",
          email: user?.email || "",
          avatar: "/avatars/admin.jpg",
        }}
      />
      <SidebarInset>
        <AdminHeader userName={user?.nama || "Admin"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">Kelola Kategori</h1>
                    <p className="text-muted-foreground">
                      Manajemen kategori produk di Campus Market
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setCategoryName("");
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                  </Button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">
                    {error}
                  </div>
                )}

                <CategoryTable
                  categories={categories}
                  loading={loading}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Masukkan nama kategori yang ingin ditambahkan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nama Kategori</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Contoh: Elektronik"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCategoryName("");
                setIsAddDialogOpen(false);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleAddCategory} disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Ubah nama kategori yang sudah ada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category-name">Nama Kategori</Label>
              <Input
                id="edit-category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Contoh: Elektronik"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCategoryName("");
                setSelectedCategory(null);
                setIsEditDialogOpen(false);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleEditCategory} disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori &quot;
              {selectedCategory?.namaKategori}&quot;?
              {selectedCategory && selectedCategory._count.product > 0 && (
                <span className="block mt-2 text-destructive">
                  Kategori ini memiliki {selectedCategory._count.product} produk
                  dan tidak dapat dihapus.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setIsDeleteDialogOpen(false);
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={
                submitting ||
                !selectedCategory ||
                selectedCategory._count.product > 0
              }
            >
              {submitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
