import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportDownload } from "@/hooks/use-report-download";

interface SellerReportsProps {
  sellerId: number;
}

export function SellerReports({ sellerId }: SellerReportsProps) {
  const { downloadReportAsPDF } = useReportDownload();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan & Unduh Data</CardTitle>
        <CardDescription>Unduh laporan produk Anda dalam format PDF</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Stok Produk</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                downloadReportAsPDF(
                  `/api/seller/report/stock?sellerId=${sellerId}`,
                  "laporan_stok.html"
                )
              }
            >
              📄 Laporan Stok
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Rating Produk</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                downloadReportAsPDF(
                  `/api/seller/report/rating?sellerId=${sellerId}`,
                  "laporan_rating.html"
                )
              }
            >
              📄 Laporan Rating
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Stok Kritis</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                downloadReportAsPDF(
                  `/api/seller/report/low-stock?sellerId=${sellerId}`,
                  "laporan_stok_rendah.html"
                )
              }
            >
              📄 Stok Rendah
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
