import { POST, DELETE } from "@/app/api/admin/categories/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Category API Unit Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/admin/categories", () => {
    test("Memvalidasi fungsionalitas penambahan kategori jika input kosong", async () => {
      const request = {
        json: async () => ({
          namaKategori: "",
        }),
      } as any;

      const response = await POST(request);

      expect(response.status).toBe(400);

      const body = await response.json();

      expect(body).toEqual({
        error: "Nama kategori tidak boleh kosong",
      });
    });
  });

  describe("DELETE /api/category", () => {
    test("Memastikan kategori tidak dapat dihapus jika jumlah produk > 0", async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue({
        idCategory: 1,
        namaKategori: "Elektronik",
        _count: {
          product: 5,
        },
      });

      const request = {
        url: "http://localhost:3000/api/admin/categories?idCategory=1",
      } as any;

      const response = await DELETE(request);
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe(
        "Tidak dapat menghapus kategori karena masih memiliki 5 produk",
      );
    });
  });
});
