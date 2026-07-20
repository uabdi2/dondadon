import Link from "next/link";
import { BUSINESS_NAME, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from "../lib/business";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#2A2A2A] bg-[#0B0B0B]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="text-lg font-black tracking-tight text-white">
          {BUSINESS_NAME}
        </Link>

        <nav className="flex items-center gap-6 text-sm font-semibold text-[#B3B3B3]">
          <Link href="/services" className="transition hover:text-[#EF4444]">
            Services
          </Link>
          <Link
            href="/book"
            className="rounded-lg bg-[#DC2626] px-4 py-2 text-white transition hover:bg-[#B91C1C]"
          >
            Book Now
          </Link>
          <a
            href={`tel:${BUSINESS_PHONE_TEL}`}
            className="hidden font-bold text-white transition hover:text-[#EF4444] sm:inline"
          >
            {BUSINESS_PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  );
}
