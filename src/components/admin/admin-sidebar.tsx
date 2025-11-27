"use client";

import * as React from "react";
import { IconDashboard, IconUsers, IconShoppingBag, IconSettings } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const router = useRouter();

  const navMain = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Verifikasi Penjual",
      url: "/admin",
      icon: IconUsers,
    },
    {
      title: "Kelola Produk",
      url: "/admin/products",
      icon: IconShoppingBag,
    },
  ];

  const navSecondary = [
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: IconSettings,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/admin">
                <IconShoppingBag className="!size-5" />
                <span className="text-base font-semibold">Campus Market</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <div className="mt-auto">
          <NavMain items={navSecondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
