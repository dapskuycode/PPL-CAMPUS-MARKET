import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const activeSellers = sellers.filter((s) => s.statusAkun === "aktif").length;
    const inactiveSellers = sellers.filter((s) => s.statusAkun !== "aktif").length;

    // Generate HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan Daftar Akun Penjual</title>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Daftar Akun Penjual</h1>
            <p>Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
          </div>
          
          <div class="summary">
            <h3>Ringkasan</h3>
            <p>Total Penjual: ${sellers.length}</p>
            <p>Penjual Aktif: ${activeSellers}</p>
            <p>Penjual Tidak Aktif: ${inactiveSellers}</p>
          </div>
          
          <h3>Detail Daftar Penjual</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 30%;">Nama</th>
                <th style="width: 40%;">Email</th>
                <th style="width: 25%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${sellers.map((seller, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${seller.nama || ""}</td>
                  <td>${seller.email || ""}</td>
                  <td>${seller.statusAkun || "Tidak Aktif"}</td>
                </tr>
              `).join("")}
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
  } catch (error: any) {
    console.error("Report error:", error);
    return NextResponse.json(
      { error: "Gagal membuat laporan", details: error.message },
      { status: 500 }
    );
  }
}
