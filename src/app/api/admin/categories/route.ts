import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        namaKategori: "asc",
      },
      include: {
        _count: {
          select: { product: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaKategori } = body;

    if (!namaKategori || namaKategori.trim() === "") {
      return NextResponse.json(
        { error: "Nama kategori tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { namaKategori: namaKategori.trim() },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Kategori dengan nama ini sudah ada" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        namaKategori: namaKategori.trim(),
      },
    });

    return NextResponse.json(
      { message: "Kategori berhasil ditambahkan", category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Gagal membuat kategori", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update category
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { idCategory, namaKategori } = body;

    if (!idCategory) {
      return NextResponse.json(
        { error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    if (!namaKategori || namaKategori.trim() === "") {
      return NextResponse.json(
        { error: "Nama kategori tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { idCategory: parseInt(idCategory) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if new name already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        namaKategori: namaKategori.trim(),
        NOT: { idCategory: parseInt(idCategory) },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Kategori dengan nama ini sudah ada" },
        { status: 400 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { idCategory: parseInt(idCategory) },
      data: { namaKategori: namaKategori.trim() },
    });

    return NextResponse.json({
      message: "Kategori berhasil diperbarui",
      category: updatedCategory,
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kategori", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCategory = searchParams.get("idCategory");

    if (!idCategory) {
      return NextResponse.json(
        { error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { idCategory: parseInt(idCategory) },
      include: {
        _count: {
          select: { product: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category._count.product > 0) {
      return NextResponse.json(
        {
          error: `Tidak dapat menghapus kategori karena masih memiliki ${category._count.product} produk`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { idCategory: parseInt(idCategory) },
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori", details: error.message },
      { status: 500 }
    );
  }
}
