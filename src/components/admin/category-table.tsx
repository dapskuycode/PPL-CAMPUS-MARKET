"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface Category {
  idCategory: number;
  namaKategori: string;
  _count: {
    product: number;
  };
}

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Memuat data kategori...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Belum ada kategori</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">No</TableHead>
            <TableHead>Nama Kategori</TableHead>
            <TableHead className="text-center">Jumlah Produk</TableHead>
            <TableHead className="text-right w-[200px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.idCategory}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{category.namaKategori}</TableCell>
              <TableCell className="text-center">
                {category._count.product}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <IconEdit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(category)}
                    disabled={category._count.product > 0}
                    title={
                      category._count.product > 0
                        ? "Tidak dapat menghapus kategori yang memiliki produk"
                        : "Hapus kategori"
                    }
                  >
                    <IconTrash className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
