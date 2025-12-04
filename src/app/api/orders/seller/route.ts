import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/auth";

// GET - Ambil orders yang mengandung produk seller
export async function GET(request: NextRequest) {
  const authResult = await requireSeller(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    // Build where clause - orders yang punya item dari produk seller ini
    const where: any = {
      orderItem: {
        some: {
          product: {
            idSeller: authResult.idUser,
          },
        },
      },
    };

    if (status) {
      where.status = status;
    }

    // Get total count
    const totalOrders = await prisma.order.count({ where });

    // Get orders
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            nama: true,
            email: true,
            noHP: true,
            alamatJalan: true,
            rt: true,
            rw: true,
            namaKelurahan: true,
            kecamatan: true,
            kabupatenKota: true,
            provinsi: true,
          },
        },
        orderItem: {
          where: {
            product: {
              idSeller: authResult.idUser,
            },
          },
          include: {
            product: {
              include: {
                productImage: {
                  orderBy: {
                    urutan: "asc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data order" },
      { status: 500 }
    );
  }
}
