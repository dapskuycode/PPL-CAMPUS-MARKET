import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  successMessage: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ className, email, password, loading, error, successMessage, onEmailChange, onPasswordChange, onSubmit, ...props }: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang</h1>
                <p className="text-muted-foreground text-balance">Login ke akun Campus Market Anda</p>
              </div>

              {successMessage && (
                <div className="rounded-md bg-green-50 border border-green-200 p-3">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} required />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Belum punya akun?{" "}
                <Link href="/register" className="underline">
                  Daftar
                </Link>
                {" | "}
                <Link href="/" className="underline">
                  Kembali
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-neutral-700 relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Campus Market</h2>
                <p className="text-muted-foreground">Platform jual beli untuk komunitas kampus</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
