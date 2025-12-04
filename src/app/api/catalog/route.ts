import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriesParam = searchParams.get("categories");

    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: {
        namaKategori: "asc",
      },
    });

    // Build product filter based on selected categories
    let productFilter: any = {};

    if (categoriesParam) {
      const categoryIds = categoriesParam.split(",").map((id) => parseInt(id));
      productFilter.idCategory = {
        in: categoryIds,
      };
    }

    // Fetch products with filters
    const products = await prisma.product.findMany({
      where: productFilter,
      include: {
        category: {
          select: {
            namaKategori: true,
          },
        },
        seller: {
          select: {
            nama: true,
            kabupatenKota: true,
            provinsi: true,
            toko: {
              select: {
                namaToko: true,
              },
            },
          },
        },
        productImage: {
          orderBy: {
            urutan: "asc",
          },
          select: {
            namaGambar: true,
            urutan: true,
          },
        },
        rating: {
          select: {
            idRating: true,
            nilai: true,
            komentar: true,
            namaPengunjung: true,
            email: true,
            noHP: true,
            tanggal: true,
          },
        },
      },
      orderBy: {
        tanggalUpload: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        categories,
        products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching catalog data:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil data katalog",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Post - tambahkan produk baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      namaProduk,
      deskripsiProduk,
      harga,
      berat,
      kondisi,
      lokasi,
      stok,
      idCategory,
      idSeller,
      tanggalUpload,
    } = body;

    // Validate required fields
    if (!namaProduk || !harga || !stok || !idCategory || !idSeller) {
      return NextResponse.json(
        {
          error: "Nama produk, harga, stok, kategori, dan penjual harus diisi",
        },
        { status: 400 }
      );
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        namaProduk,
        deskripsi: deskripsiProduk || null,
        harga,
        stok,
        berat,
        kondisi,
        lokasi,
        idCategory,
        idSeller,
        tanggalUpload: tanggalUpload ? new Date(tanggalUpload) : new Date(),
        statusProduk: "aktif",
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error adding new product:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan produk" },
      { status: 500 }
    );
  }
}
