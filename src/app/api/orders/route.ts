import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Ambil daftar order user dengan pagination
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      idUser: authResult.idUser,
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
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data order" },
      { status: 500 }
    );
  }
}

// POST - Create order dari cart
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { paymentMethod, shippingAddress, orderNotes } = body;

    if (!paymentMethod || !shippingAddress) {
      return NextResponse.json(
        { error: "Payment method dan alamat pengiriman harus diisi" },
        { status: 400 }
      );
    }

    // Ambil semua cart items
    const cartItems = await prisma.cart.findMany({
      where: {
        idUser: authResult.idUser,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Keranjang kosong" },
        { status: 400 }
      );
    }

    // Validasi stok untuk semua items
    for (const item of cartItems) {
      if (item.quantity > item.product.stok) {
        return NextResponse.json(
          {
            error: `Stok ${item.product.namaProduk} tidak mencukupi. Stok tersedia: ${item.product.stok}`,
          },
          { status: 400 }
        );
      }

      if (item.product.statusProduk !== "aktif") {
        return NextResponse.json(
          { error: `Produk ${item.product.namaProduk} tidak aktif` },
          { status: 400 }
        );
      }
    }

    // Hitung total price
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.harga) * item.quantity;
    }, 0);

    // Gunakan transaction untuk membuat order, order items, dan update stok
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          idUser: authResult.idUser,
          totalPrice,
          status: "pending",
          paymentMethod,
          shippingAddress,
          orderNotes,
        },
      });

      // Create order items dan update stok
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            idOrder: newOrder.idOrder,
            idProduct: item.idProduct,
            quantity: item.quantity,
            price: item.product.harga,
          },
        });

        // Update stok produk
        await tx.product.update({
          where: { idProduct: item.idProduct },
          data: {
            stok: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cart.deleteMany({
        where: {
          idUser: authResult.idUser,
        },
      });

      // Fetch complete order data
      const completeOrder = await tx.order.findUnique({
        where: { idOrder: newOrder.idOrder },
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

      return completeOrder;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order berhasil dibuat",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Gagal membuat order" },
      { status: 500 }
    );
  }
}
