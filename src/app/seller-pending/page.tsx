"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SellerPendingPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Akun Sedang Diproses</CardTitle>
          <CardDescription>Status: Menunggu Persetujuan Admin</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-6xl">⏳</div>

          <div className="text-center space-y-4">
            <p className="font-semibold text-lg">Halo, {user?.nama}!</p>
            <p className="text-muted-foreground">
              Akun penjual Anda sedang dalam proses verifikasi oleh tim admin kami.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900">📋 Apa yang terjadi selanjutnya?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Tim admin akan meninjau dokumen dan informasi Anda</li>
                <li>📧 Anda akan menerima email notifikasi hasil verifikasi</li>
                <li>🏪 Setelah disetujui, Anda dapat mulai mengelola toko dan upload produk</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>⏱️ Estimasi waktu:</strong> Proses verifikasi biasanya memakan waktu 1-3 hari kerja
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Email: <strong>{user?.email}</strong>
            </p>
          </div>

          <div className="space-y-2 w-full">
            <Button asChild className="w-full">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Jika Anda memiliki pertanyaan, silakan hubungi tim support kami di support@campusmarket.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
