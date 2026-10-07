import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { MaterialsSection } from "@/components/home/MaterialsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/lead/WhatsAppFloat";
import { FAQSchema } from "@/components/shared/StructuredData";

export const metadata: Metadata = {
  title: "Kalinga Forge — India's Premium 3D Printing Service | Custom Prototypes & Products",
  description:
    "Get instant quotes for custom 3D printing in India. STL printing, engineering prototypes, rapid manufacturing. 9 materials, fast delivery, competitive pricing.",
  alternates: { canonical: "/" },
};

const HOME_FAQS = [
  {
    question: "What file formats do you accept for 3D printing?",
    answer:
      "We accept STL, STEP, OBJ, and 3MF file formats. STL is the most common and recommended format.",
  },
  {
    question: "How long does 3D printing take in India?",
    answer:
      "Standard delivery is 5–7 business days. Express is 2–3 days. Urgent orders get next business day delivery.",
  },
  {
    question: "What materials are available for 3D printing?",
    answer:
      "We offer PLA, PLA+, PETG, ABS, ASA, TPU, Nylon, Carbon Fiber, and Resin (SLA).",
  },
  {
    question: "How do I get a quote for custom 3D printing?",
    answer:
      "Upload your 3D file, select material and specs, get an instant estimate. Our team sends a final quote within 24 hours.",
  },
  {
    question: "Do you do small batch production?",
    answer:
      "Yes — 1 to 10,000 units with quantity discounts from 5 units. Contact us for bulk pricing.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <MaterialsSection />
        <IndustriesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <FAQSchema faqs={HOME_FAQS} />
    </>
  );
}
