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

    // Get low stock products (stok < 2)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        idSeller: id,
        stok: {
          lt: 2,
        },
      },
      include: {
        category: true,
        rating: true,
      },
    });

    // Generate HTML
    let tableContent = "";
    if (lowStockProducts.length === 0) {
      tableContent = `<p style="text-align: center; padding: 20px;">✓ Semua stok produk aman, tidak ada produk yang perlu segera dipesan.</p>`;
    } else {
      tableContent = `
        <h3>Daftar Produk Stok Rendah</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">No</th>
              <th style="width: 12%;">Stok Saat Ini</th>
              <th style="width: 35%;">Produk</th>
              <th style="width: 20%;">Kategori</th>
              <th style="width: 29%;">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${lowStockProducts.map((product, index) => `
              <tr>
                <td>${index + 1}</td>
                <td style="text-weight: bold; color: red;">${product.stok || 0}</td>
                <td>${product.namaProduk || ""}</td>
                <td>${product.category?.namaKategori || "-"}</td>
                <td>Rp ${product.harga.toLocaleString("id-ID")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Stok Barang Harus Segera Dipesan</title>
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
            <h1>Laporan Stok Barang Harus Segera Dipesan</h1>
            <p>Penjual: ${seller.nama}</p>
            <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
            <p style="font-size: 11px;">(Stok &lt; 2 unit)</p>
          </div>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Produk dengan Stok Rendah: ${lowStockProducts.length}</p>
          </div>
          
          ${tableContent}
          
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
