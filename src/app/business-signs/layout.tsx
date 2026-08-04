import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Signs Wilmington NC | Imagine Studio Design",
  description:
    "Custom business signs in Wilmington, NC. Exterior signs, channel letters, monument signs, office signage. Free quote. Professional installation. Serving Wilmington, NC and surrounding areas.",
  keywords: [
    "Business Signs Wilmington NC",
    "Commercial Signs Wilmington",
    "Custom Business Signs",
    "Exterior Signs",
    "Indoor Signs",
    "Office Signs",
    "Channel Letters",
    "Monument Signs",
    "Wilmington NC sign company",
    "business signage",
    "storefront signs",
    "illuminated signs",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: {
    icon: "/LOGO.png",
  },
  openGraph: {
    title: "Business Signs Wilmington NC | Imagine Studio Design",
    description:
      "Custom business signs that make your company impossible to ignore. Exterior signs, channel letters, monument signs, office signage. Serving Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/business-signs",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Signs Wilmington NC | Imagine Studio Design",
    description:
      "Custom business signs that turn drive-bys into walk-ins. Exterior signs, channel letters, monument signs in Wilmington, NC.",
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

export default function BusinessSignsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
