"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL, SERVICE_CITY, SERVICE_REGION } from "../lib/business";

const easeOut = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section className="relative bg-ink lg:max-h-[85vh]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:py-16">
        {/* Brand-forward text column */}
        <div className="relative z-10 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-silver">
              Mobile Detailing &middot; {SERVICE_CITY}, {SERVICE_REGION}
            </p>

            <h1 className="mt-5 text-balance font-serif text-5xl font-bold leading-[1.02] tracking-tight text-paper sm:text-6xl lg:text-7xl">
              Your Car Never Leaves
              <br />
              <span className="italic text-paper/70">Your Driveway.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70 sm:text-xl">
              Mobile interior and exterior detailing brought directly to your
              driveway in Omaha.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-accent-bright hover:shadow-[0_10px_30px_-8px_rgba(176,141,87,0.45)]"
              >
                Book Your Detail
              </Link>
              <a
                href={`tel:${BUSINESS_PHONE_TEL}`}
                className="inline-flex items-center rounded-full border border-silver/30 px-7 py-4 text-base font-semibold text-paper transition-colors hover:border-silver/60"
              >
                {BUSINESS_PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-silver/10 pt-6 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-paper/45">
              <span>Fully Mobile</span>
              <span className="h-1 w-1 rounded-full bg-silver/30" aria-hidden="true" />
              <span>Omaha &amp; Surrounding Suburbs</span>
              <span className="h-1 w-1 rounded-full bg-silver/30" aria-hidden="true" />
              <span>By Appointment</span>
            </div>
          </motion.div>
        </div>

        {/* Compact accent photo — a supporting graphic, not a competing block */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto h-[280px] w-full max-w-md overflow-hidden rounded-[28px] border border-silver/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:h-[360px] lg:h-[420px] lg:max-h-[450px] lg:max-w-none">
            <Image
              src="/images/IMG_1223.jpeg"
              alt="Detailed leather seating and dashboard, polished to a showroom finish"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(176,141,87,0.18),transparent_60%)]" />
            <div className="grain-surface absolute inset-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
