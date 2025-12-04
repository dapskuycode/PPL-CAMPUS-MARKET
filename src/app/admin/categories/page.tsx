"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/fetch-helper";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { PendingSellersTable } from "@/components/admin/pending-sellers-table";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      setLoading(true);
      const response = await authFetch("/api/admin/pending-sellers");
      if (!response.ok) {
        throw new Error("Failed to fetch pending sellers");
      }
      const data = await response.json();
      setPendingSellers(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (sellerId: number) => {
    try {
      const response = await fetch(`/api/admin/pending-sellers/${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified" }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify seller");
      }
      // Refresh the list
      fetchPendingSellers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user) return null;

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
