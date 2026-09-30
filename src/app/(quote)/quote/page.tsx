import type { Metadata } from "next";
import { FileUploadZone } from "@/components/quote/FileUploadZone";
import { Shield, Zap, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Instant 3D Printing Quote — Upload Your File",
  description:
    "Upload your STL, STEP, OBJ, or 3MF file and get an instant 3D printing quote. Configure material, finish, and quantity for accurate pricing.",
};

const TRUST_ITEMS = [
  { icon: <Zap className="h-4 w-4 text-blue-400" />, text: "Instant price estimate" },
  { icon: <Lock className="h-4 w-4 text-green-400" />, text: "Files encrypted & private" },
  { icon: <Shield className="h-4 w-4 text-violet-400" />, text: "No commitment required" },
];

export default function QuotePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm text-white/60">Step 1 of 3</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Upload Your <span className="gradient-text">3D File</span>
        </h1>
        <p className="text-white/50 max-w-md mx-auto">
          We&apos;ll analyze your file instantly and take you to the pricing configurator.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 justify-center">
        {["Upload", "Configure", "Submit"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
              i === 0 ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i === 0 ? "text-white" : "text-white/40"}`}>{step}</span>
            {i < 2 && <div className="w-8 h-px bg-white/15" />}
          </div>
        ))}
      </div>

      <FileUploadZone />

      {/* Trust badges */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {TRUST_ITEMS.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm text-white/50">
            {item.icon}
            {item.text}
          </div>
        ))}
      </div>

      {/* Supported formats clarification */}
      <div className="mt-8 glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-3">Tips for best results:</p>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">→</span>
            <span>Export from Fusion 360, SolidWorks, or Blender as STL or STEP</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">→</span>
            <span>Ensure the model is manifold (watertight) for best print quality</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">→</span>
            <span>Don&apos;t have a file? Contact us for CAD design services</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
