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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alamatJalan, setAlamatJalan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  // Penjual-only fields
  const [noKtp, setNoKtp] = useState("");
  const [namaToko, setNamaToko] = useState("");
  const [deskripsiToko, setDeskripsiToko] = useState("");
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [fileUploadKtp, setFileUploadKtp] = useState<File | null>(null);
  
  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFotoKtpFile(e.target.files?.[0] ?? null);
  }

  function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileUploadKtp(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("nama", nama);
    formData.append("noHP", noHP);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("alamatJalan", alamatJalan);
    formData.append("rt", rt);
    formData.append("rw", rw);
    formData.append("namaKelurahan", namaKelurahan);
    formData.append("kabupatenKota", kabupatenKota);
    formData.append("provinsi", provinsi);
    
    if (role === "penjual") {
      formData.append("noKtp", noKtp);
      formData.append("namaToko", namaToko);
      formData.append("deskripsiToko", deskripsiToko);
      
      if (fotoKtpFile) {
        formData.append("fotoKtp", fotoKtpFile);
      }
      if (fileUploadKtp) {
        formData.append("fileUploadKtp", fileUploadKtp);
      }
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      console.log("Registrasi berhasil:", data);
      router.push("/login?registered=true");
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-black flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl border border-gray-100 my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Registrasi</h1>
        <p className="mb-6 text-gray-600">Role: <strong className="capitalize text-blue-600">{role || 'tidak ditentukan'}</strong></p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
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
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required minLength={6} />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Konfirmasi Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" required minLength={6} />
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
                <label className="block text-sm text-zinc-700">Nama Toko</label>
                <input value={namaToko} onChange={(e) => setNamaToko(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Contoh: Toko Kampus Jaya" required />
              </div>

              <div>
                <label className="block text-sm text-zinc-700">Deskripsi Toko</label>
                <textarea value={deskripsiToko} onChange={(e) => setDeskripsiToko(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" rows={3} placeholder="Deskripsi singkat tentang toko Anda..."></textarea>
              </div>

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
            <button 
              type="submit" 
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-2.5 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
            <Link href="/" className="text-sm text-zinc-600 hover:underline dark:text-zinc-300">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
