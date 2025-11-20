"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Seller {
  idUser: number;
  nama: string;
  email: string;
  noHP: string;
  noKtp: string | null;
  fotoKtp: string | null;
  fileUploadPIC: string | null;
  statusVerifikasi: string | null;
  tanggalDaftar: string | null;
  toko: {
    namaToko: string;
    deskripsiSingkat: string | null;
  } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/catalog");
      return;
    }
    
    setUser(parsedUser);
    fetchPendingSellers();
  }, [router]);

  const fetchPendingSellers = async () => {
    try {
      const response = await fetch("/api/admin/pending-sellers");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil data penjual");
      }
      
      setPendingSellers(data.sellers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (idUser: number, status: "verified" | "rejected") => {
    try {
      const response = await fetch("/api/admin/verify-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUser, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memverifikasi penjual");
      }

      // Refresh list
      fetchPendingSellers();
      alert(`Penjual berhasil ${status === "verified" ? "diverifikasi" : "ditolak"}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">
              <strong>{user?.nama || "Admin"}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-white text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Verifikasi Penjual</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {pendingSellers.length === 0 ? (
          <p className="text-zinc-600">Tidak ada penjual yang menunggu verifikasi.</p>
        ) : (
          <div className="space-y-4">
            {pendingSellers.map((seller) => (
              <div key={seller.idUser} className="border border-gray-200 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{seller.nama}</h3>
                    <p className="text-sm text-zinc-600 mb-1">
                      <strong>Email:</strong> {seller.email}
                    </p>
                    <p className="text-sm text-zinc-600 mb-1">
                      <strong>No HP:</strong> {seller.noHP}
                    </p>
                    <p className="text-sm text-zinc-600 mb-1">
                      <strong>No KTP:</strong> {seller.noKtp || "-"}
                    </p>
                    <p className="text-sm text-zinc-600 mb-1">
                      <strong>Tanggal Daftar:</strong>{" "}
                      {seller.tanggalDaftar
                        ? new Date(seller.tanggalDaftar).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                  
                  <div>
                    {seller.toko && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold">Nama Toko:</p>
                        <p className="text-sm text-zinc-700">{seller.toko.namaToko}</p>
                        {seller.toko.deskripsiSingkat && (
                          <>
                            <p className="text-sm font-semibold mt-2">Deskripsi:</p>
                            <p className="text-sm text-zinc-700">{seller.toko.deskripsiSingkat}</p>
                          </>
                        )}
                      </div>
                    )}
                    
                    {seller.fotoKtp && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold">Foto KTP:</p>
                        <a
                          href={seller.fotoKtp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Lihat Foto KTP
                        </a>
                      </div>
                    )}
                    
                    {seller.fileUploadPIC && (
                      <div>
                        <p className="text-sm font-semibold">File PIC:</p>
                        <a
                          href={seller.fileUploadPIC}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Lihat File PIC
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleVerify(seller.idUser, "verified")}
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    ✓ Verifikasi
                  </button>
                  <button
                    onClick={() => handleVerify(seller.idUser, "rejected")}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    ✕ Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
