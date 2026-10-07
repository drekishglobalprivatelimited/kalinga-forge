"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useQuoteStore } from "@/store/quoteStore";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/octet-stream": [".stl", ".step", ".stp", ".obj", ".3mf"],
  "model/stl": [".stl"],
  "model/obj": [".obj"],
};

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

export function FileUploadZone() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const { setUploadedFile, setAnalysis, setAnalyzing } = useQuoteStore();
  const router = useRouter();

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploadState("uploading");

      try {
        // 1. Check upload method (S3 or local fallback)
        const urlRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
          }),
        });

        if (!urlRes.ok) {
          const err = await urlRes.json();
          throw new Error(err.error ?? "Upload failed");
        }

        const uploadMeta = await urlRes.json();
        let key: string;
        let fileUrl: string;

        if (uploadMeta.useLocal) {
          // 2a. Local filesystem upload (dev mode, no S3 configured)
          const formData = new FormData();
          formData.append("file", file);
          const localRes = await fetch("/api/upload/local", { method: "POST", body: formData });
          if (!localRes.ok) {
            const err = await localRes.json();
            throw new Error(err.error ?? "Upload failed");
          }
          const local = await localRes.json();
          key = local.key;
          fileUrl = local.url;
        } else {
          // 2b. Direct S3 upload via presigned URL
          const uploadRes = await fetch(uploadMeta.uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type || "application/octet-stream" },
          });
          if (!uploadRes.ok) throw new Error("S3 upload failed");
          key = uploadMeta.key;
          fileUrl = uploadMeta.uploadUrl.split("?")[0];
        }

        setUploadedFile({
          fileKey: key,
          fileName: file.name,
          fileUrl,
          fileSize: file.size,
          fileType: file.name.split(".").pop()?.toLowerCase() ?? "stl",
        });

        // 3. Analyze the file
        setUploadState("analyzing");
        setAnalyzing(true);

        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey: key, fileName: file.name, fileSize: file.size }),
        });

        if (analyzeRes.ok) {
          const analysis = await analyzeRes.json();
          setAnalysis(analysis);
        }

        setAnalyzing(false);
        setUploadState("done");

        // Navigate to configurator after a short delay
        setTimeout(() => router.push("/quote/estimate"), 800);
      } catch (err) {
        setUploadState("error");
        setAnalyzing(false);
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        toast(msg, { type: "error" } as Parameters<typeof toast>[1]);
      }
    },
    [router, setUploadedFile, setAnalysis, setAnalyzing]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    onDropAccepted: ([file]) => processFile(file),
    onDropRejected: ([rejection]) => {
      const msg =
        rejection.errors[0]?.code === "file-too-large"
          ? "File is too large. Maximum 100MB."
          : "Unsupported format. Use STL, STEP, OBJ, or 3MF.";
      setError(msg);
      toast(msg, { type: "error" } as Parameters<typeof toast>[1]);
    },
    disabled: uploadState === "uploading" || uploadState === "analyzing",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...rootProps } = getRootProps();

  return (
    <div className="w-full">
      <motion.div
        {...rootProps}
        className={`relative border border-dashed px-6 py-14 sm:py-20 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive && !isDragReject
            ? "border-ink bg-canvas"
            : isDragReject
            ? "border-red-600 bg-red-50"
            : uploadState === "done"
            ? "border-green-700 bg-green-50"
            : uploadState === "error"
            ? "border-red-600/60 bg-red-50/60"
            : "border-ink/30 bg-canvas/60 hover:border-ink hover:bg-canvas"
        }`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-white border border-line"
              >
                <Upload className="h-7 w-7 text-ink" strokeWidth={1.25} />
              </motion.div>
              <h3 className="text-xl font-semibold tracking-tight text-ink mb-2">
                {isDragActive ? "Drop your file here" : "Upload your 3D file"}
              </h3>
              <p className="text-sm text-muted-ink mb-6">
                Drag &amp; drop, or <span className="text-ink underline underline-offset-4">browse</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["STL", "STEP", "OBJ", "3MF"].map((fmt) => (
                  <span key={fmt} className="text-[11px] font-medium tracking-wide bg-white border border-line px-3 py-1 text-ink/70">
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-ink mt-5">Maximum file size: 100 MB</p>
            </motion.div>
          )}

          {uploadState === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="h-10 w-10 text-ink animate-spin mb-4" strokeWidth={1.5} />
              <p className="font-medium text-ink">Uploading file…</p>
              <p className="text-sm text-muted-ink mt-1">Sending to secure storage</p>
            </motion.div>
          )}

          {uploadState === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-line border-t-ink rounded-full mb-4"
              />
              <p className="font-medium text-ink">Analysing geometry…</p>
              <p className="text-sm text-muted-ink mt-1">Calculating dimensions &amp; volume</p>
            </motion.div>
          )}

          {uploadState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <CheckCircle className="h-10 w-10 text-green-700 mb-4" strokeWidth={1.5} />
              <p className="font-medium text-ink">File analysed</p>
              <p className="text-sm text-muted-ink mt-1">Taking you to the configurator…</p>
            </motion.div>
          )}

          {uploadState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <AlertCircle className="h-10 w-10 text-red-600 mb-4" strokeWidth={1.5} />
              <p className="font-medium text-ink">Upload failed</p>
              <p className="text-sm text-muted-ink mt-1 mb-4">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadState("idle");
                  setError(null);
                }}
                className="flex items-center gap-2 text-sm text-ink underline underline-offset-4"
              >
                <X className="h-4 w-4" /> Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Supported formats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
        {[
          { ext: "STL", desc: "Most common" },
          { ext: "STEP", desc: "Engineering" },
          { ext: "OBJ", desc: "3D graphics" },
          { ext: "3MF", desc: "Modern format" },
        ].map((fmt) => (
          <div key={fmt.ext} className="bg-white p-3 text-center">
            <File className="h-4 w-4 mx-auto mb-1 text-ink" strokeWidth={1.25} />
            <p className="text-xs font-semibold text-ink">.{fmt.ext.toLowerCase()}</p>
            <p className="text-[10px] text-muted-ink">{fmt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
