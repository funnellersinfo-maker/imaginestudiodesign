import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window Decals Wilmington NC | Imagine Studio Design",
  description:
    "Custom window decals in Wilmington, NC. Perforated film, frosted vinyl, vinyl lettering, storefront decals. Free quote. Professional installation. Serving Wilmington, NC and surrounding areas.",
  keywords: [
    "Window Decals Wilmington NC",
    "Custom Window Decals",
    "Storefront Window Decals",
    "Perforated Window Film",
    "Frosted Window Decals",
    "Vinyl Lettering",
    "Window Decals",
    "One-Way Vision Film",
    "Etched Glass Vinyl",
    "Wilmington NC sign company",
    "business window decals",
    "window vinyl wraps",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: {
    icon: "/LOGO.png",
  },
  openGraph: {
    title: "Window Decals Wilmington NC | Imagine Studio Design",
    description:
      "Custom window decals that turn your storefront into a 24/7 advertisement. Perforated film, frosted vinyl, vinyl lettering. Serving Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/window-decals",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Window Decals Wilmington NC | Imagine Studio Design",
    description:
      "Custom window decals that turn your windows into customers. Perforated film, frosted vinyl, storefront decals in Wilmington, NC.",
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

export default function WindowDecalsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
