import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query params
    const sellerId = request.nextUrl.searchParams.get("sellerId");
    
    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID required" }, { status: 400 });
    }

    const id = parseInt(sellerId);

    // Get products by seller
    const products = await prisma.product.findMany({
      where: { idSeller: id },
      include: {
        rating: true,
      },
    });

    // Stock by product
    const stockByProduct = products.map((product) => ({
      name: product.namaProduk,
      stock: product.stok || 0,
    }));

    // Rating by product with average
    const ratingByProduct = products.map((product) => {
      const ratings = product.rating || [];
      const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.nilai || 0), 0) / ratings.length : 0;
      return {
        name: product.namaProduk,
        rating: parseFloat(avgRating.toFixed(2)),
        count: ratings.length,
      };
    });

    // Get raters by province
    const allRatings = await prisma.rating.findMany({
      where: {
        product: {
          idSeller: id,
        },
      },
      include: {
        product: {
          include: {
            seller: true,
          },
        },
      },
    });

    // Map ratings to provinces
    const provinceMap = new Map<string, number>();
    
    // For this, we need to get the province from the user who rated
    // Since Rating model doesn't have user reference, we'll get it from email domain or create mapping
    // For now, let's use a simpler approach
    allRatings.forEach((rating) => {
      // Using product's seller location as proxy for now
      const province = rating.product?.seller?.provinsi || "Tidak Diketahui";
      provinceMap.set(province, (provinceMap.get(province) || 0) + 1);
    });

    const ratersByProvince = Array.from(provinceMap.entries()).map(([province, count]) => ({
      name: province,
      value: count,
    }));

    return NextResponse.json(
      {
        stockByProduct,
        ratingByProduct,
        ratersByProvince,
        totalProducts: products.length,
        totalRatings: allRatings.length,
        averageRating: ratingByProduct.length > 0 
          ? (ratingByProduct.reduce((sum, p) => sum + p.rating, 0) / ratingByProduct.length).toFixed(2)
          : 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Seller dashboard error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard", details: error.message },
      { status: 500 }
    );
  }
}
