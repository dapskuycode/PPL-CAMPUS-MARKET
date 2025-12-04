import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        toko: true, // Include toko data if user is seller
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Check if account is active (skip for admin)
    if (user.role !== "admin" && user.statusAkun !== "aktif") {
      return NextResponse.json({ error: "Akun Anda tidak aktif" }, { status: 403 });
    }

    // Check if seller is verified (skip for admin and buyer)
    if (user.role === "penjual" && user.statusVerifikasi !== "verified") {
      return NextResponse.json({ error: "Akun Anda belum diverifikasi oleh admin. Silakan tunggu proses verifikasi." }, { status: 403 });
    }

    // Return user data (exclude password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat login", details: error.message }, { status: 500 });
  }
}
