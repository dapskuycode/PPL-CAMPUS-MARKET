/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nama` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `noHP` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alamatJalan` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rw` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `namaKelurahan` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `kabupatenKota` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `provinsi` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nama" SET NOT NULL,
ALTER COLUMN "noHP" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "alamatJalan" SET NOT NULL,
ALTER COLUMN "rt" SET NOT NULL,
ALTER COLUMN "rw" SET NOT NULL,
ALTER COLUMN "namaKelurahan" SET NOT NULL,
ALTER COLUMN "kabupatenKota" SET NOT NULL,
ALTER COLUMN "provinsi" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
