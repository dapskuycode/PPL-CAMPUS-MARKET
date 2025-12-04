import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { idUser, status, reason } = body;

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

    // If rejected, reason should be provided
    if (status === "rejected" && !reason) {
      return NextResponse.json(
        { error: "Alasan penolakan harus diisi" },
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

    // Send verification email notification
    try {
      await sendVerificationEmail(
        updatedUser.email,
        updatedUser.nama,
        status,
        reason
      );
    } catch (emailError) {
      console.error("Email notification failed (non-critical):", emailError);
      // Continue execution even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `Penjual berhasil ${status === "verified" ? "diverifikasi" : "ditolak"}`,
        user: updatedUser,
        emailSent: true,
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
