import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";

const ALLOWED_TYPES: Record<string, string> = {
  stl: "application/octet-stream",
  obj: "application/octet-stream",
  "3mf": "application/octet-stream",
  step: "application/octet-stream",
  stp: "application/octet-stream",
};

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, fileSize } = await req.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 100MB." }, { status: 400 });
    }

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_TYPES[ext]) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload STL, STEP, OBJ, or 3MF." },
        { status: 400 }
      );
    }

    // Fall back to local storage when S3 credentials are not configured
    const hasS3 = !!(process.env.AWS_ACCESS_KEY_ID?.trim() && process.env.AWS_SECRET_ACCESS_KEY?.trim());
    if (!hasS3) {
      return NextResponse.json({ useLocal: true });
    }

    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${timestamp}/${sanitizedName}`;

    const uploadUrl = await getPresignedUploadUrl(key, ALLOWED_TYPES[ext]);

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error("Upload URL generation failed:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
