"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/actions/contact.actions";
import { toast } from "@/components/ui/toast";
import { fieldClass, labelClass, primaryButtonClass, textareaClass } from "@/components/storefront/fields";
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2, ArrowRight } from "lucide-react";

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: "Call us",
    value: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210",
    href: `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`,
  },
  { icon: Mail, label: "Email", value: "hello@kalingaforge.in", href: "mailto:hello@kalingaforge.in" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
  },
  { icon: MapPin, label: "Studio", value: "Bangalore, Karnataka, India" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9am–8pm IST" },
];

const TOPICS = ["Order help", "Custom 3D print", "Bulk / corporate", "Something else"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const message = form.message ? `[${topic}] ${form.message}` : `[${topic}]`;
    const result = await submitContactForm({ ...form, message, source: "contact-form" });
    setSubmitting(false);
    if (result.success) {
      setDone(true);
      toast("Message sent! We'll reply within 24 hours.", { type: "success" } as Parameters<typeof toast>[1]);
    } else {
      toast(result.error ?? "Failed to send", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="bg-canvas">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <nav className="text-xs text-muted-ink mb-3">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">Contact</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Get in touch</h1>
          <p className="text-sm text-muted-ink mt-2 max-w-xl">
            Questions about an order, a custom print or bulk pricing? Drop us a line — we reply within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
        {/* Contact details */}
        <aside>
          <ul className="divide-y divide-line border-y border-line">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4 py-5">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.25} />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-ink">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm hover:underline underline-offset-2"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <Link href="/quote" className="group mt-8 flex items-center justify-between gap-4 bg-ink text-white p-6">
            <div>
              <p className="font-medium mb-1">Have a 3D file ready?</p>
              <p className="text-sm text-white/70">Skip the form — upload it for an instant estimate.</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </aside>

        {/* Form */}
        <section>
          {done ? (
            <div className="border border-line p-10 sm:p-14 text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-5" strokeWidth={1} />
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Message received</h2>
              <p className="text-sm text-muted-ink mb-8">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <Link href="/shop" className="inline-block px-8 py-3.5 bg-ink text-white text-sm font-medium hover:bg-black">
                Continue shopping
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-1">Send us a message</h2>
                <p className="text-sm text-muted-ink">Fields marked * are required.</p>
              </div>

              <fieldset>
                <legend className={`${labelClass} mb-3`}>What&apos;s it about?</legend>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`px-4 py-2 text-[13px] border transition-colors ${
                        topic === t ? "bg-ink border-ink text-white" : "border-line text-ink hover:border-ink"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="name" className={labelClass}>Name *</Label>
                <Input id="name" className={fieldClass} placeholder="Your full name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className={labelClass}>Email</Label>
                  <Input id="email" type="email" className={fieldClass} placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className={labelClass}>Phone *</Label>
                  <Input id="phone" type="tel" className={fieldClass} placeholder="Mobile number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className={labelClass}>Message</Label>
                <Textarea id="message" className={textareaClass} placeholder="Tell us what you need…" value={form.message} onChange={(e) => update("message", e.target.value)} rows={6} />
              </div>
              <button type="submit" className={primaryButtonClass} disabled={submitting}>
                {submitting ? "SENDING…" : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}
