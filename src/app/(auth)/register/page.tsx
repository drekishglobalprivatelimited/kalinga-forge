"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, loginWithCredentials } from "@/actions/auth.actions";
import { toast } from "@/components/ui/toast";
import { fieldClass, labelClass, primaryButtonClass } from "@/components/storefront/fields";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await registerUser(form);

    if (!result.success) {
      toast(result.error ?? "Registration failed", { type: "error" } as Parameters<typeof toast>[1]);
      setLoading(false);
      return;
    }

    // Auto-login after registration
    try {
      await loginWithCredentials(form.email, form.password, "/dashboard");
    } catch {
      router.push("/login");
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">Create your account</h1>
      <p className="text-sm text-muted-ink mb-8">Track your orders, quotes and invoices with Kalinga Forge.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelClass}>
            Full name
          </Label>
          <Input
            id="name"
            className={fieldClass}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className={fieldClass}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className={labelClass}>
            Mobile number
          </Label>
          <Input
            id="phone"
            type="tel"
            className={fieldClass}
            placeholder="10-digit Indian number"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={labelClass}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            className={fieldClass}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className={primaryButtonClass} disabled={loading}>
          {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-ink">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-8 pt-6 border-t border-line text-center text-sm text-muted-ink">
        Already have an account?{" "}
        <Link href="/login" className="text-ink font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
