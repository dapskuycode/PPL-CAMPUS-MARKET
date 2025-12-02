const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in database:");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers().then(() => process.exit(0));
