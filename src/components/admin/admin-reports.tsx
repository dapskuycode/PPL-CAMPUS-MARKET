import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportDownload } from "@/hooks/use-report-download";

export function AdminReports() {
  const { downloadReportAsPDF } = useReportDownload();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan & Unduh Data</CardTitle>
        <CardDescription>Unduh laporan dalam format PDF</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Laporan Penjual</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => downloadReportAsPDF("/api/admin/report/sellers", "laporan_penjual.html")}
            >
              📄 Daftar Penjual
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Laporan Toko</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                downloadReportAsPDF("/api/admin/report/shops-by-province", "laporan_toko_per_provinsi.html")
              }
            >
              📄 Toko Per Provinsi
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Laporan Produk</h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                downloadReportAsPDF("/api/admin/report/products-rating", "laporan_produk_rating.html")
              }
            >
              📄 Produk & Rating
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
