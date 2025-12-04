import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// PUT - Update quantity item di cart
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const idCart = parseInt(id);
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity minimal 1" },
        { status: 400 }
      );
    }

    // Cek cart item exists dan milik user
    const cartItem = await prisma.cart.findUnique({
      where: { idCart },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item tidak ditemukan di keranjang" },
        { status: 404 }
      );
    }

    if (cartItem.idUser !== authResult.idUser) {
      return NextResponse.json(
        { error: "Forbidden - Bukan keranjang Anda" },
        { status: 403 }
      );
    }

    // Validasi stok
    if (quantity > cartItem.product.stok) {
      return NextResponse.json(
        { error: `Stok tidak mencukupi. Stok tersedia: ${cartItem.product.stok}` },
        { status: 400 }
      );
    }

    // Update quantity
    const updatedCart = await prisma.cart.update({
      where: { idCart },
      data: { quantity },
      include: {
        product: {
          include: {
            productImage: {
              orderBy: {
                urutan: "asc",
              },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quantity berhasil diupdate",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate keranjang" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus item dari cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const idCart = parseInt(id);

    // Cek cart item exists dan milik user
    const cartItem = await prisma.cart.findUnique({
      where: { idCart },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item tidak ditemukan di keranjang" },
        { status: 404 }
      );
    }

    if (cartItem.idUser !== authResult.idUser) {
      return NextResponse.json(
        { error: "Forbidden - Bukan keranjang Anda" },
        { status: 403 }
      );
    }

    // Hapus item
    await prisma.cart.delete({
      where: { idCart },
    });

    return NextResponse.json({
      success: true,
      message: "Item berhasil dihapus dari keranjang",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Gagal menghapus item dari keranjang" },
      { status: 500 }
    );
  }
}
