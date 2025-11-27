"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", penjualan: 1200000, views: 450 },
  { month: "Feb", penjualan: 1500000, views: 520 },
  { month: "Mar", penjualan: 1800000, views: 680 },
  { month: "Apr", penjualan: 2100000, views: 750 },
  { month: "May", penjualan: 2400000, views: 890 },
  { month: "Jun", penjualan: 2200000, views: 820 },
];

const chartConfig = {
  penjualan: {
    label: "Penjualan",
    color: "hsl(var(--chart-1))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SellerChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Penjualan</CardTitle>
        <CardDescription>Penjualan dan views produk dalam 6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Area dataKey="views" type="natural" fill="var(--color-views)" fillOpacity={0.4} stroke="var(--color-views)" stackId="b" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
