import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  await seedCategories();
  await seedUsers();
  await seedProducts();
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
          deskripsiSingkat: "Menjual berbagai elektronik berkualitas dengan harga terjangkau",
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

  const products = [
    {
      namaProduk: "Laptop ASUS ROG",
      deskripsi: "Laptop gaming dengan spesifikasi tinggi, RAM 16GB, SSD 512GB, RTX 3060",
      harga: 15000000,
      stok: 5,
      kondisi: "baru",
      idSeller: sellers[0].idUser,
      idCategory: categories.find((c) => c.namaKategori === "Elektronik")?.idCategory,
    },
    {
      namaProduk: "iPhone 13 Pro",
      deskripsi: "iPhone 13 Pro 256GB, kondisi mulus, fullset, garansi resmi",
      harga: 12000000,
      stok: 3,
      kondisi: "bekas",
      idSeller: sellers[0].idUser,
      idCategory: categories.find((c) => c.namaKategori === "Elektronik")?.idCategory,
    },
    {
      namaProduk: "Kemeja Batik Pria",
      deskripsi: "Kemeja batik premium dengan motif modern, bahan katun halus",
      harga: 250000,
      stok: 20,
      kondisi: "baru",
      idSeller: sellers[1].idUser,
      idCategory: categories.find((c) => c.namaKategori === "Fashion")?.idCategory,
    },
    {
      namaProduk: "Dress Wanita Elegant",
      deskripsi: "Dress wanita untuk acara formal, tersedia berbagai ukuran",
      harga: 350000,
      stok: 15,
      kondisi: "baru",
      idSeller: sellers[1].idUser,
      idCategory: categories.find((c) => c.namaKategori === "Fashion")?.idCategory,
    },
    {
      namaProduk: "Sepatu Nike Air Max",
      deskripsi: "Sepatu olahraga original Nike Air Max, nyaman dipakai",
      harga: 1200000,
      stok: 10,
      kondisi: "baru",
      idSeller: sellers[1].idUser,
      idCategory: categories.find((c) => c.namaKategori === "Olahraga")?.idCategory,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Created ${products.length} products`);
}

async function seedRatings() {
  console.log("Seeding ratings...");

  const products = await prisma.product.findMany({ take: 3 });

  if (products.length === 0) {
    console.log("No products found, skipping rating seeding");
    return;
  }

  const ratings = [
    {
      idProduct: products[0].idProduct,
      namaPengunjung: "Rina Wijaya",
      email: "rina@example.com",
      noHP: "081234567894",
      nilai: 5,
      komentar: "Produk sangat bagus, sesuai deskripsi. Pengiriman cepat!",
    },
    {
      idProduct: products[0].idProduct,
      namaPengunjung: "Doni Prasetyo",
      email: "doni@example.com",
      noHP: "081234567895",
      nilai: 4,
      komentar: "Bagus, tapi harga sedikit mahal. Overall puas.",
    },
    {
      idProduct: products[1]?.idProduct || products[0].idProduct,
      namaPengunjung: "Ani Susanti",
      email: "ani@example.com",
      noHP: "081234567896",
      nilai: 5,
      komentar: "Recommended! Barang original dan pelayanan ramah.",
    },
  ];

  for (const rating of ratings) {
    await prisma.rating.create({
      data: rating,
    });
  }

  console.log(`Created ${ratings.length} ratings`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
