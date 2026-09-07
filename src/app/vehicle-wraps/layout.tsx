import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Wraps Wilmington NC | Imagine Studio Design",
  description:
    "Custom vehicle wraps in Wilmington, NC. Full wraps, partial wraps, fleet branding. Premium quality. Free quote. Professional installation.",
  keywords: [
    "Vehicle Wraps Wilmington NC",
    "Custom Vehicle Wraps",
    "Truck Wraps Wilmington",
    "Van Wraps",
    "Fleet Branding",
    "Commercial Vehicle Graphics",
    "Car Wraps Wilmington NC",
    "Wilmington NC wrap company",
  ],
  authors: [{ name: "Imagine Studio Design" }],
  icons: { icon: "/LOGO.png" },
  openGraph: {
    title: "Vehicle Wraps Wilmington NC | Imagine Studio Design",
    description: "Your truck is your best salesperson. Custom vehicle wraps that turn drive-bys into customers. Wilmington, NC.",
    url: "https://imaginestudiodesign.pages.dev/vehicle-wraps",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Wraps Wilmington NC | Imagine Studio Design",
    description: "Custom vehicle wraps that make your business impossible to ignore. Wilmington, NC.",
  },
  robots: { index: true, follow: true, region: "us-east" },
  other: {
    "geo.region": "US-NC",
    "geo.placename": "Wilmington",
    "geo.position": "34.2257;-77.9447",
  },
};

export default function VehicleWrapsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
