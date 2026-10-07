"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, loginWithCredentials } from "@/actions/auth.actions";
import { toast } from "@/components/ui/toast";

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
    <div className="glass rounded-3xl p-8 border border-white/10">
      <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-white/50 text-sm mb-8">Join Kalinga Forge to track your quotes and orders</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Mobile Number</Label>
          <Input id="phone" type="tel" placeholder="10-digit Indian number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        </div>

        <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-white/30">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link> and{" "}
        <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
      </p>

      <div className="mt-6 text-center">
        <p className="text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
