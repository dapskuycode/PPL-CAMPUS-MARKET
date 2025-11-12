-- CreateTable
CREATE TABLE "User" (
    "idUser" SERIAL NOT NULL,
    "nama" VARCHAR(255),
    "noHP" VARCHAR(20),
    "email" VARCHAR(255),
    "alamatJalan" VARCHAR(255),
    "rt" VARCHAR(10),
    "rw" VARCHAR(10),
    "namaKelurahan" VARCHAR(100),
    "kabupatenKota" VARCHAR(100),
    "provinsi" VARCHAR(100),
    "noKtp" VARCHAR(30),
    "fotoKtp" VARCHAR(255),
    "fileUploadKtp" VARCHAR(255),
    "statusVerifikasi" VARCHAR(20),
    "tanggalVerifikasi" TIMESTAMP(6),
    "statusAkun" VARCHAR(20),
    "tanggalDaftar" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(50),

    CONSTRAINT "User_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Toko" (
    "idToko" SERIAL NOT NULL,
    "namaToko" VARCHAR(255) NOT NULL,
    "idSeller" INTEGER NOT NULL,
    "deskripsiSingkat" TEXT,

    CONSTRAINT "Toko_pkey" PRIMARY KEY ("idToko")
);

-- CreateTable
CREATE TABLE "Category" (
    "idCategory" SERIAL NOT NULL,
    "namaKategori" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("idCategory")
);

-- CreateTable
CREATE TABLE "Product" (
    "idProduct" SERIAL NOT NULL,
    "idSeller" INTEGER NOT NULL,
    "idCategory" INTEGER,
    "namaProduk" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "harga" DECIMAL(15,2) NOT NULL,
    "stok" INTEGER DEFAULT 0,
    "berat" DECIMAL(10,2),
    "kondisi" VARCHAR(10),
    "lokasi" VARCHAR(255),
    "tanggalUpload" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "statusProduk" VARCHAR(20) DEFAULT 'aktif',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("idProduct")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "idImage" SERIAL NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "namaGambar" VARCHAR(255) NOT NULL,
    "urutan" INTEGER,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("idImage")
);

-- CreateTable
CREATE TABLE "Rating" (
    "idRating" SERIAL NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "namaPengunjung" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "noHP" VARCHAR(20),
    "komentar" TEXT,
    "nilai" INTEGER,
    "tanggal" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("idRating")
);

-- CreateIndex
CREATE UNIQUE INDEX "Toko_idSeller_key" ON "Toko"("idSeller");

-- AddForeignKey
ALTER TABLE "Toko" ADD CONSTRAINT "Toko_idSeller_fkey" FOREIGN KEY ("idSeller") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_idSeller_fkey" FOREIGN KEY ("idSeller") REFERENCES "User"("idUser") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "Category"("idCategory") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("idProduct") ON DELETE CASCADE ON UPDATE CASCADE;
