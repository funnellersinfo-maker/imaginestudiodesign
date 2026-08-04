import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window Graphics Wilmington NC | Imagine Studio Design",
  description:
    "Custom window graphics in Wilmington, NC. Perforated film, frosted vinyl, vinyl lettering, storefront decals. Free quote. Professional installation. Serving Wilmington, NC and surrounding areas.",
  keywords: [
    "Window Graphics Wilmington NC",
    "Custom Window Graphics",
    "Storefront Window Graphics",
    "Perforated Window Film",
    "Frosted Window Graphics",
    "Vinyl Lettering",
    "Window Decals",
    "One-Way Vision Film",
    "Etched Glass Vinyl",
    "Wilmington NC sign company",
    "business window graphics",
    "window vinyl wraps",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: {
    icon: "/LOGO.png",
  },
  openGraph: {
    title: "Window Graphics Wilmington NC | Imagine Studio Design",
    description:
      "Custom window graphics that turn your storefront into a 24/7 advertisement. Perforated film, frosted vinyl, vinyl lettering. Serving Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/window-graphics",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Window Graphics Wilmington NC | Imagine Studio Design",
    description:
      "Custom window graphics that turn your windows into customers. Perforated film, frosted vinyl, storefront decals in Wilmington, NC.",
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

export default function WindowGraphicsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
