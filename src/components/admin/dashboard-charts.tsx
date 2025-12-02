import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface DashboardChartsProps {
  productsByCategory: Array<{ name: string; value: number }>;
  shopsByProvince: Array<{ name: string; value: number }>;
  sellerStats: { active: number; inactive: number };
  ratingStats: { total: number; average: number };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export function DashboardCharts({
  productsByCategory,
  shopsByProvince,
  sellerStats,
  ratingStats,
}: DashboardChartsProps) {
  const sellerData = [
    { name: "Aktif", value: sellerStats.active },
    { name: "Tidak Aktif", value: sellerStats.inactive },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
      {/* Products by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Sebaran Produk Berdasarkan Kategori</CardTitle>
          <CardDescription>Jumlah produk per kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Shops by Province */}
      <Card>
        <CardHeader>
          <CardTitle>Sebaran Toko Berdasarkan Provinsi</CardTitle>
          <CardDescription>Jumlah toko per provinsi</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shopsByProvince}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Seller Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status Penjual</CardTitle>
          <CardDescription>Penjual aktif dan tidak aktif</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sellerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rating Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Rating & Komentar</CardTitle>
          <CardDescription>Pengunjung yang memberikan review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Rating & Komentar</span>
              <span className="text-2xl font-bold">{ratingStats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rating Rata-rata</span>
              <span className="text-2xl font-bold">{ratingStats.average.toFixed(2)} ⭐</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
