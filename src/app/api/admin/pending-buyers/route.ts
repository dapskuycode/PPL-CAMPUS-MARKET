import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendEmailVerificationLink } from "@/lib/email";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  // Require admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    // Get pending buyers (statusVerifikasi = 'pending')
    const pendingBuyers = await prisma.user.findMany({
      where: {
        role: "pembeli",
        statusVerifikasi: "pending",
      },
      select: {
        idUser: true,
        nama: true,
        email: true,
        noHP: true,
        alamatJalan: true,
        tanggalDaftar: true,
      },
      orderBy: {
        tanggalDaftar: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        buyers: pendingBuyers,
        total: pendingBuyers.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching pending buyers:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data pembeli" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { idUser, action } = body;

    if (!idUser || !action) {
      return NextResponse.json(
        { error: "idUser dan action harus diisi" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action harus 'approve' atau 'reject'" },
        { status: 400 }
      );
    }

    // Find buyer
    const user = await prisma.user.findUnique({
      where: { idUser: parseInt(idUser) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pembeli tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user.role !== "pembeli") {
      return NextResponse.json(
        { error: "User bukan pembeli" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update buyer with verification token
      await prisma.user.update({
        where: { idUser: user.idUser },
        data: {
          emailVerificationToken: verificationToken,
          emailVerificationExpires: tokenExpiry,
        },
      });

      // Send verification email
      try {
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendEmailVerificationLink(user.email, user.nama, verificationLink);
        console.log(`✅ Verification email sent to ${user.email} (buyer approved)`);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        return NextResponse.json(
          { error: "Gagal mengirim email verifikasi. Silakan coba lagi." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Pembeli ${user.email} disetujui. Email verifikasi telah dikirim.`,
        },
        { status: 200 }
      );
    } else if (action === "reject") {
      // Delete buyer
      await prisma.user.delete({
        where: { idUser: user.idUser },
      });

      console.log(`✅ Buyer ${user.email} rejected and deleted`);

      return NextResponse.json(
        {
          success: true,
          message: `Pembeli ${user.email} ditolak dan dihapus dari sistem.`,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Buyer management error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat memproses buyer" },
      { status: 500 }
    );
  }
}
