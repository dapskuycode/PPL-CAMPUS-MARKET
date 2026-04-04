"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams?.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    // Call verification API
    async function verifyEmail() {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email Anda berhasil diverifikasi!");
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Gagal memverifikasi email.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Terjadi kesalahan saat memverifikasi email.");
      }
    }

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
          <CardDescription>Proses verifikasi email Anda</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-center text-muted-foreground">Memverifikasi email Anda...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-5xl">✅</div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-green-600">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Anda akan diarahkan ke halaman login dalam beberapa detik...
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/login">Login Sekarang</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-5xl">❌</div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-destructive">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Link verifikasi mungkin sudah kadaluarsa. Silakan daftar ulang.
                </p>
              </div>
              <div className="space-y-2 w-full">
                <Button asChild className="w-full">
                  <Link href="/register">Daftar Ulang</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Kembali ke Login</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
