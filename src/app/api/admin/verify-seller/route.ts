import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUser, status } = body;

    if (!idUser || !status) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (status !== "verified" && status !== "rejected") {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { idUser: parseInt(idUser) },
      data: {
        statusVerifikasi: status,
        tanggalVerifikasi: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Penjual berhasil ${status === "verified" ? "diverifikasi" : "ditolak"}`,
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying seller:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi penjual", details: error.message },
      { status: 500 }
    );
  }
}
