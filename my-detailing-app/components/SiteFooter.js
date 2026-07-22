import Link from "next/link";
import {
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  SERVICE_CITY,
  SERVICE_REGION,
} from "../lib/business";

export default function SiteFooter() {
  return (
    <footer className="border-t border-silver/10 bg-panel">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-xl text-paper">{BUSINESS_NAME}</p>
            <p className="mt-2 text-base leading-relaxed text-paper/60">
              Mobile detailing performed personally by Don &mdash; brought straight to
              your driveway.
            </p>
            <a
              href={`tel:${BUSINESS_PHONE_TEL}`}
              className="mt-5 inline-block text-lg font-bold text-paper transition-colors hover:text-accent"
            >
              {BUSINESS_PHONE_DISPLAY}
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
              Service Area
            </p>
            <p className="mt-3 text-base leading-relaxed text-paper/70">
              {SERVICE_CITY}, {SERVICE_REGION} &amp; surrounding suburbs
            </p>
            <p className="mt-2 text-base leading-relaxed text-paper/50">
              Driveway, office lot, or curb &mdash; wherever your car sits.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
              Hours
            </p>
            <p className="mt-3 text-base leading-relaxed text-paper/70">By Appointment</p>
            <Link
              href="/book"
              className="mt-2 inline-block text-base font-semibold text-accent transition-colors hover:text-accent-bright"
            >
              Book a time
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2 text-base text-paper/70">
              <li>
                <Link href="/services" className="transition-colors hover:text-paper">
                  Services &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="/book" className="transition-colors hover:text-paper">
                  Book Now
                </Link>
              </li>
              <li>
                <a
                  href={`tel:${BUSINESS_PHONE_TEL}`}
                  className="transition-colors hover:text-paper"
                >
                  Call or Text
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-silver/10 pt-6 text-xs text-paper/40">
          &copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
