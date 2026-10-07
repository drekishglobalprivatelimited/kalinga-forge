"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/actions/contact.actions";
import { toast } from "@/components/ui/toast";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitContactForm({ ...form, source: "contact-form" });
    setSubmitting(false);
    if (result.success) {
      setDone(true);
      toast("Message sent! We'll reply within 24 hours.", { type: "success" } as Parameters<typeof toast>[1]);
    } else {
      toast(result.error ?? "Failed to send", { type: "error" } as Parameters<typeof toast>[1]);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <ScrollReveal className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-white/50 max-w-xl mx-auto">
          Have a project in mind? Want to discuss your requirements? Our team is ready to help.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <ScrollReveal direction="left">
          <div className="space-y-6">
            {[
              { icon: <Phone className="h-5 w-5" />, label: "Phone", value: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+91 98765 43210", href: `tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE}` },
              { icon: <Mail className="h-5 w-5" />, label: "Email", value: "hello@kalingaforge.in", href: "mailto:hello@kalingaforge.in" },
              { icon: <MessageCircle className="h-5 w-5 text-green-400" />, label: "WhatsApp", value: "Chat on WhatsApp", href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` },
              { icon: <MapPin className="h-5 w-5" />, label: "Location", value: "Bangalore, Karnataka, India", href: undefined },
              { icon: <Clock className="h-5 w-5" />, label: "Business Hours", value: "Mon–Sat, 9am–8pm IST", href: undefined },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-white hover:text-blue-400 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="glass rounded-2xl p-6 mt-6">
              <p className="font-semibold text-white mb-2">Need a quick quote?</p>
              <p className="text-sm text-white/50 mb-4">
                Skip the form — upload your 3D file and get an instant price estimate in under 60 seconds.
              </p>
              <a href="/quote" className="text-sm text-blue-400 hover:underline">
                Get instant quote →
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Contact form */}
        <ScrollReveal direction="right">
          {done ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-white mb-2">Message Received!</h2>
              <p className="text-white/50 text-sm">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-2">Send us a message</h2>
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input placeholder="Your full name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input type="tel" placeholder="Mobile number" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea placeholder="Tell us about your project..." value={form.message} onChange={(e) => update("message", e.target.value)} rows={4} />
              </div>
              <Button type="submit" variant="gradient" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
