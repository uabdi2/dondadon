// Shared source of truth for the three detailing packages. Used by the
// booking wizard (display) and /api/book (server-side lookup by name against
// the live `services` table — price/duration for the actual charge always
// comes from Supabase, never trusted from the client).

export const SERVICES = [
  {
    slug: "full-interior-detail",
    name: "Full Interior & Exterior Combo",
    price: 145,
    durationMinutes: 120,
    durationLabel: "2 Hours",
    description:
      "The complete all-in-one transformation, inside and out, in a single visit.",
    whoFor:
      "Owners who want it all handled in one visit — the driveway hand-wash and the deep interior reset, done by the same set of hands instead of booking two separate appointments.",
    transformation:
      "Exterior hand wash, wheel and tire detail, deep interior extraction, and leather conditioning — every surface, inside and out, gets the same unhurried attention. One appointment, one complete transformation.",
    features: [
      "Exterior Hand Wash",
      "Wheel & Tire Detail",
      "Deep Interior Extraction",
      "Leather Conditioning",
    ],
  },
  {
    slug: "seat-wash",
    name: "Seat Wash",
    price: 55,
    durationMinutes: 60,
    durationLabel: "1 Hour",
    description: "Targeted shampoo and extraction for stained or odorous seats.",
    whoFor:
      "Stained cloth seats, spilled coffee, muddy paws, or a car seat that's seen one too many road trips.",
    transformation:
      "Hot-water extraction lifts stains and odor at the source instead of masking them, so seats look and smell the way they did on day one.",
    features: ["Upholstery shampoo", "Deep stain removal", "Odor extraction"],
  },
  {
    slug: "exterior-wash",
    name: "Exterior Wash",
    price: 15,
    durationMinutes: 30,
    durationLabel: "30 Minutes",
    description: "A quick, clean exterior refresh — in and out fast.",
    whoFor:
      "Anyone who wants their car looking sharp before a long drive, a big meeting, or just because a dirty car is a bad look.",
    transformation:
      "A fast, thorough hand wash brings the shine back — clean wheels, dressed tires, and paint that actually reflects the sky again.",
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
