"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconCheck, IconX } from "@tabler/icons-react";

interface Seller {
  idUser: number;
  nama: string;
  email: string;
  noHP: string;
  noKtp: string | null;
  kabupatenKota: string;
  provinsi: string;
  statusVerifikasi: string;
  statusAkun: string;
  tanggalDaftar: string;
  tanggalVerifikasi: string | null;
  toko: {
    namaToko: string;
  } | null;
}

interface User {
  nama: string;
  email: string;
  role: string;
  idUser: number;
}

export default function AdminSellersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"verify" | "status" | "">("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      router.push("/catalog");
      return;
    }

    setUser(parsedUser);
    fetchSellers();
  }, [router]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/sellers");
      const data = await response.json();

      if (response.ok) {
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (seller: Seller, action: "verify" | "reject") => {
    setSelectedSeller(seller);
    setActionType("verify");
    setNewStatus(action === "verify" ? "verified" : "rejected");
    setDialogOpen(true);
  };

  const handleStatusClick = (seller: Seller, newStatusAkun: string) => {
    setSelectedSeller(seller);
    setActionType("status");
    setNewStatus(newStatusAkun);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedSeller) return;

    try {
      const updateData =
        actionType === "verify"
          ? { idUser: selectedSeller.idUser, statusVerifikasi: newStatus }
          : { idUser: selectedSeller.idUser, statusAkun: newStatus };

      const response = await fetch("/api/admin/sellers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Berhasil memperbarui status penjual");
        fetchSellers();
      } else {
        alert(data.error || "Gagal memperbarui status penjual");
      }
    } catch (error) {
      console.error("Error updating seller:", error);
      alert("Terjadi kesalahan saat memperbarui status");
    } finally {
      setDialogOpen(false);
      setSelectedSeller(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const pendingSellers = sellers.filter(
    (s) => s.statusVerifikasi === "pending"
  );
  const verifiedSellers = sellers.filter(
    (s) => s.statusVerifikasi === "verified"
  );
  const rejectedSellers = sellers.filter(
    (s) => s.statusVerifikasi === "rejected"
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar
        user={{
          name: user.nama,
          email: user.email,
          avatar: "/avatars/admin.png",
        }}
        variant="inset"
      />
      <SidebarInset>
        <AdminHeader userName={user.nama} />
        <div className="flex flex-1 flex-col p-4 lg:p-6 gap-6">
          {/* Pending Sellers */}
          <Card>
            <CardHeader>
              <CardTitle>Verifikasi Penjual Baru</CardTitle>
              <CardDescription>
                Daftar penjual yang menunggu verifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSellers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Tidak ada penjual yang menunggu verifikasi
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Toko</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Tanggal Daftar</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingSellers.map((seller) => (
                        <TableRow key={seller.idUser}>
                          <TableCell className="font-medium">
                            {seller.nama}
                          </TableCell>
                          <TableCell>{seller.toko?.namaToko || "-"}</TableCell>
                          <TableCell>{seller.email}</TableCell>
                          <TableCell>{seller.noHP}</TableCell>
                          <TableCell>
                            {seller.kabupatenKota}, {seller.provinsi}
                          </TableCell>
                          <TableCell>
                            {new Date(seller.tanggalDaftar).toLocaleDateString(
                              "id-ID"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  handleVerifyClick(seller, "verify")
                                }
                              >
                                <IconCheck className="h-4 w-4 mr-1" />
                                Verifikasi
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleVerifyClick(seller, "reject")
                                }
                              >
                                <IconX className="h-4 w-4 mr-1" />
                                Tolak
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verified Sellers */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Penjual Terverifikasi</CardTitle>
              <CardDescription>
                Kelola status akun penjual yang sudah terverifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verifiedSellers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Belum ada penjual terverifikasi
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Toko</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status Akun</TableHead>
                        <TableHead>Verifikasi</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifiedSellers.map((seller) => (
                        <TableRow key={seller.idUser}>
                          <TableCell className="font-medium">
                            {seller.nama}
                          </TableCell>
                          <TableCell>{seller.toko?.namaToko || "-"}</TableCell>
                          <TableCell>{seller.email}</TableCell>
                          <TableCell>
                            {seller.kabupatenKota}, {seller.provinsi}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                seller.statusAkun === "aktif"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {seller.statusAkun}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {seller.tanggalVerifikasi
                              ? new Date(
                                  seller.tanggalVerifikasi
                                ).toLocaleDateString("id-ID")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={seller.statusAkun}
                              onValueChange={(value) =>
                                handleStatusClick(seller, value)
                              }
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="nonaktif">
                                  Non-aktif
                                </SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rejected Sellers */}
          {rejectedSellers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Penjual Ditolak</CardTitle>
                <CardDescription>
                  Daftar penjual yang verifikasinya ditolak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Tanggal Daftar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedSellers.map((seller) => (
                        <TableRow key={seller.idUser}>
                          <TableCell className="font-medium">
                            {seller.nama}
                          </TableCell>
                          <TableCell>{seller.email}</TableCell>
                          <TableCell>{seller.noHP}</TableCell>
                          <TableCell>
                            {new Date(seller.tanggalDaftar).toLocaleDateString(
                              "id-ID"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Aksi</DialogTitle>
            <DialogDescription>
              {actionType === "verify" && newStatus === "verified" && (
                <>
                  Apakah Anda yakin ingin memverifikasi penjual{" "}
                  <strong>{selectedSeller?.nama}</strong>?
                </>
              )}
              {actionType === "verify" && newStatus === "rejected" && (
                <>
                  Apakah Anda yakin ingin menolak verifikasi penjual{" "}
                  <strong>{selectedSeller?.nama}</strong>?
                </>
              )}
              {actionType === "status" && (
                <>
                  Apakah Anda yakin ingin mengubah status akun{" "}
                  <strong>{selectedSeller?.nama}</strong> menjadi{" "}
                  <strong>{newStatus}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleConfirmAction}>Konfirmasi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
