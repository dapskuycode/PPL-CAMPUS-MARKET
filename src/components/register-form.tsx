"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface RegisterFormProps {
  role: string;
  // Common fields
  nama: string;
  noHP: string;
  email: string;
  password: string;
  confirmPassword: string;
  alamatJalan: string;
  rt: string;
  rw: string;
  namaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  // Seller fields
  noKtp: string;
  namaToko: string;
  deskripsiToko: string;
  fotoKtpFile: File | null;
  fileUploadKtp: File | null;
  // State
  loading: boolean;
  error: string;
  // Handlers
  onNamaChange: (value: string) => void;
  onNoHPChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onAlamatJalanChange: (value: string) => void;
  onRtChange: (value: string) => void;
  onRwChange: (value: string) => void;
  onNamaKelurahanChange: (value: string) => void;
  onKecamatanChange: (value: string) => void;
  onKabupatenKotaChange: (value: string) => void;
  onProvinsiChange: (value: string) => void;
  onNoKtpChange: (value: string) => void;
  onNamaTokoChange: (value: string) => void;
  onDeskripsiTokoChange: (value: string) => void;
  onFotoKtpChange: (file: File | null) => void;
  onFileUploadKtpChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onRoleChange: (role: string) => void;
}

export function RegisterForm({
  role,
  nama,
  noHP,
  email,
  password,
  confirmPassword,
  alamatJalan,
  rt,
  rw,
  namaKelurahan,
  kecamatan,
  kabupatenKota,
  provinsi,
  noKtp,
  namaToko,
  deskripsiToko,
  fotoKtpFile,
  fileUploadKtp,
  loading,
  error,
  onNamaChange,
  onNoHPChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAlamatJalanChange,
  onRtChange,
  onRwChange,
  onNamaKelurahanChange,
  onKecamatanChange,
  onKabupatenKotaChange,
  onProvinsiChange,
  onNoKtpChange,
  onNamaTokoChange,
  onDeskripsiTokoChange,
  onFotoKtpChange,
  onFileUploadKtpChange,
  onSubmit,
  onRoleChange,
}: RegisterFormProps) {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">Registrasi Akun</CardTitle>
        <CardDescription>Buat akun baru di Campus Market</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={role || "pembeli"} onValueChange={onRoleChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pembeli">Pembeli</TabsTrigger>
            <TabsTrigger value="penjual">Penjual</TabsTrigger>
          </TabsList>
        </Tabs>

        {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">{error}</div>}

        <form onSubmit={onSubmit}>
          <FieldGroup>
            {/* Informasi Akun */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Akun</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="nama">Nama Lengkap</FieldLabel>
                  <Input id="nama" value={nama} onChange={(e) => onNamaChange(e.target.value)} required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="noHP">No HP</FieldLabel>
                  <Input id="noHP" value={noHP} onChange={(e) => onNoHPChange(e.target.value)} required />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} required minLength={6} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} required minLength={6} />
                </Field>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-semibold">Alamat</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="provinsi">Provinsi</FieldLabel>
                  <Input id="provinsi" value={provinsi} onChange={(e) => onProvinsiChange(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="kabupaten">Kabupaten/Kota</FieldLabel>
                  <Input id="kabupaten" value={kabupatenKota} onChange={(e) => onKabupatenKotaChange(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="kecamatan">Kecamatan</FieldLabel>
                  <Input id="kecamatan" value={kecamatan} onChange={(e) => onKecamatanChange(e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field className="col-span-2">
                  <FieldLabel htmlFor="kelurahan">Kelurahan</FieldLabel>
                  <Input id="kelurahan" value={namaKelurahan} onChange={(e) => onNamaKelurahanChange(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="rt">RT</FieldLabel>
                  <Input id="rt" value={rt} onChange={(e) => onRtChange(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="rw">RW</FieldLabel>
                  <Input id="rw" value={rw} onChange={(e) => onRwChange(e.target.value)} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="alamatJalan">Alamat Jalan</FieldLabel>
                <Input id="alamatJalan" value={alamatJalan} onChange={(e) => onAlamatJalanChange(e.target.value)} required />
              </Field>
            </div>

            {/* Informasi Toko - Only for Seller */}
            {role === "penjual" && (
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-semibold">Informasi Toko</h3>

                <Field>
                  <FieldLabel htmlFor="namaToko">Nama Toko</FieldLabel>
                  <Input id="namaToko" value={namaToko} onChange={(e) => onNamaTokoChange(e.target.value)} placeholder="Contoh: Toko Kampus Jaya" required />
                </Field>

                <Field>
                  <FieldLabel htmlFor="deskripsiToko">Deskripsi Toko</FieldLabel>
                  <textarea
                    id="deskripsiToko"
                    value={deskripsiToko}
                    onChange={(e) => onDeskripsiTokoChange(e.target.value)}
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Deskripsi singkat tentang toko Anda..."
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="noKtp">No KTP</FieldLabel>
                  <Input id="noKtp" value={noKtp} onChange={(e) => onNoKtpChange(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fotoKtp">Foto KTP</FieldLabel>
                  <Input id="fotoKtp" type="file" accept="image/*" onChange={(e) => onFotoKtpChange(e.target.files?.[0] || null)} />
                  {fotoKtpFile && <p className="text-xs text-muted-foreground mt-1">File: {fotoKtpFile.name}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="fileUploadKtp">File Upload PIC</FieldLabel>
                  <Input id="fileUploadKtp" type="file" accept="image/*,.pdf" onChange={(e) => onFileUploadKtpChange(e.target.files?.[0] || null)} />
                  {fileUploadKtp && <p className="text-xs text-muted-foreground mt-1">File: {fileUploadKtp.name}</p>}
                </Field>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <Button type="submit" disabled={loading} size="lg">
                {loading ? "Mendaftar..." : "Daftar"}
              </Button>
              <div className="text-sm text-muted-foreground">
                Sudah punya akun?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
                {" | "}
                <Link href="/" className="underline">
                  Kembali
                </Link>
              </div>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
