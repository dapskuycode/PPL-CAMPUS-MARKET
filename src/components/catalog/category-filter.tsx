"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Category {
  idCategory: number;
  namaKategori: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: number[];
  showAllCategories: boolean;
  onCategoryToggle: (categoryId: number) => void;
  onAllCategoriesToggle: () => void;
}

export function CategoryFilter({ categories, selectedCategories, showAllCategories, onCategoryToggle, onAllCategoriesToggle }: CategoryFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Filter Kategori</h3>

        <div className="space-y-3">
          {/* All Categories */}
          <div className="flex items-center space-x-2">
            <Checkbox id="all-categories" checked={showAllCategories} onCheckedChange={onAllCategoriesToggle} />
            <Label htmlFor="all-categories" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              Semua Kategori
            </Label>
          </div>

          <div className="border-t my-2" />

          {/* Category List */}
          {categories.map((category) => (
            <div key={category.idCategory} className="flex items-center space-x-2">
              <Checkbox id={`category-${category.idCategory}`} checked={selectedCategories.includes(category.idCategory)} onCheckedChange={() => onCategoryToggle(category.idCategory)} />
              <Label htmlFor={`category-${category.idCategory}`} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {category.namaKategori}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
