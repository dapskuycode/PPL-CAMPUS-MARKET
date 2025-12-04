const { prisma } = require("./src/lib/prisma");
require("dotenv").config();

async function updateAdmin() {
  try {
    console.log("Updating admin user...\n");

    const admin = await prisma.user.update({
      where: { email: "admin@campusmarket.com" },
      data: {
        statusAkun: "aktif",
        statusVerifikasi: "terverifikasi",
      },
    });

    console.log("✓ Admin user updated successfully!");
    console.log("\nAdmin Details:");
    console.log(`Email: ${admin.email}`);
    console.log(`Status Akun: ${admin.statusAkun}`);
    console.log(`Status Verifikasi: ${admin.statusVerifikasi}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error("Error updating admin user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin().then(() => process.exit(0)).catch(() => process.exit(1));
