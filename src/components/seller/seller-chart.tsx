"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  penjualan: {
    label: "Penjualan (Rp)",
    color: "hsl(var(--chart-1))",
  },
  quantity: {
    label: "Jumlah Produk",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface SellerChartProps {
  sellerId?: number;
}

export function SellerChart({ sellerId }: SellerChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      fetchSalesData();
    }
  }, [sellerId]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/sales-chart?sellerId=${sellerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setChartData(data.chartData || []);
      }
    } catch (error) {
      console.error("Error fetching sales chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Penjualan</CardTitle>
        <CardDescription>Distribusi penjualan produk per bulan dalam 12 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Belum ada data penjualan</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="penjualan" type="natural" fill="var(--color-penjualan)" fillOpacity={0.4} stroke="var(--color-penjualan)" stackId="a" />
              <Area dataKey="quantity" type="natural" fill="var(--color-quantity)" fillOpacity={0.4} stroke="var(--color-quantity)" stackId="b" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
