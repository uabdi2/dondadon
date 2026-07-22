// Multi-step booking app
//
// Server component: owns metadata + JSON-LD (both require a server
// component in the App Router). All interactivity lives in BookingWizard.

import { Suspense } from "react";
import { buildLocalBusinessSchema } from "../../lib/business";
import BookingWizard from "./BookingWizard";

export const metadata = {
  title: "Premium Mobile Car Detailing Booking | Don's Professional Car Detailing | Omaha, NE",
  description:
    "Book professional mobile car detailing in Omaha, Nebraska with Don's Professional Car Detailing. Full Interior & Exterior Combo, Seat Wash, and Exterior Wash — brought directly to your driveway.",
};

const jsonLd = buildLocalBusinessSchema({ path: "/book" });

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-12 sm:px-8 lg:px-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Book Your Detail
          </h1>
          <p className="mt-2 text-[#B3B3B3]">Mobile detailing for Omaha, Nebraska.</p>
        </header>

        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <span
                aria-hidden="true"
                className="h-8 w-8 animate-spin rounded-full border-2 border-[#2A2A2A] border-t-[#DC2626]"
              />
            </div>
          }
        >
          <BookingWizard />
        </Suspense>
      </div>
    </main>
  );
}
