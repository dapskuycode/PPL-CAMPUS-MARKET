"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface RatingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

export function RatingFormModal({
  isOpen,
  onClose,
  productId,
  productName,
}: RatingFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [email, setEmail] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);

  // Get user data from localStorage when modal opens
  useState(() => {
    if (isOpen) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setNama(user.nama || "");
          setNoHp(user.noHP || "");
          setEmail(user.email || "");
          setProvinsi(user.provinsi || "");
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!nama.trim()) {
      toast.error("Nama harus diisi");
      return;
    }
    if (!noHp.trim()) {
      toast.error("Nomor HP harus diisi");
      return;
    }
    if (!email.trim()) {
      toast.error("Email harus diisi");
      return;
    }
    if (!provinsi.trim()) {
      toast.error("Provinsi harus diisi");
      return;
    }
    if (rating === 0) {
      toast.error("Silakan pilih rating");
      return;
    }
    if (!komentar.trim()) {
      toast.error("Komentar harus diisi");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idProduct: productId,
          namaPengunjung: nama,
          noHP: noHp,
          email: email,
          provinsi: provinsi,
          nilai: rating,
          komentar: komentar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim rating");
      }

      // Success notification
      toast.success("Terima kasih atas rating dan komentar Anda! 🙏", {
        description:
          "Rating Anda telah disimpan dan akan membantu pengunjung lain.",
      });

      // Reset form
      setRating(0);
      setNama("");
      setNoHp("");
      setEmail("");
      setProvinsi("");
      setKomentar("");

      // Close modal
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Berikan Rating dan Komentar</DialogTitle>
          <DialogDescription>
            Produk: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap *</Label>
            <Input
              id="nama"
              placeholder="Masukkan nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              readOnly
              className="bg-muted"
            />
          </div>

          {/* No HP */}
          <div className="space-y-2">
            <Label htmlFor="noHp">Nomor HP *</Label>
            <Input
              id="noHp"
              placeholder="Contoh: 08123456789"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              required
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Contoh: nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Provinsi */}
          <div className="space-y-2">
            <Label htmlFor="provinsi">Provinsi *</Label>
            <Input
              id="provinsi"
              placeholder="Contoh: Jawa Tengah"
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              required
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Rating Stars */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                Rating Anda: <strong>{rating} bintang</strong>
              </p>
            )}
          </div>

          {/* Komentar */}
          <div className="space-y-2">
            <Label htmlFor="komentar">Komentar *</Label>
            <Textarea
              id="komentar"
              placeholder="Tuliskan pengalaman dan kesan Anda tentang produk ini..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
