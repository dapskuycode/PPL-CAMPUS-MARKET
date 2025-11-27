"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { ProductForm } from "@/components/seller/product-form";

export default function NewProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "penjual") {
      router.push("/catalog");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleSuccess = () => {
    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SellerSidebar user={user} />
        <div className="flex flex-1 flex-col">
          <SellerHeader user={user} />
          <main className="flex-1 p-6">
            <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
