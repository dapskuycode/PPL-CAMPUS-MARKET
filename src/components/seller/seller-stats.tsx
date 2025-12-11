"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconShoppingBag, IconCurrencyDollar, IconShoppingCart, IconPackage } from "@tabler/icons-react";

interface SellerStatsProps {
  sellerId?: number;
}

export function SellerStats({ sellerId }: SellerStatsProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      fetchStats();
    }
  }, [sellerId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/stats?sellerId=${sellerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats({
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          activeProducts: data.activeProducts || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
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
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      icon: IconCurrencyDollar,
      color: "text-green-600",
    },
    {
      title: "Total Pesanan",
      value: stats.totalOrders,
      icon: IconShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Produk Aktif",
      value: stats.activeProducts,
      icon: IconPackage,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
