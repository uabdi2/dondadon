// Single source of truth for real business contact details, used by the
// site header/footer and every JSON-LD schema so the phone number only
// ever lives in one place.

import { SERVICES } from "./services";

export const BUSINESS_NAME = "Don's Professional Car Detailing";

// Verified from Don's business card — do not change without confirming
// with him first.
export const BUSINESS_PHONE_DISPLAY = "(402) 547-6325";
export const BUSINESS_PHONE_TEL = "+14025476325"; // for tel: links
export const BUSINESS_PHONE_SCHEMA = "+1-402-547-6325"; // schema.org telephone format

export const SERVICE_CITY = "Omaha";
export const SERVICE_REGION = "NE";

// TODO: replace with the real production domain before launch — not
// provided yet, unlike the phone number above.
export const SITE_URL = "https://www.donsdetailingomaha.com";

export function buildLocalBusinessSchema({ path = "/" } = {}) {
  const prices = SERVICES.map((s) => s.price);

  return {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    name: BUSINESS_NAME,
    description:
      "Premium mobile car detailing serving Omaha, Nebraska — interior detailing, full details, seat extraction, and exterior washes brought directly to the customer's driveway.",
    url: `${SITE_URL}${path}`,
    telephone: BUSINESS_PHONE_SCHEMA,
    priceRange: `$${Math.min(...prices)}-$${Math.max(...prices)}`,
    areaServed: {
      "@type": "City",
      name: `${SERVICE_CITY}, ${SERVICE_REGION}`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: SERVICE_CITY,
      addressRegion: SERVICE_REGION,
      addressCountry: "US",
    },
    makesOffer: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
      price: String(service.price),
      priceCurrency: "USD",
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: `${SITE_URL}/book`,
    },
  };
}
