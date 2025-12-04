import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRatingThankYouEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      idProduct,
      namaPengunjung,
      noHP,
      email,
      nilai,
      komentar,
    } = body;

    // Validasi input
    if (
      !idProduct ||
      !namaPengunjung ||
      !noHP ||
      !email ||
      !nilai ||
      !komentar
    ) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Validasi nilai rating
    if (nilai < 1 || nilai > 5 || !Number.isInteger(nilai)) {
      return NextResponse.json(
        { error: "Rating harus berupa angka 1-5" },
        { status: 400 }
      );
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi product exists
    const product = await prisma.product.findUnique({
      where: { idProduct },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check for duplicate rating (same email + product)
    const existingRating = await prisma.rating.findFirst({
      where: {
        idProduct,
        email,
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "Anda sudah memberikan rating untuk produk ini" },
        { status: 409 }
      );
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        idProduct,
        namaPengunjung,
        noHP,
        email,
        nilai,
        komentar,
        tanggal: new Date(),
      },
    });

    // Send thank you email notification
    try {
      await sendRatingThankYouEmail(
        email,
        namaPengunjung,
        product.namaProduk,
        nilai
      );
    } catch (emailError) {
      console.error("Email notification failed (non-critical):", emailError);
      // Continue execution even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Rating berhasil disimpan",
        rating,
        emailSent: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat menyimpan rating",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
