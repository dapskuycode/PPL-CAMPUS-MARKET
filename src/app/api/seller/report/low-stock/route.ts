import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get seller ID from query
    const sellerId = request.nextUrl.searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller ID required" },
        { status: 400 }
      );
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

    // Sort by category and product name
    const sortedProducts = lowStockProducts.sort((a, b) => {
      const catA = a.category?.namaKategori || "";
      const catB = b.category?.namaKategori || "";
      if (catA !== catB) return catA.localeCompare(catB);
      return (a.namaProduk || "").localeCompare(b.namaProduk || "");
    });

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Produk Segera Dipesan</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 5px; font-size: 16px; }
            .meta { text-align: center; margin-bottom: 20px; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .note { margin-top: 10px; font-size: 10px; font-style: italic; }
            .empty { text-align: center; padding: 20px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          <h1>Laporan Daftar Produk Segera Dipesan</h1>
          <div class="meta">Tanggal dibuat: ${new Date().toLocaleDateString(
            "id-ID"
          )} oleh ${seller.nama}</div>
          
          ${
            sortedProducts.length === 0
              ? '<div class="empty">Tidak ada produk dengan stok &lt; 2</div>'
              : `<table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 35%;">Produk</th>
                <th style="width: 20%;">Kategori</th>
                <th style="width: 25%;">Harga</th>
                <th style="width: 15%;">Stok</th>
              </tr>
            </thead>
            <tbody>
              ${sortedProducts
                .map(
                  (product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.namaProduk || ""}</td>
                  <td>${product.category?.namaKategori || "-"}</td>
                  <td>Rp ${new Intl.NumberFormat("id-ID").format(
                    Number(product.harga)
                  )}</td>
                  <td>${product.stok || 0}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>`
          }
          
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
  } catch (error: unknown) {
    console.error("Report error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal membuat laporan", details: errorMessage },
      { status: 500 }
    );
  }
}
