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

    // Sort provinces alphabetically
    const sortedProvinces = Array.from(shopsByProvince.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    // Generate HTML
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Toko Berdasarkan Lokasi Propinsi</title>
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
          <h1>Laporan Daftar Toko Berdasarkan Lokasi Propinsi</h1>
          <div class="meta">Tanggal dibuat: ${new Date().toLocaleDateString(
            "id-ID"
          )} oleh ${adminName}</div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 40%;">Nama Toko</th>
                <th style="width: 30%;">Nama PIC</th>
                <th style="width: 25%;">Propinsi</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Add all shops grouped by province
    let rowIndex = 0;
    sortedProvinces.forEach(([province, provinceShops]) => {
      provinceShops.forEach((shop) => {
        rowIndex++;
        html += `
              <tr>
                <td>${rowIndex}</td>
                <td>${shop.namaToko || ""}</td>
                <td>${shop.seller.nama || ""}</td>
                <td>${province}</td>
              </tr>
        `;
      });
    });

    html += `
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
