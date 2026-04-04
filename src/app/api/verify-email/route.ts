import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token verifikasi tidak ditemukan" },
        { status: 400 }
      );
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token verifikasi tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      );
    }

    // Update user: set verified and clear token
    await prisma.user.update({
      where: { idUser: user.idUser },
      data: {
        statusVerifikasi: "verified",
        emailVerificationToken: null,
        emailVerificationExpires: null,
        tanggalVerifikasi: new Date(),
      },
    });

    console.log(`✅ Email verified for user ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        message: "Email berhasil diverifikasi. Anda sekarang dapat login.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat verifikasi email" },
      { status: 500 }
    );
  }
}
