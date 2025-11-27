import { PrismaClient } from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function hashPasswords() {
  try {
    console.log("Starting password hashing process...\n");

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        idUser: true,
        email: true,
        password: true,
      },
    });

    console.log(`Found ${users.length} users in database\n`);

    let hashedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        console.log(`✓ User ${user.email} - Password already hashed, skipping...`);
        skippedCount++;
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update user with hashed password
      await prisma.user.update({
        where: { idUser: user.idUser },
        data: { password: hashedPassword },
      });

      console.log(`✓ User ${user.email} - Password hashed successfully`);
      hashedCount++;
    }

    console.log("\n=== Summary ===");
    console.log(`Total users: ${users.length}`);
    console.log(`Passwords hashed: ${hashedCount}`);
    console.log(`Already hashed (skipped): ${skippedCount}`);
    console.log("\nPassword hashing completed successfully!");
  } catch (error) {
    console.error("Error hashing passwords:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

hashPasswords()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
