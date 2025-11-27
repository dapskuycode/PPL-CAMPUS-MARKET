import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

// GET - Ambil semua produk seller
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.nextUrl.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID required" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { idSeller: parseInt(sellerId) },
      include: {
        category: {
          select: {
            namaKategori: true,
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
      orderBy: { tanggalUpload: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST - Tambah produk baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaProduk, deskripsi, harga, stok, kondisi, statusProduk, idCategory, idSeller, images } = body;

    // Validasi input
    if (!namaProduk || !harga || !idCategory || !idSeller) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        namaProduk,
        deskripsi: deskripsi || null,
        harga: parseFloat(harga),
        stok: parseInt(stok) || 0,
        kondisi: kondisi || "baru",
        statusProduk: "aktif",
        idCategory: parseInt(idCategory),
        idSeller: parseInt(idSeller),
        tanggalUpload: new Date(),
        productImage: {
          create: (images || []).map((filename: string, index: number) => ({
            namaGambar: filename,
            urutan: index + 1,
          })),
        },
      },
      include: {
        productImage: true,
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
