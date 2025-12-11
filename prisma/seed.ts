import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  await seedCategories();
  await seedUsers();
  await seedProducts();
  await seedOrders();
  await seedRatings();

  console.log("Database seeding completed successfully");
}

async function seedCategories() {
  console.log("Seeding categories...");

  const categories = [
    { namaKategori: "Elektronik" },
    { namaKategori: "Fashion" },
    { namaKategori: "Buku & Alat Tulis" },
    { namaKategori: "Makanan & Minuman" },
    { namaKategori: "Olahraga" },
    { namaKategori: "Kecantikan" },
    { namaKategori: "Perabotan" },
    { namaKategori: "Otomotif" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { namaKategori: category.namaKategori },
      update: {},
      create: category,
    });
  }

  console.log(`Created ${categories.length} categories`);
}

async function seedUsers() {
  console.log("Seeding users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@campusmarket.com" },
    update: {},
    create: {
      email: "admin@campusmarket.com",
      password: hashedPassword,
      nama: "Admin Campus Market",
      noHP: "081234567890",
      alamatJalan: "Jl. Admin No. 1",
      rt: "01",
      rw: "01",
      namaKelurahan: "Kelurahan Admin",
      kecamatan: "Kecamatan Admin",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      role: "admin",
      statusAkun: "aktif",
      statusVerifikasi: "verified",
    },
  });

  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@campusmarket.com" },
    update: {},
    create: {
      email: "seller1@campusmarket.com",
      password: hashedPassword,
      nama: "Budi Santoso",
      noHP: "081234567891",
      alamatJalan: "Jl. Pleburan No. 10",
      rt: "02",
      rw: "03",
      namaKelurahan: "Pleburan",
      kecamatan: "Semarang Selatan",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      noKtp: "3374010101900001",
      role: "penjual",
      statusAkun: "aktif",
      statusVerifikasi: "verified",
      toko: {
        create: {
          namaToko: "Toko Elektronik Budi",
          deskripsiSingkat:
            "Menjual berbagai elektronik berkualitas dengan harga terjangkau",
        },
      },
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: "seller2@campusmarket.com" },
    update: {},
    create: {
      email: "seller2@campusmarket.com",
      password: hashedPassword,
      nama: "Siti Nurhaliza",
      noHP: "081234567892",
      alamatJalan: "Jl. Pandanaran No. 25",
      rt: "05",
      rw: "02",
      namaKelurahan: "Pandanaran",
      kecamatan: "Semarang Tengah",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      noKtp: "3374010202910001",
      role: "penjual",
      statusAkun: "aktif",
      statusVerifikasi: "verified",
      toko: {
        create: {
          namaToko: "Fashion Siti",
          deskripsiSingkat: "Menyediakan fashion wanita dan pria terkini",
        },
      },
    },
  });

  const seller3 = await prisma.user.upsert({
    where: { email: "seller3@campusmarket.com" },
    update: {},
    create: {
      email: "seller3@campusmarket.com",
      password: hashedPassword,
      nama: "Ahmad Fauzi",
      noHP: "081234567893",
      alamatJalan: "Jl. Imam Bonjol No. 15",
      rt: "03",
      rw: "04",
      namaKelurahan: "Tegalsari",
      kecamatan: "Candisari",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      noKtp: "3374010303920001",
      role: "penjual",
      statusAkun: "aktif",
      statusVerifikasi: "pending",
      toko: {
        create: {
          namaToko: "Toko Buku Ahmad",
          deskripsiSingkat: "Toko buku dan alat tulis lengkap",
        },
      },
    },
  });

  const buyer1 = await prisma.user.upsert({
    where: { email: "buyer1@campusmarket.com" },
    update: {},
    create: {
      email: "buyer1@campusmarket.com",
      password: hashedPassword,
      nama: "Rina Wijaya",
      noHP: "081234567894",
      alamatJalan: "Jl. Gajah Mada No. 50",
      rt: "01",
      rw: "02",
      namaKelurahan: "Karangayu",
      kecamatan: "Semarang Barat",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      role: "pembeli",
      statusAkun: "aktif",
      statusVerifikasi: "verified",
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: "buyer2@campusmarket.com" },
    update: {},
    create: {
      email: "buyer2@campusmarket.com",
      password: hashedPassword,
      nama: "Doni Prasetyo",
      noHP: "081234567895",
      alamatJalan: "Jl. Pemuda No. 100",
      rt: "04",
      rw: "05",
      namaKelurahan: "Sekayu",
      kecamatan: "Semarang Tengah",
      kabupatenKota: "Kota Semarang",
      provinsi: "Jawa Tengah",
      role: "pembeli",
      statusAkun: "aktif",
      statusVerifikasi: "verified",
    },
  });

  console.log("Created users: admin, sellers, and buyers");
}

async function seedProducts() {
  console.log("Seeding products...");

  const categories = await prisma.category.findMany();
  const sellers = await prisma.user.findMany({
    where: { role: "penjual", statusVerifikasi: "verified" },
  });

  if (sellers.length === 0) {
    console.log("No verified sellers found, skipping product seeding");
    return;
  }

  const productsWithImages = [
    {
      product: {
        namaProduk: "Laptop ASUS ROG",
        deskripsi:
          "Laptop gaming dengan spesifikasi tinggi, RAM 16GB, SSD 512GB, RTX 3060",
        harga: 15000000,
        stok: 5,
        kondisi: "baru",
        idSeller: sellers[0].idUser,
        idCategory: categories.find((c) => c.namaKategori === "Elektronik")
          ?.idCategory,
      },
      images: ["rog1.jpg", "rog2.jpg"],
    },
    {
      product: {
        namaProduk: "iPhone 13 Pro",
        deskripsi: "iPhone 13 Pro 256GB, kondisi mulus, fullset, garansi resmi",
        harga: 12000000,
        stok: 3,
        kondisi: "bekas",
        idSeller: sellers[0].idUser,
        idCategory: categories.find((c) => c.namaKategori === "Elektronik")
          ?.idCategory,
      },
      images: ["ip13.jpg"],
    },
    {
      product: {
        namaProduk: "Kemeja Batik Pria",
        deskripsi:
          "Kemeja batik premium dengan motif modern, bahan katun halus",
        harga: 250000,
        stok: 20,
        kondisi: "baru",
        idSeller: sellers[1].idUser,
        idCategory: categories.find((c) => c.namaKategori === "Fashion")
          ?.idCategory,
      },
      images: ["batik.webp"],
    },
    {
      product: {
        namaProduk: "Dress Wanita Elegant",
        deskripsi: "Dress wanita untuk acara formal, tersedia berbagai ukuran",
        harga: 350000,
        stok: 15,
        kondisi: "baru",
        idSeller: sellers[1].idUser,
        idCategory: categories.find((c) => c.namaKategori === "Fashion")
          ?.idCategory,
      },
      images: ["dress.jfif"],
    },
    {
      product: {
        namaProduk: "Sepatu Nike Air Max",
        deskripsi: "Sepatu olahraga original Nike Air Max, nyaman dipakai",
        harga: 1200000,
        stok: 10,
        kondisi: "baru",
        idSeller: sellers[1].idUser,
        idCategory: categories.find((c) => c.namaKategori === "Olahraga")
          ?.idCategory,
      },
      images: ["nike.webp"],
    },
  ];

  // Create Laptop ASUS ROG
  const laptopAsus = await prisma.product.upsert({
    where: { idProduct: 1 },
    update: {},
    create: productsWithImages[0].product,
  });
  await prisma.productImage.deleteMany({
    where: { idProduct: laptopAsus.idProduct },
  });
  for (let i = 0; i < productsWithImages[0].images.length; i++) {
    await prisma.productImage.create({
      data: {
        idProduct: laptopAsus.idProduct,
        namaGambar: productsWithImages[0].images[i],
        urutan: i + 1,
      },
    });
  }

  // Create iPhone 13 Pro
  const iphone = await prisma.product.upsert({
    where: { idProduct: 2 },
    update: {},
    create: productsWithImages[1].product,
  });
  await prisma.productImage.deleteMany({
    where: { idProduct: iphone.idProduct },
  });
  for (let i = 0; i < productsWithImages[1].images.length; i++) {
    await prisma.productImage.create({
      data: {
        idProduct: iphone.idProduct,
        namaGambar: productsWithImages[1].images[i],
        urutan: i + 1,
      },
    });
  }

  // Create Kemeja Batik
  const batik = await prisma.product.upsert({
    where: { idProduct: 3 },
    update: {},
    create: productsWithImages[2].product,
  });
  await prisma.productImage.deleteMany({
    where: { idProduct: batik.idProduct },
  });
  for (let i = 0; i < productsWithImages[2].images.length; i++) {
    await prisma.productImage.create({
      data: {
        idProduct: batik.idProduct,
        namaGambar: productsWithImages[2].images[i],
        urutan: i + 1,
      },
    });
  }

  // Create Dress Wanita
  const dress = await prisma.product.upsert({
    where: { idProduct: 4 },
    update: {},
    create: productsWithImages[3].product,
  });
  await prisma.productImage.deleteMany({
    where: { idProduct: dress.idProduct },
  });
  for (let i = 0; i < productsWithImages[3].images.length; i++) {
    await prisma.productImage.create({
      data: {
        idProduct: dress.idProduct,
        namaGambar: productsWithImages[3].images[i],
        urutan: i + 1,
      },
    });
  }

  // Create Sepatu Nike
  const nike = await prisma.product.upsert({
    where: { idProduct: 5 },
    update: {},
    create: productsWithImages[4].product,
  });
  await prisma.productImage.deleteMany({
    where: { idProduct: nike.idProduct },
  });
  for (let i = 0; i < productsWithImages[4].images.length; i++) {
    await prisma.productImage.create({
      data: {
        idProduct: nike.idProduct,
        namaGambar: productsWithImages[4].images[i],
        urutan: i + 1,
      },
    });
  }

  console.log(`Created ${productsWithImages.length} products with images`);
}

async function seedOrders() {
  console.log("Seeding orders and order items...");

  const buyers = await prisma.user.findMany({
    where: { role: "pembeli" },
  });

  const products = await prisma.product.findMany({
    include: { seller: true },
  });

  if (buyers.length === 0 || products.length === 0) {
    console.log("No buyers or products found, skipping order seeding");
    return;
  }

  // Helper function to get random date within last 6 months
  const getRandomDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
  };

  // Helper function to get random elements from array
  const getRandomElements = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const orderStatuses = ["pending", "selesai", "dibatalkan", "diproses"];
  const paymentMethods = [
    "Transfer Bank",
    "E-Wallet",
    "COD",
    "QRIS",
    "Kartu Kredit",
  ];

  let totalOrders = 0;
  let totalOrderItems = 0;

  // Create orders for each buyer with varied distribution
  for (const buyer of buyers) {
    // Each buyer gets 3-8 random orders
    const numOrders = Math.floor(Math.random() * 6) + 3;

    for (let i = 0; i < numOrders; i++) {
      // Random date within last 180 days
      const orderDate = getRandomDate(180);

      // Random status with higher probability for completed orders
      const statusRandom = Math.random();
      let status: string;
      if (statusRandom < 0.6) status = "selesai"; // 60% completed
      else if (statusRandom < 0.75) status = "diproses"; // 15% processing
      else if (statusRandom < 0.85) status = "pending"; // 10% pending
      else status = "dibatalkan"; // 10% cancelled

      // Select 1-4 random products for this order
      const orderProducts = getRandomElements(
        products,
        Math.floor(Math.random() * 3) + 1
      );

      let orderTotal = 0;
      const orderItemsData = [];

      for (const product of orderProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const price = product.harga;
        const subtotal = Number(price) * quantity;
        orderTotal += subtotal;

        orderItemsData.push({
          idProduct: product.idProduct,
          quantity,
          price,
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          idUser: buyer.idUser,
          totalPrice: orderTotal,
          status,
          paymentMethod:
            paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shippingAddress: `${buyer.alamatJalan}, RT ${buyer.rt}/RW ${buyer.rw}, ${buyer.namaKelurahan}, ${buyer.kecamatan}, ${buyer.kabupatenKota}, ${buyer.provinsi}`,
          orderDate,
          updatedAt: orderDate,
          orderNotes:
            Math.random() > 0.5 ? "Mohon packing dengan bubble wrap" : null,
        },
      });

      totalOrders++;

      // Create order items
      for (const itemData of orderItemsData) {
        await prisma.orderItem.create({
          data: {
            idOrder: order.idOrder,
            idProduct: itemData.idProduct,
            quantity: itemData.quantity,
            price: itemData.price,
          },
        });
        totalOrderItems++;
      }
    }
  }

  console.log(
    `Created ${totalOrders} orders with ${totalOrderItems} order items`
  );
}

async function seedRatings() {
  console.log("Seeding ratings...");

  const buyers = await prisma.user.findMany({
    where: { role: "pembeli" },
  });

  const products = await prisma.product.findMany();

  if (buyers.length === 0 || products.length === 0) {
    console.log("No buyers or products found, skipping rating seeding");
    return;
  }

  // Comments pool for variety
  const comments = [
    {
      rating: 5,
      texts: [
        "Produk sangat bagus, sesuai deskripsi. Pengiriman cepat!",
        "Sangat puas! Barang original dan kualitas terjamin.",
        "Recommended! Pelayanan seller sangat ramah dan responsif.",
        "Mantap! Worth it banget dengan harganya.",
        "Memuaskan sekali, packing rapi dan aman.",
        "Excellent! Barang sampai dengan selamat dan cepat.",
        "Top banget! Sesuai ekspektasi, bahkan lebih baik.",
        "Sangat memuaskan, akan beli lagi di sini.",
      ],
    },
    {
      rating: 4,
      texts: [
        "Bagus, tapi harga sedikit mahal. Overall puas.",
        "Produk sesuai deskripsi, pengiriman agak lama tapi oke.",
        "Barang bagus, cuma packaging bisa lebih rapi.",
        "Kualitas oke, hanya saja warna sedikit berbeda dari foto.",
        "Memuaskan, pengiriman lumayan cepat.",
        "Good product, komunikasi dengan seller bisa lebih baik.",
        "Produk oke, minus di pengiriman yang agak delay.",
      ],
    },
    {
      rating: 3,
      texts: [
        "Lumayan, sesuai harga. Ada sedikit cacat tapi masih bisa dipakai.",
        "Biasa aja, tidak terlalu istimewa tapi juga tidak mengecewakan.",
        "Produk standar, sesuai ekspektasi harga segitu.",
        "Ok lah, ada kekurangan minor tapi masih acceptable.",
        "Netral, produk biasa saja untuk harga segini.",
      ],
    },
    {
      rating: 2,
      texts: [
        "Kurang puas, barang tidak sesuai foto.",
        "Mengecewakan, kualitas di bawah ekspektasi.",
        "Kurang worth it, harga tidak sesuai kualitas.",
        "Tidak recommended, banyak kekurangan.",
      ],
    },
    {
      rating: 1,
      texts: [
        "Sangat mengecewakan! Barang rusak saat sampai.",
        "Tidak sesuai deskripsi sama sekali. Kecewa berat.",
        "Barang cacat dan seller tidak responsif.",
        "Terburuk! Tidak akan beli lagi di sini.",
      ],
    },
  ];

  let totalRatings = 0;

  // Create ratings with varied distribution
  // Each product gets 2-8 ratings from different buyers
  for (const product of products) {
    const numRatings = Math.floor(Math.random() * 7) + 2;

    // Shuffle buyers to get random reviewers
    const shuffledBuyers = [...buyers].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(numRatings, buyers.length); i++) {
      const buyer = shuffledBuyers[i];

      // Random rating with higher probability for positive ratings
      const ratingRandom = Math.random();
      let nilai: number;
      if (ratingRandom < 0.4) nilai = 5; // 40% excellent
      else if (ratingRandom < 0.7) nilai = 4; // 30% good
      else if (ratingRandom < 0.85) nilai = 3; // 15% average
      else if (ratingRandom < 0.95) nilai = 2; // 10% poor
      else nilai = 1; // 5% very poor

      // Get random comment for this rating
      const commentPool = comments.find((c) => c.rating === nilai);
      const komentar =
        commentPool?.texts[
          Math.floor(Math.random() * commentPool.texts.length)
        ];

      // Random date within last 120 days
      const tanggal = new Date();
      tanggal.setDate(tanggal.getDate() - Math.floor(Math.random() * 120));

      // Check if this buyer-product combination already has a rating
      const existingRating = await prisma.rating.findFirst({
        where: {
          idProduct: product.idProduct,
          email: buyer.email,
        },
      });

      if (!existingRating) {
        await prisma.rating.create({
          data: {
            idProduct: product.idProduct,
            namaPengunjung: buyer.nama,
            email: buyer.email,
            noHP: buyer.noHP,
            nilai,
            komentar,
            tanggal,
          },
        });
        totalRatings++;
      }
    }
  }

  console.log(`Created ${totalRatings} ratings`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
