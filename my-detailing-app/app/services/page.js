// Service menu page

import Link from "next/link";
import { SERVICES } from "../../lib/services";
import { buildLocalBusinessSchema } from "../../lib/business";

export const metadata = {
  title: "Detailing Services & Pricing | Don's Professional Car Detailing | Omaha, NE",
  description:
    "Explore Don's Professional Car Detailing service menu — Full Interior & Exterior Combo, Seat Wash, and Exterior Wash for Omaha, Nebraska. Mobile service, driveway convenience.",
};

const jsonLd = buildLocalBusinessSchema({ path: "/services" });

export default function ServicesPage() {
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
            Detailing Services
          </h1>
          <p className="mt-2 text-[#B3B3B3]">
            Premium mobile detailing packages for Omaha, Nebraska. Don comes to your driveway.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="flex h-full flex-col rounded-xl border border-[#2A2A2A] bg-[#171717] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#DC2626] hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-white">{service.name}</h2>
                <span className="whitespace-nowrap text-2xl font-black text-[#EF4444]">
                  ${service.price}
                </span>
              </div>

              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#DC2626]">
                {service.durationLabel}
              </p>
              <p className="mb-4 text-sm text-[#B3B3B3]">{service.description}</p>

              <ul className="mb-6 space-y-1.5 text-sm text-[#B3B3B3]">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#DC2626]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/book?service=${service.slug}`}
                className="mt-auto inline-flex items-center justify-center rounded-lg bg-[#DC2626] px-5 py-3 font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                Book This Service
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
          <p className="font-bold text-white">Mobile Service — We come to you!</p>
          <p className="text-sm text-[#B3B3B3]">
            All we need is access to your driveway or parking space.
          </p>
        </div>
      </div>
    </main>
  );
}
