import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import * as bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const role = formData.get("role") as string;
    const nama = formData.get("nama") as string;
    const noHP = formData.get("noHP") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const alamatJalan = formData.get("alamatJalan") as string;
    const rt = (formData.get("rt") as string) || "";
    const rw = (formData.get("rw") as string) || "";
    const namaKelurahan = (formData.get("namaKelurahan") as string) || "";
    const kecamatan = (formData.get("kecamatan") as string) || "";
    const kabupatenKota = (formData.get("kabupatenKota") as string) || "";
    const provinsi = (formData.get("provinsi") as string) || "";
    const noKtp = (formData.get("noKtp") as string) || "";
    const namaToko = (formData.get("namaToko") as string) || "";
    const deskripsiToko = (formData.get("deskripsiToko") as string) || "";

    const fotoKtpFile = formData.get("fotoKtp") as File | null;
    const fileUploadPICFile = formData.get("fileUploadKtp") as File | null;

    // Validate required fields
    if (!nama || !noHP || !email || !password || !alamatJalan || !role) {
      return NextResponse.json({ error: "Data wajib tidak lengkap" }, { status: 400 });
    }

    // Strengthen password requirements
    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
      return NextResponse.json(
        { error: "Password harus mengandung huruf besar, angka, dan karakter khusus" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    // Handle file uploads
    let fotoKtpPath: string | null = null;
    let fileUploadPICPath: string | null = null;

    if (role === "penjual") {
      // Save fotoKtp to public/fotoKTP
      if (fotoKtpFile && fotoKtpFile.size > 0) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${fotoKtpFile.name}`;
        const bytes = await fotoKtpFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(process.cwd(), "public", "fotoKTP", fileName);
        await writeFile(filePath, buffer);
        fotoKtpPath = `/fotoKTP/${fileName}`;
      }

      // Save fileUploadPIC to public/fotoPIC
      if (fileUploadPICFile && fileUploadPICFile.size > 0) {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${fileUploadPICFile.name}`;
        const bytes = await fileUploadPICFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(process.cwd(), "public", "fotoPIC", fileName);
        await writeFile(filePath, buffer);
        fileUploadPICPath = `/fotoPIC/${fileName}`;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        nama,
        noHP,
        email,
        password: hashedPassword,
        alamatJalan,
        rt,
        rw,
        namaKelurahan,
        kecamatan,
        kabupatenKota,
        provinsi,
        noKtp: role === "penjual" && noKtp ? noKtp : null,
        fotoKtp: fotoKtpPath,
        fileUploadPIC: fileUploadPICPath,
        role: role,
        statusAkun: "aktif",
        statusVerifikasi: role === "penjual" ? "pending" : "verified",
      },
    });

    // If penjual, create Toko
    if (role === "penjual" && namaToko) {
      await prisma.toko.create({
        data: {
          namaToko,
          deskripsiSingkat: deskripsiToko || null,
          idSeller: user.idUser,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        userId: user.idUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi", details: error.message }, { status: 500 });
  }
}
