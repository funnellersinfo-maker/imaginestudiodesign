import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Imagine Studio Design | Wilmington, NC",
  description: "Custom vehicle wraps, apparel & embroidery in Wilmington, NC. Come see our studio at 4608 Cedar Ave, Suite 105. Get directions today.",
  keywords: ["Imagine Studio Design", "Wilmington NC", "vehicle wraps", "custom apparel", "embroidery", "visit our shop"],
  openGraph: {
    title: "Visit Imagine Studio Design | Wilmington, NC",
    description: "Come see our studio in Wilmington. Vehicle wraps, custom apparel & embroidery.",
    url: "https://imaginestudiodesign.pages.dev/visit-us",
    siteName: "Imagine Studio Design",
    type: "website",
    locale: "en_US",
  },
  other: {
    "geo.region": "US-NC",
    "geo.placename": "Wilmington",
    "geo.position": "34.2134;-77.8824",
  },
};

export default function VisitUsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
