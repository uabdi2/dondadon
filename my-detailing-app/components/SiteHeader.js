"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Logo from "./Logo";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from "../lib/business";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-silver/15 bg-ink/80" : "border-transparent bg-ink/30"
      } backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo className="h-10 w-auto sm:h-12" />
        </Link>

        <nav className="flex items-center text-sm font-medium text-paper/80">
          <Link
            href="/services"
            className="hidden transition-colors hover:text-paper sm:inline-block"
          >
            Services
          </Link>

          <span className="mx-8 hidden h-4 w-px bg-silver/25 sm:inline-block" aria-hidden="true" />

          <a
            href={`tel:${BUSINESS_PHONE_TEL}`}
            className="hidden text-base font-bold tracking-tight text-paper transition-colors hover:text-accent sm:inline-block"
          >
            {BUSINESS_PHONE_DISPLAY}
          </a>

          <Link
            href="/book"
            className="ml-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_0_0_1px_rgba(176,141,87,0.35)] transition-all hover:-translate-y-px hover:bg-accent-bright sm:ml-10"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
