import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all sellers with their details
export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: {
        role: "penjual",
      },
      include: {
        toko: true,
      },
      orderBy: {
        tanggalDaftar: "desc",
      },
    });

    return NextResponse.json({ sellers }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching sellers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal mengambil data penjual", details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH to update seller status (statusAkun or statusVerifikasi)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUser, statusAkun, statusVerifikasi } = body;

    if (!idUser) {
      return NextResponse.json(
        { error: "ID User diperlukan" },
        { status: 400 }
      );
    }

    const updateData: {
      statusAkun?: string;
      statusVerifikasi?: string;
      tanggalVerifikasi?: Date;
    } = {};

    if (statusAkun) {
      updateData.statusAkun = statusAkun;
    }

    if (statusVerifikasi) {
      updateData.statusVerifikasi = statusVerifikasi;
      // Set tanggalVerifikasi when verifying
      if (statusVerifikasi === "verified") {
        updateData.tanggalVerifikasi = new Date();
      }
    }

    const updatedSeller = await prisma.user.update({
      where: {
        idUser: parseInt(idUser),
        role: "penjual",
      },
      data: updateData,
      include: {
        toko: true,
      },
    });

    return NextResponse.json(
      {
        message: "Status penjual berhasil diperbarui",
        seller: updatedSeller,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating seller status:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal memperbarui status penjual", details: errorMessage },
      { status: 500 }
    );
  }
}
