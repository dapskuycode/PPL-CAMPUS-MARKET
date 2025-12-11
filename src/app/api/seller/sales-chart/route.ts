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

    // Get all completed orders for seller's products in the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        idProduct: { in: productIds },
        order: {
          status: "completed",
          orderDate: {
            gte: twelveMonthsAgo,
          },
        },
      },
      include: {
        order: true,
      },
    });

    // Group sales by month
    const salesByMonth = new Map<
      string,
      { revenue: number; quantity: number }
    >();

    // Initialize last 12 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      salesByMonth.set(monthKey, { revenue: 0, quantity: 0 });
    }

    // Aggregate sales data
    orderItems.forEach((item) => {
      const orderDate = new Date(item.order.orderDate);
      const monthKey = `${
        months[orderDate.getMonth()]
      } ${orderDate.getFullYear()}`;

      const current = salesByMonth.get(monthKey) || { revenue: 0, quantity: 0 };
      salesByMonth.set(monthKey, {
        revenue: current.revenue + Number(item.price) * item.quantity,
        quantity: current.quantity + item.quantity,
      });
    });

    // Convert to array format for chart
    const chartData = Array.from(salesByMonth.entries()).map(
      ([month, data]) => ({
        month: month.split(" ")[0], // Only month name
        penjualan: data.revenue,
        quantity: data.quantity,
      })
    );

    return NextResponse.json(
      {
        chartData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Seller sales chart error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan", details: errorMessage },
      { status: 500 }
    );
  }
}
