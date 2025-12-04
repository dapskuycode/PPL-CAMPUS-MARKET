import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriesParam = searchParams.get("categories");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

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

    // Get total count for pagination
    const totalProducts = await prisma.product.count({
      where: productFilter,
    });

    // Fetch products with filters and pagination
    const products = await prisma.product.findMany({
      where: productFilter,
      skip,
      take: limit,
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

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        success: true,
        categories,
        products,
        pagination: {
          page,
          limit,
          total: totalProducts,
          totalPages,
        },
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
