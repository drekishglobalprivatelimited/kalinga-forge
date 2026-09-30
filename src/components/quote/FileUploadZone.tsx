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

  const isLoading = uploadState === "uploading" || uploadState === "analyzing";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...rootProps } = getRootProps();

  return (
    <div className="w-full">
      <motion.div
        {...rootProps}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive && !isDragReject
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : isDragReject
            ? "border-red-500 bg-red-500/10"
            : uploadState === "done"
            ? "border-green-500 bg-green-500/10"
            : uploadState === "error"
            ? "border-red-500/50 bg-red-500/5"
            : "border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5"
        }`}
        whileHover={!isLoading ? { scale: 1.005 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={isDragActive ? { scale: 1.2 } : { scale: 1 }}
                  className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
                >
                  <Upload className="h-9 w-9 text-blue-400" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? "Drop your file here" : "Upload Your 3D File"}
              </h3>
              <p className="text-white/50 mb-4">
                Drag & drop or click to browse
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["STL", "STEP", "OBJ", "3MF"].map((fmt) => (
                  <span key={fmt} className="text-xs font-medium bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60">
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/30 mt-4">Maximum file size: 100 MB</p>
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
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white font-medium">Uploading file...</p>
              <p className="text-white/40 text-sm mt-1">Sending to secure storage</p>
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
                className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full mb-4"
              />
              <p className="text-white font-medium">Analyzing geometry...</p>
              <p className="text-white/40 text-sm mt-1">Calculating dimensions & volume</p>
            </motion.div>
          )}

          {uploadState === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
              <p className="text-white font-medium">File analyzed!</p>
              <p className="text-white/40 text-sm mt-1">Redirecting to configurator...</p>
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
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-white font-medium">Upload failed</p>
              <p className="text-white/50 text-sm mt-1 mb-4">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadState("idle");
                  setError(null);
                }}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <X className="h-4 w-4" /> Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Supported formats info */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { ext: "STL", desc: "Most common", color: "text-blue-400" },
          { ext: "STEP", desc: "Engineering", color: "text-violet-400" },
          { ext: "OBJ", desc: "3D graphics", color: "text-cyan-400" },
          { ext: "3MF", desc: "Modern format", color: "text-green-400" },
        ].map((fmt) => (
          <div key={fmt.ext} className="glass rounded-xl p-3 text-center">
            <File className={`h-5 w-5 mx-auto mb-1 ${fmt.color}`} />
            <p className="text-xs font-bold text-white">.{fmt.ext.toLowerCase()}</p>
            <p className="text-[10px] text-white/40">{fmt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
