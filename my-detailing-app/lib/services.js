// Shared source of truth for the four detailing packages. Used by the
// booking wizard (display) and /api/book (server-side lookup by name against
// the live `services` table — price/duration for the actual charge always
// comes from Supabase, never trusted from the client).

export const SERVICES = [
  {
    slug: "full-detail",
    name: "Full Detail (Interior + Exterior)",
    price: 165,
    durationMinutes: 180,
    durationLabel: "3 hours",
    description: "Don's complete top-to-bottom detail, inside and out.",
    features: [
      "Complete interior cleaning",
      "Exterior hand wash",
      "Tire shine",
      "Dashboard & console cleaning",
      "Door jambs",
      "Windows",
      "Vacuum",
      "Interior wipe down",
    ],
  },
  {
    slug: "full-interior-detail",
    name: "Full Interior Detail",
    price: 150,
    durationMinutes: 120,
    durationLabel: "2 hours",
    description: "A deep, thorough clean of every interior surface.",
    features: [
      "Full vacuum",
      "Dashboard cleaning",
      "Console cleaning",
      "Door panels",
      "Windows",
      "Interior wipe down",
      "Trash removal",
    ],
  },
  {
    slug: "deep-seat-wash-extraction",
    name: "Deep Seat Wash & Extraction",
    price: 95,
    durationMinutes: 45,
    durationLabel: "45 minutes",
    description: "Targeted shampoo and extraction for stained or odorous seats.",
    features: [
      "Upholstery shampoo",
      "Deep stain removal",
      "Odor extraction",
      "Fabric extraction",
    ],
  },
  {
    slug: "express-exterior-wash",
    name: "Express Exterior Wash",
    price: 15,
    durationMinutes: 30,
    durationLabel: "30 minutes",
    description: "A quick, clean exterior refresh — in and out fast.",
    features: ["Hand wash", "Wheels cleaned", "Tire shine", "Exterior rinse"],
  },
];

export function findService(slugOrName) {
  if (!slugOrName) return null;
  const needle = String(slugOrName).trim().toLowerCase();
  return (
    SERVICES.find(
      (s) => s.slug.toLowerCase() === needle || s.name.toLowerCase() === needle
    ) || null
  );
}
