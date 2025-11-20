"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = (searchParams?.get("role") ?? "").toLowerCase();
  const router = useRouter();

  // Common fields
  const [nama, setNama] = useState("");
  const [noHP, setNoHP] = useState("");
  const [email, setEmail] = useState("");
  const [alamatJalan, setAlamatJalan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  // Penjual-only fields
  const [noKtp, setNoKtp] = useState("");
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [fileUploadKtp, setFileUploadKtp] = useState<File | null>(null);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFotoKtpFile(e.target.files?.[0] ?? null);
  }

  function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileUploadKtp(e.target.files?.[0] ?? null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: kirim data ke backend. Saat ini hanya log dan redirect.
    const payload: any = {
      role,
      nama,
      noHP,
      email,
      alamatJalan,
      rt,
      rw,
      namaKelurahan,
      kabupatenKota,
      provinsi,
    };
    if (role === "penjual") {
      payload.noKtp = noKtp;
      payload.fotoKtpFile = fotoKtpFile?.name ?? null;
      payload.fileUploadKtp = fileUploadKtp?.name ?? null;
    }
    console.log("Register payload:", payload);
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-black mb-2">Registrasi</h1>
        <p className="mb-4 text-zinc-600">Role: <strong className="capitalize">{role || 'tidak ditentukan'}</strong></p>

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">No HP</label>
            <input value={noHP} onChange={(e) => setNoHP(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Alamat Jalan</label>
            <input value={alamatJalan} onChange={(e) => setAlamatJalan(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-700 dark:text-zinc-300">RT</label>
              <input value={rt} onChange={(e) => setRt(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-700 dark:text-zinc-300">RW</label>
              <input value={rw} onChange={(e) => setRw(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-700">Nama Kelurahan</label>
            <input value={namaKelurahan} onChange={(e) => setNamaKelurahan(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Kabupaten / Kota</label>
            <input value={kabupatenKota} onChange={(e) => setKabupatenKota(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Provinsi</label>
            <input value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          {role === "penjual" && (
            <>
              <div>
                <label className="block text-sm text-zinc-700">No KTP</label>
                <input value={noKtp} onChange={(e) => setNoKtp(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-zinc-700">Foto KTP (gambar)</label>
                <input type="file" accept="image/*" onChange={handleFotoChange} className="mt-1" />
                {fotoKtpFile && <p className="text-sm mt-1">File: {fotoKtpFile.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-zinc-700">File Upload KTP (pdf/image)</label>
                <input type="file" accept="image/*,.pdf" onChange={handleFileUploadChange} className="mt-1" />
                {fileUploadKtp && <p className="text-sm mt-1">File: {fileUploadKtp.name}</p>}
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-4">
            <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">Daftar</button>
            <Link href="/" className="text-sm text-zinc-600 hover:underline dark:text-zinc-300">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
