import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom T-Shirts, Embroidery & Caps Wilmington NC | Imagine Studio Design",
  description:
    "Custom apparel in Wilmington, NC. Custom t-shirts, embroidery, caps, business apparel, team shirts. Premium quality. Free quote. Visit our shop.",
  keywords: [
    "Custom T-Shirts Wilmington NC",
    "Custom Apparel Wilmington NC",
    "Embroidery Wilmington NC",
    "Custom Hats Wilmington NC",
    "Business Apparel Wilmington NC",
    "Custom Caps",
    "Embroidered Shirts",
    "Team Apparel",
    "Work Shirts",
    "Custom Printing",
    "Wilmington NC apparel",
    "branded shirts",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: { icon: "/LOGO.png" },
  openGraph: {
    title: "Custom T-Shirts, Embroidery & Caps Wilmington NC | Imagine Studio Design",
    description:
      "Your brand on every thread. Custom t-shirts, embroidery & caps made for your business, team or next big event. Serving Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/custom-apparel",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom T-Shirts, Embroidery & Caps Wilmington NC",
    description: "Your brand on every thread. Custom apparel, embroidery, and caps in Wilmington, NC.",
  },
  robots: { index: true, follow: true, region: "us-east" },
  other: {
    "geo.region": "US-NC",
    "geo.placename": "Wilmington",
    "geo.position": "34.2257;-77.9447",
  },
};

export default function CustomApparelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
