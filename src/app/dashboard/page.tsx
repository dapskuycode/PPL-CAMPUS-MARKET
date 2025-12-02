"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { SellerStats } from "@/components/seller/seller-stats";
import { SellerChart } from "@/components/seller/seller-chart";
import { SellerDashboardCharts } from "@/components/seller/seller-dashboard-charts";
import { SellerReports } from "@/components/seller/seller-reports";
import { SellerProductTable } from "@/components/seller/seller-product-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
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
    
    // Fetch dashboard data
    fetchDashboardData(parsedUser.idUser);
  }, [router]);

  const fetchDashboardData = async (sellerId: number) => {
    try {
      const response = await fetch(`/api/seller/dashboard?sellerId=${sellerId}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Dashboard error:", data.error);
        return;
      }
      
      setDashboardData(data);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
    }
  };

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
              
              {dashboardData && (
                <div className="px-4 lg:px-6">
                  <SellerDashboardCharts
                    stockByProduct={dashboardData.stockByProduct || []}
                    ratingByProduct={dashboardData.ratingByProduct || []}
                    ratersByProvince={dashboardData.ratersByProvince || []}
                  />
                </div>
              )}
              
              <div className="px-4 lg:px-6">
                <SellerReports sellerId={user.idUser} />
              </div>
              
              <SellerProductTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
