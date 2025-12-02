"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is admin
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

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
        variant="inset"
        user={{
          name: user?.nama || "Admin",
          email: user?.email || "",
          avatar: "/avatars/admin.svg",
        }}
      />
      <SidebarInset>
        <AdminHeader userName={user?.nama || "Admin"} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Pengaturan Admin</h1>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Akun</CardTitle>
                  <CardDescription>Kelola informasi akun admin Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="font-medium">{user?.nama || "Admin"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email || ""}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">Admin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keamanan</CardTitle>
                  <CardDescription>Kelola keamanan akun Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">
                    Ubah Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sesi Anda</CardTitle>
                  <CardDescription>Kelola sesi login</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Keluar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
