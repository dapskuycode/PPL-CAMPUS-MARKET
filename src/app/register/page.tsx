"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState((searchParams?.get("role") ?? "user").toLowerCase());

  // Common fields
  const [nama, setNama] = useState("");
  const [noHP, setNoHP] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alamatJalan, setAlamatJalan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [kabupatenKota, setKabupatenKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  // Penjual-only fields
  const [noKtp, setNoKtp] = useState("");
  const [namaToko, setNamaToko] = useState("");
  const [deskripsiToko, setDeskripsiToko] = useState("");
  const [fotoKtpFile, setFotoKtpFile] = useState<File | null>(null);
  const [fileUploadKtp, setFileUploadKtp] = useState<File | null>(null);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("nama", nama);
    formData.append("noHP", noHP);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("alamatJalan", alamatJalan);
    formData.append("rt", rt);
    formData.append("rw", rw);
    formData.append("namaKelurahan", namaKelurahan);
    formData.append("kabupatenKota", kabupatenKota);
    formData.append("provinsi", provinsi);

    if (role === "penjual") {
      formData.append("noKtp", noKtp);
      formData.append("namaToko", namaToko);
      formData.append("deskripsiToko", deskripsiToko);

      if (fotoKtpFile) {
        formData.append("fotoKtp", fotoKtpFile);
      }
      if (fileUploadKtp) {
        formData.append("fileUploadKtp", fileUploadKtp);
      }
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      console.log("Registrasi berhasil:", data);
      router.push("/login?registered=true");
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <RegisterForm
        role={role}
        nama={nama}
        noHP={noHP}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        alamatJalan={alamatJalan}
        rt={rt}
        rw={rw}
        namaKelurahan={namaKelurahan}
        kabupatenKota={kabupatenKota}
        provinsi={provinsi}
        noKtp={noKtp}
        namaToko={namaToko}
        deskripsiToko={deskripsiToko}
        fotoKtpFile={fotoKtpFile}
        fileUploadKtp={fileUploadKtp}
        loading={loading}
        error={error}
        onNamaChange={setNama}
        onNoHPChange={setNoHP}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onAlamatJalanChange={setAlamatJalan}
        onRtChange={setRt}
        onRwChange={setRw}
        onNamaKelurahanChange={setNamaKelurahan}
        onKabupatenKotaChange={setKabupatenKota}
        onProvinsiChange={setProvinsi}
        onNoKtpChange={setNoKtp}
        onNamaTokoChange={setNamaToko}
        onDeskripsiTokoChange={setDeskripsiToko}
        onFotoKtpChange={setFotoKtpFile}
        onFileUploadKtpChange={setFileUploadKtp}
        onSubmit={handleSubmit}
        onRoleChange={setRole}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
