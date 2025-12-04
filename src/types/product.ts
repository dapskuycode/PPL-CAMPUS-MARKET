export interface Product {
  idProduct: number;
  namaProduk: string;
  deskripsi: string | null;
  harga: number;
  stok: number | null;
  kondisi: string | null;
  statusProduk: string | null;
  category: {
    namaKategori: string;
  } | null;
  seller: {
    nama: string;
    kabupatenKota?: string;
    provinsi?: string;
    toko: {
      namaToko: string;
    } | null;
  };
  productImage: {
    namaGambar: string;
    urutan: number | null;
  }[];
  rating?: Rating[];
}

export interface Rating {
  idRating: number;
  nilai: number | null;
  komentar: string | null;
  namaPengunjung: string;
  email: string | null;
  noHP: string | null;
  provinsi: string | null;
  tanggal: string | null;
}
