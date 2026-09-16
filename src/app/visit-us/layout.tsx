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

/* Schema.org LocalBusiness — SEO local + rich snippets */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Imagine Studio Design",
  image: "https://imaginestudiodesign.pages.dev/LOGO.png",
  url: "https://imaginestudiodesign.pages.dev",
  telephone: "+19105474314",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4608 Cedar Ave, Suite 105",
    addressLocality: "Wilmington",
    addressRegion: "NC",
    postalCode: "28403",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.2134,
    longitude: -77.8824,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "20",
  },
  priceRange: "$$",
  areaServed: "Wilmington, NC and surrounding areas",
};

export default function VisitUsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
