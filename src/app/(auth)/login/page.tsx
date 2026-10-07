"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithCredentials } from "@/actions/auth.actions";
import { toast } from "@/components/ui/toast";
import { Eye, EyeOff } from "lucide-react";
import { fieldClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/storefront/fields";

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
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">Welcome back</h1>
      <p className="text-sm text-muted-ink mb-8">Sign in to your Kalinga Forge account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={labelClass}>
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs text-muted-ink hover:text-ink underline underline-offset-2">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={`${fieldClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-ink hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" className={primaryButtonClass} disabled={loading}>
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.15em] text-muted-ink">
        <span className="h-px flex-1 bg-line" />
        New here?
        <span className="h-px flex-1 bg-line" />
      </div>

      <Link href="/register" className={secondaryButtonClass}>
        CREATE AN ACCOUNT
      </Link>

      <p className="mt-8 text-center text-sm text-muted-ink">
        Just want a price?{" "}
        <Link href="/quote" className="text-ink underline underline-offset-4">
          Get a quote without an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96 bg-canvas animate-pulse" />}>
      <LoginForm />
    </Suspense>
  );
}
