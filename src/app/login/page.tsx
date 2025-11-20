"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: implement real authentication
    console.log({ email, password });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center font-sans">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-black mb-2">Login</h1>
        <p className="mb-4 text-zinc-600">Masukkan email dan password Anda untuk masuk.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-zinc-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Masuk</button>
            <Link href="/" className="text-sm text-zinc-600 hover:underline">Kembali</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
