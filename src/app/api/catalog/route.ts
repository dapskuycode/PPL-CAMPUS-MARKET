import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriesParam = searchParams.get("categories");
    const searchQuery = searchParams.get("search");
    const namaToko = searchParams.get("namaToko");
    const kabupatenKota = searchParams.get("kabupatenKota");
    const provinsi = searchParams.get("provinsi");
    const kondisi = searchParams.get("kondisi");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy"); // price-asc, price-desc, date-desc, rating-desc
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: {
        namaKategori: "asc",
      },
    });

    // Build product filter
    let productFilter: any = {
      statusProduk: "aktif", // Only show active products
    };

    // Category filter
    if (categoriesParam) {
      const categoryIds = categoriesParam
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id) && id > 0); // Filter out invalid IDs

      if (categoryIds.length > 0) {
        productFilter.idCategory = {
          in: categoryIds,
        };
      }
    }

    // Search by product name
    if (searchQuery) {
      productFilter.namaProduk = {
        contains: searchQuery,
        mode: "insensitive",
      };
    }

    // Filter by kondisi (baru/bekas)
    if (kondisi && (kondisi === "baru" || kondisi === "bekas")) {
      productFilter.kondisi = kondisi;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      productFilter.harga = {};
      if (minPrice) {
        productFilter.harga.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        productFilter.harga.lte = parseFloat(maxPrice);
      }
    }

    // Seller/Location filters
    if (namaToko || kabupatenKota || provinsi) {
      productFilter.seller = {};

      if (kabupatenKota) {
        productFilter.seller.kabupatenKota = {
          contains: kabupatenKota,
          mode: "insensitive",
        };
      }

      if (provinsi) {
        productFilter.seller.provinsi = {
          contains: provinsi,
          mode: "insensitive",
        };
      }

      if (namaToko) {
        productFilter.seller.toko = {
          namaToko: {
            contains: namaToko,
            mode: "insensitive",
          },
        };
      }
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({
      where: productFilter,
    });

    // Build orderBy clause based on sortBy
    let orderBy: any = { tanggalUpload: "desc" }; // Default: newest first

    if (sortBy === "price-asc") {
      orderBy = { harga: "asc" };
    } else if (sortBy === "price-desc") {
      orderBy = { harga: "desc" };
    } else if (sortBy === "date-desc") {
      orderBy = { tanggalUpload: "desc" };
    }
    // Note: rating sort will be done in-memory after fetching

    // Fetch products with filters and pagination
    let products = await prisma.product.findMany({
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
      orderBy,
    });

    // Sort by rating if requested (in-memory sorting)
    if (sortBy === "rating-desc") {
      products = products
        .map((product: any) => {
          const ratings = product.rating || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce(
                  (sum: number, r: any) => sum + (r.nilai || 0),
                  0
                ) / ratings.length
              : 0;
          return { ...product, avgRating };
        })
        .sort((a: any, b: any) => b.avgRating - a.avgRating);
    }

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
