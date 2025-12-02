const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log("Creating admin user...\n");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        nama: "Admin Campus Market",
        noHP: "08123456789",
        email: "admin@campusmarket.com",
        alamatJalan: "Jl Admin",
        rt: "01",
        rw: "01",
        namaKelurahan: "Admin Kelurahan",
        kabupatenKota: "Admin Kota",
        provinsi: "Admin Provinsi",
        password: hashedPassword,
        role: "admin",
        statusAkun: "aktif",
        statusVerifikasi: "terverifikasi",
      },
    });

    console.log("✓ Admin user created successfully!");
    console.log("\nAdmin Details:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123 (hashed in database)`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    if (error.message?.includes("Unique constraint")) {
      console.log("⚠ Admin user already exists");
    } else {
      console.error("Error creating admin user:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser().then(() => process.exit(0)).catch(() => process.exit(1));
