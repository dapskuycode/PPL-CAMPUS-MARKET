import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query params
    const sellerId = request.nextUrl.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID required" },
        { status: 400 }
      );
    }

    const id = parseInt(sellerId);

    // Get all products by seller
    const products = await prisma.product.findMany({
      where: { idSeller: id },
    });

    const productIds = products.map((p) => p.idProduct);

    // Count total products
    const totalProducts = products.length;

    // Count active products (stok > 0)
    const activeProducts = products.filter((p) => (p.stok || 0) > 0).length;

    // Calculate total revenue from completed orders
    const orderItems = await prisma.orderItem.findMany({
      where: {
        idProduct: { in: productIds },
        order: {
          status: "completed",
        },
      },
      include: {
        order: true,
      },
    });

    const totalRevenue = orderItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    // Count total orders (unique orders that contain seller's products)
    const uniqueOrderIds = new Set(orderItems.map((item) => item.idOrder));
    const totalOrders = uniqueOrderIds.size;

    return NextResponse.json(
      {
        totalProducts,
        activeProducts,
        totalRevenue,
        totalOrders,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Seller stats error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal mengambil data statistik", details: errorMessage },
      { status: 500 }
    );
  }
}
