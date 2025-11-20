"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if redirected from successful registration
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage("Registrasi berhasil! Silakan login dengan akun Anda.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }

      console.log("Login berhasil:", data);
      // Store user session
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "penjual") {
        router.push("/catalog");
      } else {
        router.push("/catalog");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-black flex items-center justify-center font-sans">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="mb-6 text-gray-600">Masukkan email dan password Anda untuk masuk.</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-zinc-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <button 
              type="submit" 
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
            <Link href="/" className="text-sm text-zinc-600 hover:underline">Kembali</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
