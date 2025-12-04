import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export interface AuthUser {
  idUser: number;
  email: string;
  role: string;
  nama: string;
}

/**
 * Get authenticated user from request
 * Expects user data in X-User-Data header (JSON string from localStorage)
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const userDataHeader = request.headers.get("x-user-data");
    
    if (!userDataHeader) {
      return null;
    }

    const userData = JSON.parse(userDataHeader);
    
    if (!userData.idUser || !userData.email) {
      return null;
    }

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { 
        idUser: parseInt(userData.idUser),
        email: userData.email,
      },
      select: {
        idUser: true,
        email: true,
        role: true,
        nama: true,
        statusAkun: true,
      },
    });

    if (!user || user.statusAkun !== "aktif") {
      return null;
    }

    return {
      idUser: user.idUser,
      email: user.email,
      role: user.role,
      nama: user.nama,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return Response.json(
      { error: "Unauthorized - Login required" },
      { status: 401 }
    );
  }
  
  if (user.role !== "admin") {
    return Response.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }
  
  return user;
}

/**
 * Require seller role
 */
export async function requireSeller(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return Response.json(
      { error: "Unauthorized - Login required" },
      { status: 401 }
    );
  }
  
  if (user.role !== "penjual") {
    return Response.json(
      { error: "Forbidden - Seller access required" },
      { status: 403 }
    );
  }
  
  return user;
}

/**
 * Require authenticated user (any role)
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return Response.json(
      { error: "Unauthorized - Login required" },
      { status: 401 }
    );
  }
  
  return user;
}
