"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { SellerStats } from "@/components/seller/seller-stats";
import { SellerChart } from "@/components/seller/seller-chart";
import { SellerProductTable } from "@/components/seller/seller-product-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "penjual") {
      router.push("/catalog");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SellerSidebar user={user} variant="inset" />
      <SidebarInset>
        <SellerHeader user={user} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SellerStats />
              <div className="px-4 lg:px-6">
                <SellerChart />
              </div>
              <SellerProductTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
