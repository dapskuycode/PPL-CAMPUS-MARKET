import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    console.log("Search API called with query:", query);

    // Jika query kosong, return semua produk aktif
    if (!query.trim()) {
      const products = await prisma.product.findMany({
        where: {
          statusProduk: "aktif",
        },
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
            select: {
              namaGambar: true,
              urutan: true,
            },
            orderBy: {
              urutan: "asc",
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
        orderBy: { tanggalUpload: "desc" },
      });

      return NextResponse.json({ products });
    }

    // Search berdasarkan:
    // 1. Nama produk
    // 2. Nama toko
    // 3. Nama kategori
    // 4. Lokasi (kabupaten/kota)
    // 5. Lokasi (provinsi)
    const products = await prisma.product.findMany({
      where: {
        statusProduk: "aktif",
        OR: [
          {
            namaProduk: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            seller: {
              toko: {
                namaToko: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            category: {
              namaKategori: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            seller: {
              kabupatenKota: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            seller: {
              provinsi: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
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
          select: {
            namaGambar: true,
            urutan: true,
          },
          orderBy: {
            urutan: "asc",
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
      orderBy: { tanggalUpload: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
