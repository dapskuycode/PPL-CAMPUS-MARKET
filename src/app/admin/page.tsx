"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { PendingSellersTable } from "@/components/admin/pending-sellers-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar
        variant="inset"
        user={{
          name: user?.nama || "Admin",
          email: user?.email || "",
          avatar: "/avatars/admin.jpg",
        }}
      />
      <SidebarInset>
        <AdminHeader userName={user?.nama || "Admin"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <AdminStats totalSellers={pendingSellers.length} pendingSellers={pendingSellers.length} verifiedSellers={0} totalProducts={0} />
              </div>
              <div className="px-4 lg:px-6">
                {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">{error}</div>}
                <PendingSellersTable sellers={pendingSellers} onVerify={handleVerify} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
