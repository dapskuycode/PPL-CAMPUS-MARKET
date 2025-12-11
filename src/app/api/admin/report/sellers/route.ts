import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all sellers
    const sellers = await prisma.user.findMany({
      where: { role: "penjual" },
      include: {
        toko: true,
        product: true,
      },
    });

    // Get admin info from header
    const adminData = request.headers.get("x-user-data");
    let adminName = "Admin";
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        adminName = admin.nama || "Admin";
      } catch {
        // ignore
      }
    }

    // Sort sellers by status (aktif first)
    const sortedSellers = sellers.sort((a, b) => {
      if (a.statusAkun === "aktif" && b.statusAkun !== "aktif") return -1;
      if (a.statusAkun !== "aktif" && b.statusAkun === "aktif") return 1;
      return 0;
    });

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Akun Penjual Berdasarkan Status</title>
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
          <h1>Laporan Daftar Akun Penjual Berdasarkan Status</h1>
          <div class="meta">Tanggal dibuat: ${new Date().toLocaleDateString(
            "id-ID"
          )} oleh ${adminName}</div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 30%;">Nama User</th>
                <th style="width: 30%;">Nama PIC</th>
                <th style="width: 20%;">Nama Toko</th>
                <th style="width: 15%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${sortedSellers
                .map(
                  (seller, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${seller.email || ""}</td>
                  <td>${seller.nama || ""}</td>
                  <td>${seller.toko?.namaToko || "-"}</td>
                  <td>${
                    seller.statusAkun === "aktif" ? "Aktif" : "Tidak Aktif"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <script>
            window.addEventListener('load', () => {
              setTimeout(() => {
                window.print();
              }, 500);
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
