// Home page (Hero, teasers)

import Link from "next/link";
import { SERVICES } from "../lib/services";
import { buildLocalBusinessSchema } from "../lib/business";

export const metadata = {
  title: "Don's Professional Car Detailing | Mobile Detailing in Omaha, NE",
  description:
    "Premium mobile car detailing in Omaha, Nebraska. Full details, interior detailing, seat extraction, and express washes — brought to your driveway.",
};

const jsonLd = buildLocalBusinessSchema({ path: "/" });

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-4 py-24 text-center sm:px-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#DC2626]">
          Omaha, Nebraska
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
          Precision Detailing. Brought to Your Driveway.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#B3B3B3]">
          Don's Professional Car Detailing delivers showroom-quality interior and exterior
          detailing wherever your car sits — no drop-off required.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="rounded-xl bg-[#DC2626] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
          >
            Book Your Detail
          </Link>
          <Link
            href="/services"
            className="rounded-xl border border-[#2A2A2A] px-8 py-4 text-lg font-bold text-white transition hover:border-[#DC2626] hover:text-[#EF4444]"
          >
            View Services
          </Link>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/book?service=${service.slug}`}
              className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#171717] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#DC2626] hover:shadow-[0_0_20px_rgba(220,38,38,0.25)]"
            >
              <h2 className="text-lg font-bold text-white">{service.name}</h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-[#DC2626]">
                {service.durationLabel}
              </p>
              <p className="mt-3 text-2xl font-black text-[#EF4444]">${service.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2A2A2A] bg-[#111111] px-4 py-16 text-center sm:px-8">
        <span className="text-3xl" aria-hidden="true">
          🚗
        </span>
        <p className="mt-3 text-xl font-bold text-white">Mobile Service — We come to you!</p>
        <p className="mt-2 text-[#B3B3B3]">
          All we need is access to your driveway or parking space.
        </p>
      </section>
    </main>
  );
}
