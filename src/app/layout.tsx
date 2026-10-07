import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { LocalBusinessSchema } from "@/components/shared/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://kalingaforge.in"),
  title: {
    default: "Kalinga Forge — India's Premium 3D Printing Service",
    template: "%s | Kalinga Forge",
  },
  description:
    "Custom 3D printing services in India. STL printing, STEP files, engineering prototypes, rapid prototyping, and 3D printed products. Instant quote. Fast delivery.",
  keywords: [
    "3D printing India",
    "custom 3D printing",
    "3D printing Bangalore",
    "STL printing service",
    "rapid prototyping India",
    "engineering prototypes",
    "online 3D printing",
    "3D printed gifts",
    "prototype manufacturing",
    "Kalinga Forge",
  ],
  authors: [{ name: "Kalinga Forge" }],
  creator: "Kalinga Forge",
  publisher: "Kalinga Forge",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://kalingaforge.in",
    siteName: "Kalinga Forge",
    title: "Kalinga Forge — India's Premium 3D Printing Service",
    description:
      "Custom 3D printing services. Engineering prototypes, rapid manufacturing, and 3D printed products. Instant quote system.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Kalinga Forge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalinga Forge — India's Premium 3D Printing Service",
    description: "Custom 3D printing. Instant quote. Fast delivery across India.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="min-h-screen bg-white text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
