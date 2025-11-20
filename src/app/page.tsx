"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <div className="relative min-h-screen bg-white text-black font-sans">
      <header>
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setOpenRegister(true)}
            className="px-3 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Registrasi
          </button>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold text-black mb-4">
            Selamat datang di Campus Market
          </h1>
          <p className="text-lg text-zinc-600 mb-6">
            Temukan produk kampus, jual, dan dukung usaha lokal di sekitarmu.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Masuk / Mulai
            </Link>
          </div>
        </div>
      </main>

      {openRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenRegister(false)}
          />

          <div className="relative z-10 w-[92%] max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Daftar sebagai</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">Pilih peran untuk proses registrasi.</p>

            <div className="flex gap-3">
              <Link
                href="/register?role=pembeli"
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700"
                onClick={() => setOpenRegister(false)}
              >
                Pembeli
              </Link>
              <Link
                href="/register?role=penjual"
                className="flex-1 rounded-md border border-zinc-200 px-4 py-2 text-center text-zinc-800 hover:bg-zinc-50 dark:border-neutral-700 dark:text-zinc-200"
                onClick={() => setOpenRegister(false)}
              >
                Penjual
              </Link>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setOpenRegister(false)}
                className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
