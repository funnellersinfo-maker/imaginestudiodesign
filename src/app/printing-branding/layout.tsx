import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Printing & Branding Wilmington NC | Imagine Studio Design",
  description:
    "Premium printing and branding services in Wilmington, NC. Business cards, flyers, banners, custom apparel, brand identity. Free quote. Professional quality. Serving Wilmington, NC and surrounding areas.",
  keywords: [
    "Printing Wilmington NC",
    "Branding Wilmington NC",
    "Business Cards Wilmington",
    "Custom Apparel Printing",
    "Flyers and Brochures",
    "Banners and Posters",
    "Brand Identity Design",
    "Stickers and Labels",
    "Wilmington NC print shop",
    "custom printing",
    "business printing",
    "commercial printing",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: { icon: "/LOGO.png" },
  openGraph: {
    title: "Printing & Branding Wilmington NC | Imagine Studio Design",
    description:
      "Premium printing and branding that makes your business look established. Business cards, flyers, banners, custom apparel. Serving Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/printing-branding",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printing & Branding Wilmington NC | Imagine Studio Design",
    description:
      "Premium printing and branding for Wilmington businesses. Business cards, flyers, banners, custom apparel.",
  },
  robots: { index: true, follow: true, region: "us-east" },
  other: {
    "geo.region": "US-NC",
    "geo.placename": "Wilmington",
    "geo.position": "34.2257;-77.9447",
  },
};

export default function PrintingBrandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
