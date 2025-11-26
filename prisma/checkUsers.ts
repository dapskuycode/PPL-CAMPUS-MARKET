import { PrismaClient } from "../src/generated/prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      idUser: true,
      nama: true,
      email: true,
      noHP: true,
      role: true,
      statusAkun: true,
      tanggalDaftar: true,
    },
  });

  console.log("\n📊 Daftar User di Database:\n");
  console.table(users);
  console.log(`\nTotal: ${users.length} user\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
