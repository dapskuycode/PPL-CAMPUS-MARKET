"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, LogOut } from "lucide-react";

interface CatalogHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export function CatalogHeader({ userName, userRole, onLogout }: CatalogHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Campus Market</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Halo, <strong>{userName}</strong>
            <span className="ml-1 text-xs">({userRole})</span>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
