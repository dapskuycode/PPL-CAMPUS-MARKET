import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get all sellers with pending verification status
    const pendingSellers = await prisma.user.findMany({
      where: {
        role: "penjual",
        statusVerifikasi: "pending",
      },
      include: {
        toko: true,
      },
      orderBy: {
        tanggalDaftar: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        sellers: pendingSellers,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching pending sellers:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data penjual", details: error.message },
      { status: 500 }
    );
  }
}
