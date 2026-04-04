import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailVerificationLink } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId dan action harus diisi" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action harus 'approve' atau 'reject'" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { idUser: parseInt(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with verification token
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
        console.log(`✅ Verification email sent to ${user.email} after admin approval`);
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
          message: `User ${user.email} disetujui. Email verifikasi telah dikirim.`,
        },
        { status: 200 }
      );
    } else if (action === "reject") {
      // Delete user if rejected
      await prisma.user.delete({
        where: { idUser: user.idUser },
      });

      console.log(`✅ User ${user.email} rejected and deleted`);

      return NextResponse.json(
        {
          success: true,
          message: `User ${user.email} ditolak dan dihapus dari sistem.`,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Admin approval error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat memproses approval" },
      { status: 500 }
    );
  }
}
