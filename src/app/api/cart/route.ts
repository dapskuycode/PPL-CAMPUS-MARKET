import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Ambil cart user dengan detail produk
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const cart = await prisma.cart.findMany({
      where: {
        idUser: authResult.idUser,
      },
      include: {
        product: {
          include: {
            productImage: {
              orderBy: {
                urutan: "asc",
              },
              take: 1,
            },
            seller: {
              select: {
                nama: true,
                toko: {
                  select: {
                    namaToko: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Hitung total
    const totalPrice = cart.reduce((sum, item) => {
      return sum + Number(item.product.harga) * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      cart,
      totalPrice,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data keranjang" },
      { status: 500 }
    );
  }
}

// POST - Tambah item ke cart atau update quantity jika sudah ada
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { idProduct, quantity } = body;

    if (!idProduct || !quantity) {
      return NextResponse.json(
        { error: "Product ID dan quantity harus diisi" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity minimal 1" },
        { status: 400 }
      );
    }

    // Cek produk exists dan stok
    const product = await prisma.product.findUnique({
      where: { idProduct },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    if (product.statusProduk !== "aktif") {
      return NextResponse.json(
        { error: "Produk tidak aktif" },
        { status: 400 }
      );
    }

    // Cek apakah item sudah ada di cart
    const existingCart = await prisma.cart.findUnique({
      where: {
        idUser_idProduct: {
          idUser: authResult.idUser,
          idProduct,
        },
      },
    });

    if (existingCart) {
      // Update quantity
      const newQuantity = existingCart.quantity + quantity;

      // Validasi stok
      if (newQuantity > product.stok) {
        return NextResponse.json(
          { error: `Stok tidak mencukupi. Stok tersedia: ${product.stok}` },
          { status: 400 }
        );
      }

      const updatedCart = await prisma.cart.update({
        where: {
          idCart: existingCart.idCart,
        },
        data: {
          quantity: newQuantity,
        },
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
        message: "Keranjang berhasil diupdate",
        cart: updatedCart,
      });
    }

    // Validasi stok untuk item baru
    if (quantity > product.stok) {
      return NextResponse.json(
        { error: `Stok tidak mencukupi. Stok tersedia: ${product.stok}` },
        { status: 400 }
      );
    }

    // Tambah item baru ke cart
    const newCart = await prisma.cart.create({
      data: {
        idUser: authResult.idUser,
        idProduct,
        quantity,
      },
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

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan ke keranjang",
        cart: newCart,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan produk ke keranjang" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus semua item di cart
export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    await prisma.cart.deleteMany({
      where: {
        idUser: authResult.idUser,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Keranjang berhasil dikosongkan",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Gagal mengosongkan keranjang" },
      { status: 500 }
    );
  }
}
