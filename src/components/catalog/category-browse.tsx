"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Book,
  Dumbbell,
  Utensils,
  Package,
} from "lucide-react";
import Link from "next/link";

interface Category {
  idCategory: number;
  namaKategori: string;
}

interface CategoryBrowseProps {
  categories: Category[];
}

// Mapping kategori ke icon
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (name.includes("elektronik") || name.includes("gadget")) {
    return <Smartphone className="h-12 w-12 text-gray-800" />;
  }
  if (name.includes("laptop") || name.includes("komputer")) {
    return <Laptop className="h-12 w-12 text-gray-800" />;
  }
  if (
    name.includes("fashion") ||
    name.includes("pakaian") ||
    name.includes("baju")
  ) {
    return <Shirt className="h-12 w-12 text-gray-800" />;
  }
  if (
    name.includes("rumah") ||
    name.includes("furniture") ||
    name.includes("perabot")
  ) {
    return <Home className="h-12 w-12 text-gray-800" />;
  }
  if (
    name.includes("buku") ||
    name.includes("alat tulis") ||
    name.includes("pendidikan")
  ) {
    return <Book className="h-12 w-12 text-gray-800" />;
  }
  if (name.includes("olahraga") || name.includes("sport")) {
    return <Dumbbell className="h-12 w-12 text-gray-800" />;
  }
  if (name.includes("makanan") || name.includes("food")) {
    return <Utensils className="h-12 w-12 text-gray-800" />;
  }

  // Default icon
  return <Package className="h-12 w-12 text-gray-800" />;
};

export function CategoryBrowse({ categories }: CategoryBrowseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardContent className="p-1">
        {/* <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Telusuri berdasarkan Kategori</h2>
          <p className="text-sm text-muted-foreground">
            Temukan produk berdasarkan kategori pilihan Anda
          </p>
        </div> */}

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const categoryUrl = `/catalog?category=${category.idCategory}`;
            console.log(
              `[CategoryBrowse] Generating link for ${category.namaKategori} (ID: ${category.idCategory}):`,
              categoryUrl
            );

            return (
              <Link
                key={`category-${category.idCategory}`}
                href={categoryUrl}
                className="group"
                onClick={() => {
                  console.log(
                    `[CategoryBrowse] Clicked category:`,
                    category.namaKategori,
                    "ID:",
                    category.idCategory
                  );
                }}
              >
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors w-32">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    {getCategoryIcon(category.namaKategori)}
                  </div>
                  <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                    {category.namaKategori}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
