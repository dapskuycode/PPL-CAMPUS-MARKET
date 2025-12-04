import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { requireAuth } from "@/lib/auth";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  // Require authentication (seller or buyer can upload)
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: "Maximum 5 files allowed" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "fotoBarang");

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} not allowed. Only JPEG, PNG, and WebP are accepted.` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 5MB` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with sanitized original name
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${uniqueSuffix}-${sanitizedName}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedFiles.push(filename);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
  }
}
