import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface SellerDashboardChartsProps {
  stockByProduct: Array<{ name: string; stock: number }>;
  ratingByProduct: Array<{ name: string; rating: number; count: number }>;
  ratersByProvince: Array<{ name: string; value: number }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function SellerDashboardCharts({
  stockByProduct,
  ratingByProduct,
  ratersByProvince,
}: SellerDashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 py-4">
      {/* Stock by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Sebaran Stok Produk</CardTitle>
          <CardDescription>Jumlah stok setiap produk</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rating by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Produk Anda</CardTitle>
          <CardDescription>Nilai rating untuk setiap produk</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#10b981" name="Rating" />
              <Bar dataKey="count" fill="#f59e0b" name="Jumlah Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Raters by Province */}
      <Card>
        <CardHeader>
          <CardTitle>Pemberi Rating Berdasarkan Lokasi</CardTitle>
          <CardDescription>Sebaran pemberi rating per provinsi</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratersByProvince}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ratersByProvince.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
