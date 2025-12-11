/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Toko` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_idCategory_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_idSeller_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_idProduct_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_idProduct_fkey";

-- DropForeignKey
ALTER TABLE "Toko" DROP CONSTRAINT "Toko_idSeller_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "Rating";

-- DropTable
DROP TABLE "Toko";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "idUser" SERIAL NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "noHP" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "alamatJalan" VARCHAR(255) NOT NULL,
    "rt" VARCHAR(10) NOT NULL,
    "rw" VARCHAR(10) NOT NULL,
    "namaKelurahan" VARCHAR(100) NOT NULL,
    "kabupatenKota" VARCHAR(100) NOT NULL,
    "provinsi" VARCHAR(100) NOT NULL,
    "noKtp" VARCHAR(30),
    "fotoKtp" VARCHAR(255),
    "fileUploadPIC" VARCHAR(255),
    "statusVerifikasi" VARCHAR(20) DEFAULT 'pending',
    "tanggalVerifikasi" TIMESTAMP(6),
    "statusAkun" VARCHAR(20) DEFAULT 'aktif',
    "tanggalDaftar" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(50) NOT NULL DEFAULT 'pembeli',
    "password" VARCHAR(255) NOT NULL,
    "kecamatan" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "toko" (
    "idToko" SERIAL NOT NULL,
    "namaToko" VARCHAR(255) NOT NULL,
    "idSeller" INTEGER NOT NULL,
    "deskripsiSingkat" TEXT,

    CONSTRAINT "toko_pkey" PRIMARY KEY ("idToko")
);

-- CreateTable
CREATE TABLE "categories" (
    "idCategory" SERIAL NOT NULL,
    "namaKategori" VARCHAR(255) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("idCategory")
);

-- CreateTable
CREATE TABLE "products" (
    "idProduct" SERIAL NOT NULL,
    "idSeller" INTEGER NOT NULL,
    "idCategory" INTEGER,
    "namaProduk" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "harga" DECIMAL(15,2) NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "berat" DECIMAL(10,2),
    "kondisi" VARCHAR(10) NOT NULL DEFAULT 'baru',
    "lokasi" VARCHAR(255),
    "tanggalUpload" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusProduk" VARCHAR(20) NOT NULL DEFAULT 'aktif',

    CONSTRAINT "products_pkey" PRIMARY KEY ("idProduct")
);

-- CreateTable
CREATE TABLE "product_images" (
    "idImage" SERIAL NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "namaGambar" VARCHAR(255) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("idImage")
);

-- CreateTable
CREATE TABLE "ratings" (
    "idRating" SERIAL NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "namaPengunjung" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "noHP" VARCHAR(20),
    "komentar" TEXT,
    "nilai" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("idRating")
);

-- CreateTable
CREATE TABLE "cart" (
    "idCart" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("idCart")
);

-- CreateTable
CREATE TABLE "orders" (
    "idOrder" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "totalPrice" DECIMAL(15,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "paymentMethod" VARCHAR(50),
    "shippingAddress" TEXT,
    "orderDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "orderNotes" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("idOrder")
);

-- CreateTable
CREATE TABLE "order_items" (
    "idOrderItem" SERIAL NOT NULL,
    "idOrder" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("idOrderItem")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_statusVerifikasi_idx" ON "users"("statusVerifikasi");

-- CreateIndex
CREATE UNIQUE INDEX "toko_idSeller_key" ON "toko"("idSeller");

-- CreateIndex
CREATE INDEX "toko_namaToko_idx" ON "toko"("namaToko");

-- CreateIndex
CREATE UNIQUE INDEX "categories_namaKategori_key" ON "categories"("namaKategori");

-- CreateIndex
CREATE INDEX "categories_namaKategori_idx" ON "categories"("namaKategori");

-- CreateIndex
CREATE INDEX "products_idSeller_idx" ON "products"("idSeller");

-- CreateIndex
CREATE INDEX "products_idCategory_idx" ON "products"("idCategory");

-- CreateIndex
CREATE INDEX "products_statusProduk_idx" ON "products"("statusProduk");

-- CreateIndex
CREATE INDEX "products_namaProduk_idx" ON "products"("namaProduk");

-- CreateIndex
CREATE INDEX "product_images_idProduct_idx" ON "product_images"("idProduct");

-- CreateIndex
CREATE INDEX "ratings_idProduct_idx" ON "ratings"("idProduct");

-- CreateIndex
CREATE INDEX "ratings_nilai_idx" ON "ratings"("nilai");

-- CreateIndex
CREATE INDEX "cart_idUser_idx" ON "cart"("idUser");

-- CreateIndex
CREATE INDEX "cart_idProduct_idx" ON "cart"("idProduct");

-- CreateIndex
CREATE UNIQUE INDEX "cart_idUser_idProduct_key" ON "cart"("idUser", "idProduct");

-- CreateIndex
CREATE INDEX "orders_idUser_idx" ON "orders"("idUser");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderDate_idx" ON "orders"("orderDate");

-- CreateIndex
CREATE INDEX "order_items_idOrder_idx" ON "order_items"("idOrder");

-- CreateIndex
CREATE INDEX "order_items_idProduct_idx" ON "order_items"("idProduct");

-- AddForeignKey
ALTER TABLE "toko" ADD CONSTRAINT "toko_idSeller_fkey" FOREIGN KEY ("idSeller") REFERENCES "users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "categories"("idCategory") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_idSeller_fkey" FOREIGN KEY ("idSeller") REFERENCES "users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_idOrder_fkey" FOREIGN KEY ("idOrder") REFERENCES "orders"("idOrder") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "products"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;
