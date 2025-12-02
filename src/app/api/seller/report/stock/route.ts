import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query
    const sellerId = request.nextUrl.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json({ error: "Seller ID required" }, { status: 400 });
    }

    const id = parseInt(sellerId);

    // Get seller info
    const seller = await prisma.user.findUnique({
      where: { idUser: id },
    });

    if (!seller || seller.role !== "penjual") {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Get products ordered by stock (descending)
    const products = await prisma.product.findMany({
      where: { idSeller: id },
      include: {
        category: true,
        rating: true,
      },
      orderBy: { stok: "desc" },
    });

    const totalStock = products.reduce((sum, p) => sum + (p.stok || 0), 0);

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Stok Produk</title>
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
            <h1>Laporan Daftar Stok Produk</h1>
            <p>Penjual: ${seller.nama}</p>
            <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Produk: ${products.length}</p>
            <p>Total Stok: ${totalStock}</p>
          </div>
          
          <h3>Detail Produk (Diurutkan Berdasarkan Stok)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 8%;">Stok</th>
                <th style="width: 35%;">Produk</th>
                <th style="width: 15%;">Rating</th>
                <th style="width: 38%;">Harga</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((product, index) => {
                const ratings = product.rating || [];
                const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + (r.nilai || 0), 0) / ratings.length).toFixed(2) : "-";
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${product.stok || 0}</td>
                    <td>${product.namaProduk || ""}</td>
                    <td>${avgRating}⭐</td>
                    <td>Rp ${product.harga.toLocaleString("id-ID")}</td>
                  </tr>
                `;
              }).join("")}
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
