import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get products by category
    const productsByCategory = await prisma.category.findMany({
      include: {
        product: true,
      },
    });

    const categoryData = productsByCategory.map((cat) => ({
      name: cat.namaKategori,
      value: cat.product.length,
    }));

    // Get shops by province
    const shops = await prisma.toko.findMany({
      include: {
        seller: true,
      },
    });

    const provinceMap = new Map<string, number>();
    shops.forEach((shop) => {
      const province = shop.seller.provinsi || "Tidak Diketahui";
      provinceMap.set(province, (provinceMap.get(province) || 0) + 1);
    });

    const shopsByProvince = Array.from(provinceMap.entries()).map(([province, count]) => ({
      name: province,
      value: count,
    }));

    // Get seller stats (active/inactive)
    const totalSellers = await prisma.user.count({
      where: { role: "penjual" },
    });

    const activeSellers = await prisma.user.count({
      where: { role: "penjual", statusAkun: "aktif" },
    });

    const inactiveSellers = totalSellers - activeSellers;

    // Get rating stats
    const ratings = await prisma.rating.findMany();
    const totalRatings = ratings.length;
    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.nilai || 0), 0) / ratings.length : 0;

    return NextResponse.json(
      {
        productsByCategory: categoryData,
        shopsByProvince: shopsByProvince,
        sellerStats: {
          active: activeSellers,
          inactive: inactiveSellers,
        },
        ratingStats: {
          total: totalRatings,
          average: averageRating,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard", details: error.message },
      { status: 500 }
    );
  }
}
