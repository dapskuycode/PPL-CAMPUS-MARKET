"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, CheckCircle, Clock } from "lucide-react";

interface AdminStatsProps {
  totalSellers: number;
  pendingSellers: number;
  verifiedSellers: number;
  totalProducts: number;
}

export function AdminStats({ totalSellers, pendingSellers, verifiedSellers, totalProducts }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Penjual",
      value: totalSellers,
      icon: Users,
      description: "Jumlah penjual terdaftar",
    },
    {
      title: "Menunggu Verifikasi",
      value: pendingSellers,
      icon: Clock,
      description: "Penjual pending",
    },
    {
      title: "Terverifikasi",
      value: verifiedSellers,
      icon: CheckCircle,
      description: "Penjual aktif",
    },
    {
      title: "Total Produk",
      value: totalProducts,
      icon: ShoppingBag,
      description: "Produk di katalog",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
