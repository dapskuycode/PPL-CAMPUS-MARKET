import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all shops
    const shops = await prisma.toko.findMany({
      include: {
        seller: true,
      },
    });

    // Group by province
    const shopsByProvince = new Map<string, any[]>();
    shops.forEach((shop) => {
      const province = shop.seller.provinsi || "Tidak Diketahui";
      if (!shopsByProvince.has(province)) {
        shopsByProvince.set(province, []);
      }
      shopsByProvince.get(province)!.push(shop);
    });

    // Generate HTML
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Penjual (Toko) Per Lokasi Provinsi</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; }
            .section { page-break-inside: avoid; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            @media print { body { padding: 0; } .section { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Daftar Penjual (Toko) Per Lokasi Provinsi</h1>
            <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Provinsi: ${shopsByProvince.size}</p>
            <p>Total Toko: ${shops.length}</p>
          </div>
    `;

    // Add sections by province
    Array.from(shopsByProvince.entries()).forEach(([province, provinceShops]) => {
      html += `
        <div class="section">
          <h3>Provinsi: ${province} (${provinceShops.length} Toko)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 50%;">Nama Toko</th>
                <th style="width: 45%;">Pemilik</th>
              </tr>
            </thead>
            <tbody>
              ${provinceShops.map((shop, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${shop.namaToko || ""}</td>
                  <td>${shop.seller.nama || ""}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    });

    html += `
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
