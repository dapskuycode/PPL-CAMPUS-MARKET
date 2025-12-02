import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all products with ratings
    const products = await prisma.product.findMany({
      include: {
        rating: true,
        seller: true,
        category: true,
      },
    });

    // Calculate average rating and sort descending
    const productsWithRating = products
      .map((product) => {
        const ratings = product.rating || [];
        const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + (r.nilai || 0), 0) / ratings.length : 0;
        const ratingCount = ratings.length;
        return {
          ...product,
          avgRating: parseFloat(avgRating.toFixed(2)),
          ratingCount,
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating);

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Produk dan Rating</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #999; padding: 6px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            @media print { body { padding: 0; font-size: 11px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Daftar Produk dan Rating</h1>
            <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Produk: ${productsWithRating.length}</p>
          </div>
          
          <h3>Detail Produk (Diurutkan Berdasarkan Rating)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 12%;">Rating</th>
                <th style="width: 28%;">Produk</th>
                <th style="width: 15%;">Kategori</th>
                <th style="width: 18%;">Harga</th>
                <th style="width: 23%;">Toko/Provinsi</th>
              </tr>
            </thead>
            <tbody>
              ${productsWithRating.map((product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.avgRating}⭐ (${product.ratingCount})</td>
                  <td>${product.namaProduk || ""}</td>
                  <td>${product.category?.namaKategori || "-"}</td>
                  <td>Rp ${product.harga.toLocaleString("id-ID")}</td>
                  <td>${product.seller?.nama || ""} / ${product.seller?.provinsi || ""}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <script>
            window.addEventListener('load', () => {
              setTimeout(() => { window.print(); }, 500);
            });
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Gagal membuat laporan", details: error.message },
      { status: 500 }
    );
  }
}
