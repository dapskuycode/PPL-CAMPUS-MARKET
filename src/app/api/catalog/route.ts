import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

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
    let productFilter: any = {
      statusProduk: "aktif", // Only show active products
    };

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
      { error: "Terjadi kesalahan saat mengambil data katalog", details: error.message },
      { status: 500 }
    );
  }
}
