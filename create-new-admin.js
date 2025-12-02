const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function createNewAdmin() {
  try {
    console.log("Deleting old admin user...\n");
    
    // Delete old admin
    await prisma.user.deleteMany({
      where: { email: "kadyagdya@gmail.com" }
    });
    console.log("✓ Old admin deleted\n");

    console.log("Creating new admin user...\n");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create new admin user
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
    console.log(`Password: admin123`);
    console.log(`Role: ${admin.role}`);
    console.log(`Status Akun: ${admin.statusAkun}`);
    console.log(`Status Verifikasi: ${admin.statusVerifikasi}`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createNewAdmin().then(() => process.exit(0)).catch(() => process.exit(1));
