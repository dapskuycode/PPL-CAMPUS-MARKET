# Dokumentasi Sistem CRUD Produk

## Overview

Sistem CRUD (Create, Read, Update, Delete) untuk manajemen produk di seller dashboard sudah berhasil diimplementasikan.

## Struktur File

### 1. API Routes

#### `/src/app/api/products/route.ts`

- **GET**: Mengambil semua produk berdasarkan `sellerId`
  - Parameter: `?sellerId={id}`
  - Response: Array produk dengan relasi category dan productImage
- **POST**: Menambah produk baru
  - Body: `{ namaProduk, deskripsi, harga, stok, kondisi, statusProduk, idCategory, idSeller, images }`
  - Response: Produk yang baru dibuat

#### `/src/app/api/products/[id]/route.ts`

- **GET**: Mengambil detail satu produk
  - Response: Produk dengan relasi category, seller, dan productImage
- **PUT**: Update produk
  - Body: `{ namaProduk, deskripsi, harga, stok, kondisi, statusProduk, idCategory, images }`
  - Response: Produk yang diupdate
- **DELETE**: Menghapus produk
  - Response: Message success

#### `/src/app/api/categories/route.ts`

- **GET**: Mengambil semua kategori
  - Response: Array kategori

#### `/src/app/api/upload/route.ts`

- **POST**: Upload gambar produk
  - Body: FormData dengan file `images`
  - Response: `{ files: string[] }` - Array nama file yang diupload
  - Files disimpan di: `/public/fotoBarang/`

### 2. Components

#### `/src/components/seller/product-form.tsx`

Form untuk create dan edit produk dengan field:

- Nama Produk (required)
- Deskripsi
- Harga (required)
- Stok
- Kondisi (baru/bekas)
- Status (tersedia/habis/preorder)
- Kategori (dropdown, required)
- Upload gambar (multiple files)

**Features:**

- Auto-fetch categories dari API
- Auto-load data produk saat edit mode
- Upload gambar ke `/api/upload`
- Validation untuk field required

#### `/src/components/seller/seller-product-table.tsx`

Tabel untuk menampilkan daftar produk dengan fitur:

- Tampilan tabel dengan kolom: Produk, Kategori, Harga, Stok, Kondisi, Status, Aksi
- Button "Tambah Produk" untuk create
- Button Edit untuk setiap produk
- Button Delete dengan confirmation dialog
- Auto-refresh data setelah create/edit/delete

### 3. Database Schema (Prisma)

```prisma
model Product {
  idProduct     Int            @id @default(autoincrement())
  idSeller      Int
  idCategory    Int?
  namaProduk    String
  deskripsi     String?
  harga         Decimal
  stok          Int?
  kondisi       String?        // "baru" | "bekas"
  statusProduk  String?        // "tersedia" | "habis" | "preorder"
  tanggalUpload DateTime?

  category      Category?
  seller        User
  productImage  ProductImage[]
}

model ProductImage {
  idImage    Int
  idProduct  Int
  namaGambar String
  urutan     Int?
}

model Category {
  idCategory   Int
  namaKategori String
}
```

## Cara Menggunakan

### 1. Menambah Produk Baru

1. Login sebagai penjual
2. Buka dashboard seller (`/dashboard`)
3. Klik tombol "Tambah Produk"
4. Isi form dengan data produk
5. Upload gambar (opsional)
6. Klik "Tambah Produk"

### 2. Edit Produk

1. Di tabel produk, klik icon edit pada produk yang ingin diedit
2. Form akan muncul dengan data produk yang sudah terisi
3. Ubah data yang diperlukan
4. Upload gambar baru jika ingin mengganti gambar lama
5. Klik "Update"

### 3. Hapus Produk

1. Di tabel produk, klik icon trash pada produk yang ingin dihapus
2. Konfirmasi dialog akan muncul
3. Klik "Hapus" untuk confirm atau "Batal" untuk cancel

## Field Mapping

Form field → Database field:

- `namaProduk` → `namaProduk`
- `deskripsi` → `deskripsi`
- `harga` → `harga`
- `stok` → `stok`
- `kondisi` → `kondisi`
- `statusProduk` → `statusProduk`
- `idCategory` → `idCategory`
- `images[]` → `productImage.namaGambar`

## Validasi

### Required Fields:

- Nama Produk
- Harga
- Kategori
- Seller ID (auto dari localStorage)

### Optional Fields:

- Deskripsi
- Stok (default: 0)
- Kondisi (default: "baru")
- Status Produk (default: "tersedia")
- Gambar

## Error Handling

- API error akan ditampilkan dengan alert
- Form validation akan mencegah submit jika field required kosong
- Delete confirmation dialog mencegah penghapusan tidak sengaja

## Testing Checklist

- [ ] Create produk baru tanpa gambar
- [ ] Create produk baru dengan gambar
- [ ] Edit produk tanpa mengubah gambar
- [ ] Edit produk dengan gambar baru
- [ ] Delete produk
- [ ] Validasi field required
- [ ] Dropdown kategori terisi dengan benar
- [ ] Table auto-refresh setelah CRUD operation

## Notes

- Gambar disimpan di `/public/fotoBarang/` dengan format: `{timestamp}-{random}-{filename}`
- User harus login sebagai penjual untuk mengakses fitur ini
- Session disimpan di localStorage dengan key "user"
