import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/auth";

// GET - Ambil satu produk by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { idProduct: productId },
      include: {
        category: true,
        seller: {
          select: {
            nama: true,
            toko: {
              select: {
                namaToko: true,
                deskripsiSingkat: true,
              },
            },
          },
        },
        productImage: {
          select: {
            namaGambar: true,
            urutan: true,
          },
          orderBy: {
            urutan: "asc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT - Update produk
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require seller authentication
  const authResult = await requireSeller(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Check if product exists and belongs to seller
    const existingProduct = await prisma.product.findUnique({
      where: { idProduct: productId },
      select: { idSeller: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.idSeller !== authResult.idUser) {
      return NextResponse.json({ error: "Forbidden - You can only edit your own products" }, { status: 403 });
    }

    const body = await request.json();
    const { namaProduk, deskripsi, harga, stok, kondisi, statusProduk, idCategory, images } = body;

    // Validasi numeric inputs
    const parsedHarga = parseFloat(harga);
    const parsedStok = parseInt(stok);
    const parsedCategory = parseInt(idCategory);

    if (isNaN(parsedHarga) || parsedHarga <= 0) {
      return NextResponse.json({ error: "Harga harus berupa angka positif" }, { status: 400 });
    }

    if (isNaN(parsedStok) || parsedStok < 0) {
      return NextResponse.json({ error: "Stok harus berupa angka non-negatif" }, { status: 400 });
    }

    if (isNaN(parsedCategory)) {
      return NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 });
    }

    // Delete old images if new images are provided
    if (images && images.length > 0) {
      await prisma.productImage.deleteMany({
        where: { idProduct: productId },
      });
    }

    // Update product
    const product = await prisma.product.update({
      where: { idProduct: productId },
      data: {
        namaProduk,
        deskripsi: deskripsi || null,
        harga: parsedHarga,
        stok: parsedStok,
        kondisi,
        statusProduk,
        idCategory: parsedCategory,
        productImage:
          images && images.length > 0
            ? {
                create: images.map((filename: string, index: number) => ({
                  namaGambar: filename,
                  urutan: index + 1,
                })),
              }
            : undefined,
      },
      include: {
        productImage: true,
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE - Hapus produk
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Require seller authentication
  const authResult = await requireSeller(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Check if product exists and belongs to seller
    const existingProduct = await prisma.product.findUnique({
      where: { idProduct: productId },
      select: { idSeller: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (existingProduct.idSeller !== authResult.idUser) {
      return NextResponse.json({ error: "Forbidden - You can only delete your own products" }, { status: 403 });
    }

    // Delete images first (if any)
    await prisma.productImage.deleteMany({
      where: { idProduct: productId },
    });

    // Delete product
    await prisma.product.delete({
      where: { idProduct: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
