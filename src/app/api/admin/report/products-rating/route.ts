import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all products with ratings
    const products = await prisma.product.findMany({
      include: {
        rating: true,
        seller: {
          include: {
            toko: true,
          },
        },
        category: true,
      },
    });

    // Calculate average rating and sort descending
    const productsWithRating = products
      .map((product) => {
        const ratings = product.rating || [];
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + (r.nilai || 0), 0) /
              ratings.length
            : 0;
        const ratingCount = ratings.length;
        return {
          ...product,
          avgRating: parseFloat(avgRating.toFixed(2)),
          ratingCount,
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating);

    // Get admin info from header
    const adminData = request.headers.get("x-user-data");
    let adminName = "Admin";
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        adminName = admin.nama || "Admin";
      } catch (e) {
        // ignore
      }
    }

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Produk Berdasarkan Rating</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 5px; font-size: 16px; }
            .meta { text-align: center; margin-bottom: 20px; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .note { margin-top: 10px; font-size: 10px; font-style: italic; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          <h1>Laporan Daftar Produk Berdasarkan Rating</h1>
          <div class="meta">Tanggal dibuat: ${new Date().toLocaleDateString(
            "id-ID"
          )} oleh ${adminName}</div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 25%;">Produk</th>
                <th style="width: 15%;">Kategori</th>
                <th style="width: 15%;">Harga</th>
                <th style="width: 10%;">Rating</th>
                <th style="width: 15%;">Nama Toko</th>
                <th style="width: 15%;">Propinsi</th>
              </tr>
            </thead>
            <tbody>
              ${productsWithRating
                .map(
                  (product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.namaProduk || ""}</td>
                  <td>${product.category?.namaKategori || "-"}</td>
                  <td>Rp ${new Intl.NumberFormat("id-ID").format(
                    Number(product.harga)
                  )}</td>
                  <td>${product.avgRating.toFixed(2)}</td>
                  <td>${
                    product.seller?.toko?.namaToko || product.seller?.nama || ""
                  }</td>
                  <td>${product.seller?.provinsi || ""}</td>
                </tr>
              `
                )
                .join("")}
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
