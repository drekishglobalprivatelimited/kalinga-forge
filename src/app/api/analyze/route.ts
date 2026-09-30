import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getFileStream } from "@/lib/s3";
import { analyzeSTL, estimateFromFileSize } from "@/lib/stl-analyzer";

export async function POST(req: NextRequest) {
  try {
    const { fileKey, fileName, fileSize } = await req.json();

    if (!fileKey) {
      return NextResponse.json({ error: "fileKey is required" }, { status: 400 });
    }

    const ext = (fileName ?? "").split(".").pop()?.toLowerCase() ?? "";

    // Only full parse STL files; estimate for others
    if (ext !== "stl") {
      const estimate = estimateFromFileSize(fileSize ?? 1024 * 1024);
      return NextResponse.json({
        ...estimate,
        estimatedOnly: true,
        message: `${ext.toUpperCase()} files: dimensions estimated from file size. Manual review may adjust.`,
      });
    }

    let buffer: Buffer;

    if (fileKey.startsWith("local:")) {
      const localPath = fileKey.replace("local:", "");
      const fullPath = path.join(process.cwd(), "public", "uploads", localPath);
      buffer = await readFile(fullPath);
    } else {
      const stream = await getFileStream(fileKey);
      if (!stream) {
        return NextResponse.json({ error: "Could not retrieve file from storage" }, { status: 500 });
      }
      const chunks: Buffer[] = [];
      // @ts-expect-error - stream is a ReadableStream from AWS SDK
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      buffer = Buffer.concat(chunks);
    }

    const analysis = analyzeSTL(buffer);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("STL analysis failed:", error);
    return NextResponse.json(
      { error: "File analysis failed. Please ensure it is a valid STL file." },
      { status: 500 }
    );
  }
}
