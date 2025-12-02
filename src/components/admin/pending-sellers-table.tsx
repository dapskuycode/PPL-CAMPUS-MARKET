"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Seller {
  idUser: number;
  nama: string;
  email: string;
  noHP: string;
  noKtp: string | null;
  fotoKtp: string | null;
  fileUploadPIC: string | null;
  statusVerifikasi: string | null;
  tanggalDaftar: string | null;
  toko: {
    namaToko: string;
    deskripsiSingkat: string | null;
  } | null;
}

interface PendingSellersTableProps {
  sellers: Seller[];
  onVerify: (idUser: number) => void | Promise<void>;
}

export function PendingSellersTable({ sellers, onVerify }: PendingSellersTableProps) {
  if (sellers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifikasi Penjual</CardTitle>
          <CardDescription>Kelola verifikasi penjual yang mendaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Tidak ada penjual yang menunggu verifikasi.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi Penjual</CardTitle>
        <CardDescription>{sellers.length} penjual menunggu verifikasi</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Nama Toko</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Dokumen</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.idUser}>
                <TableCell className="font-medium">{seller.nama}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.noHP}</TableCell>
                <TableCell>{seller.toko?.namaToko || "-"}</TableCell>
                <TableCell>{seller.tanggalDaftar ? new Date(seller.tanggalDaftar).toLocaleDateString("id-ID") : "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {seller.fotoKtp && (
                      <a href={seller.fotoKtp} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Foto KTP
                      </a>
                    )}
                    {seller.fileUploadPIC && (
                      <a href={seller.fileUploadPIC} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        File PIC
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="default" onClick={() => onVerify(seller.idUser)}>
                      Verifikasi
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
