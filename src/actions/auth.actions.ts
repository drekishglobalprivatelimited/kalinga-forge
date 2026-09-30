"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import type { RegisterInput } from "@/lib/validations";

export async function registerUser(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return { success: true };
}

export async function loginWithCredentials(email: string, password: string, callbackUrl?: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/dashboard",
    });
    return { success: true };
  } catch (error) {
    const err = error as { type?: string };
    if (err?.type === "CredentialsSignin") {
      return { success: false, error: "Invalid email or password." };
    }
    // NEXT_REDIRECT is thrown on success — don't catch it
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
