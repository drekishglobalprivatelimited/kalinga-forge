import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 100 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 100MB." }, { status: 400 });
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const subDir = String(timestamp);
    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, sanitizedName), buffer);

    const key = `local:${subDir}/${sanitizedName}`;
    const url = `/uploads/${subDir}/${sanitizedName}`;

    return NextResponse.json({ key, url });
  } catch (error) {
    console.error("Local upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
