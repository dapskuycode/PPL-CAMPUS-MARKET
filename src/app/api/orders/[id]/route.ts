import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Ambil detail order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const idOrder = parseInt(id);

    const order = await prisma.order.findUnique({
      where: { idOrder },
      include: {
        user: {
          select: {
            nama: true,
            email: true,
            noHP: true,
          },
        },
        orderItem: {
          include: {
            product: {
              include: {
                productImage: {
                  orderBy: {
                    urutan: "asc",
                  },
                  take: 1,
                },
                seller: {
                  select: {
                    nama: true,
                    idUser: true,
                    toko: {
                      select: {
                        namaToko: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check authorization - hanya buyer atau seller dari item yang bisa akses
    const isBuyer = order.idUser === authResult.idUser;
    const isSeller = order.orderItem.some(
      (item) => item.product.idSeller === authResult.idUser
    );

    if (!isBuyer && !isSeller) {
      return NextResponse.json(
        { error: "Forbidden - Anda tidak berhak mengakses order ini" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail order" },
      { status: 500 }
    );
  }
}

// PUT - Update status order (untuk seller atau admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const idOrder = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status harus diisi" },
        { status: 400 }
      );
    }

    // Validasi status
    const validStatuses = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Cek order exists
    const order = await prisma.order.findUnique({
      where: { idOrder },
      include: {
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check authorization - seller hanya bisa update order yang mengandung produknya
    if (authResult.role !== "admin") {
      const isSeller = order.orderItem.some(
        (item) => item.product.idSeller === authResult.idUser
      );

      if (!isSeller) {
        return NextResponse.json(
          { error: "Forbidden - Anda tidak berhak mengupdate order ini" },
          { status: 403 }
        );
      }
    }

    // Update status
    const updatedOrder = await prisma.order.update({
      where: { idOrder },
      data: { status },
      include: {
        orderItem: {
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
    });

    return NextResponse.json({
      success: true,
      message: "Status order berhasil diupdate",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate order" },
      { status: 500 }
    );
  }
}
