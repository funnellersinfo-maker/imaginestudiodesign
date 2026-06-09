import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imagine Studio Design | Business Visibility Company - Wilmington, NC",
  description:
    "Helping Local Businesses Look Professional, Get Noticed, and Win More Customers. Vehicle wraps, fleet branding, signage, apparel, and complete business visibility systems in Wilmington, NC.",
  keywords: [
    "vehicle wraps Wilmington NC",
    "fleet branding",
    "business signage",
    "commercial vehicle graphics",
    "vehicle wrap design",
    "business visibility",
    "truck wraps",
    "van wraps",
    "contractor branding",
    "HVAC vehicle wrap",
    "plumber branding",
    "roofer vehicle wrap",
    "Wilmington NC sign company",
    "custom business apparel",
    "commercial signage",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: {
    icon: "/LOGO.png",
  },
  openGraph: {
    title: "Imagine Studio Design | Look Professional. Get Noticed. Win More Customers.",
    description:
      "Transform your business image with professional vehicle wraps, fleet branding, signage, and complete visibility systems. Serving Wilmington, NC and beyond.",
    url: "https://imaginestudionc.com",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagine Studio Design | Business Visibility Company",
    description:
      "Helping Local Businesses Look Professional, Get Noticed, and Win More Customers. Vehicle wraps, fleet branding, signage in Wilmington, NC.",
  },
  robots: {
    index: true,
    follow: true,
    region: "us-east",
  },
  other: {
    "geo.region": "US-NC",
    "geo.placename": "Wilmington",
    "geo.position": "34.2257;-77.9447",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
