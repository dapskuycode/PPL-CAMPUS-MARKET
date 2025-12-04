import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/auth";

// GET - Ambil semua produk seller dengan pagination
export async function GET(request: NextRequest) {
  try {
    const sellerId = request.nextUrl.searchParams.get("sellerId");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const where = { idSeller: parseInt(sellerId) };

    // Get total count
    const totalProducts = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
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

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST - Tambah produk baru
export async function POST(request: NextRequest) {
  // Require seller authentication
  const authResult = await requireSeller(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { namaProduk, deskripsi, harga, stok, kondisi, idCategory, images } = body;

    // Validasi input
    if (!namaProduk || !harga || !idCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validasi numeric inputs
    const parsedHarga = parseFloat(harga);
    const parsedStok = parseInt(stok) || 0;
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

    // Create product with authenticated seller's ID
    const product = await prisma.product.create({
      data: {
        namaProduk,
        deskripsi: deskripsi || null,
        harga: parsedHarga,
        stok: parsedStok,
        kondisi: kondisi || "baru",
        statusProduk: "aktif",
        idCategory: parsedCategory,
        idSeller: authResult.idUser, // Use authenticated user's ID
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
