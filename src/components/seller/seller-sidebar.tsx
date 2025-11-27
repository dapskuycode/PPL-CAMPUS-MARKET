"use client";

import * as React from "react";
import { IconDashboard, IconShoppingBag, IconPlus, IconSettings, IconHelp, IconLogout, IconShoppingCart } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SellerSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: any;
}

export function SellerSidebar({ user, ...props }: SellerSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Produk Saya",
      url: "/dashboard",
      icon: IconShoppingBag,
    },
    {
      title: "Tambah Produk",
      url: "/dashboard/products/new",
      icon: IconPlus,
    },
    {
      title: "Pesanan",
      url: "/seller/orders",
      icon: IconShoppingCart,
    },
  ];

  const navSecondary = [
    {
      title: "Pengaturan",
      url: "/seller/settings",
      icon: IconSettings,
    },
    {
      title: "Bantuan",
      url: "/seller/help",
      icon: IconHelp,
    },
  ];

  const userData = {
    name: user?.nama || "Penjual",
    email: user?.email || "",
    avatar: user?.avatar || "/avatars/default.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/catalog">
                <IconShoppingBag className="!size-5" />
                <span className="text-base font-semibold">{user?.toko?.namaToko || "Campus Market"}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
