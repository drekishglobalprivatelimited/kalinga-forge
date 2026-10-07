"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithCredentials } from "@/actions/auth.actions";
import { toast } from "@/components/ui/toast";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginWithCredentials(email, password, callbackUrl);
      if (!result?.success) {
        toast(result?.error ?? "Invalid credentials", { type: "error" } as Parameters<typeof toast>[1]);
      }
    } catch {
      // NEXT_REDIRECT throws — this is expected on success
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-3xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-white/50 text-sm mb-8">Sign in to your Kalinga Forge account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline font-medium">
            Create one free
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <Link href="/quote" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          Continue without account →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="glass rounded-3xl p-8 h-96 skeleton" />}>
      <LoginForm />
    </Suspense>
  );
}
