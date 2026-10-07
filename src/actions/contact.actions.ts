"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import type { ContactInput } from "@/lib/validations";
import { getResend } from "@/lib/email";

export async function submitContactForm(data: ContactInput) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await prisma.leadContact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: data.source ?? "contact-form",
      },
    });

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kalingaforge.in";
    await getResend().emails.send({
      from: `Kalinga Forge <${process.env.EMAIL_FROM ?? "noreply@kalingaforge.in"}>`,
      to: adminEmail,
      subject: `[NEW LEAD] ${data.name} — ${data.source}`,
      html: `
        <h2>New Lead</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email ?? "Not provided"}</p>
        <p><strong>Source:</strong> ${data.source}</p>
        <p><strong>Message:</strong> ${data.message ?? "No message"}</p>
      `,
    }).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}
