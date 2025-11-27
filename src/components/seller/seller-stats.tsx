"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconShoppingBag, IconCurrencyDollar, IconEye, IconPackage } from "@tabler/icons-react";

export function SellerStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalViews: 0,
    activeProducts: 0,
  });

  useEffect(() => {
    // Fetch seller stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      // For now, using mock data
      setStats({
        totalProducts: 24,
        totalRevenue: 15750000,
        totalViews: 1250,
        activeProducts: 18,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statsData = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: IconShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: IconCurrencyDollar,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString("id-ID"),
      icon: IconEye,
      color: "text-purple-600",
    },
    {
      title: "Produk Aktif",
      value: stats.activeProducts,
      icon: IconPackage,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
