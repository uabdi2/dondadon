// Home page (Hero, Mission, Meet Don, service story sections)

import Image from "next/image";
import Link from "next/link";
import { findService } from "../lib/services";
import { buildLocalBusinessSchema } from "../lib/business";
import Hero from "../components/Hero";

export const metadata = {
  title: "Don's Professional Car Detailing | Mobile Detailing in Omaha, NE",
  description:
    "Premium mobile car detailing in Omaha, Nebraska. Full details, interior detailing, seat extraction, and express washes — brought to your driveway.",
};

const jsonLd = buildLocalBusinessSchema({ path: "/" });

const interiorDetail = findService("full-interior-detail");
const seatWash = findService("seat-wash");
const exteriorWash = findService("exterior-wash");

const services = [
  {
    number: "01",
    service: interiorDetail,
    image: "/images/IMG_1220.jpeg",
    alt: "A freshly detailed rear seat and cabin, clean and vacuumed",
    badge: "Most Popular",
    imageWrapClass: "lg:col-span-7",
    textWrapClass: "lg:col-span-5",
    imageSizes: "(min-width: 1024px) 55vw, 100vw",
  },
  {
    number: "02",
    service: seatWash,
    image: "/images/IMG_0671.jpeg",
    alt: "Hot-water extraction lifting a stain from a car seat by hand",
    imageWrapClass: "lg:order-2 lg:col-span-6",
    textWrapClass: "lg:order-1 lg:col-span-6",
    imageSizes: "(min-width: 1024px) 45vw, 100vw",
  },
  {
    number: "03",
    service: exteriorWash,
    image: "/images/IMG_1583.jpeg",
    alt: "A freshly washed exterior with paint reflecting a clear sky",
    imageWrapClass: "lg:col-span-7",
    textWrapClass: "lg:col-span-5",
    imageSizes: "(min-width: 1024px) 55vw, 100vw",
  },
];

function Framed({ src, alt, sizes }) {
  return (
    <div className="rounded-[28px] border border-silver/10 bg-panel p-2.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-center" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      {/* Vision & Mission */}
      <section className="relative overflow-hidden bg-panel px-4 py-12 sm:px-8 sm:py-14 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 0%, rgba(176,141,87,0.10), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mx-auto block h-px w-14 bg-accent/50" aria-hidden="true" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-accent-bright">
            Our Standard
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-semibold leading-tight text-paper sm:text-5xl lg:text-[3.25rem]">
            Craftsmanship Brought to Your Door
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/70 sm:text-xl">
            At Don&rsquo;s Mobile Detailing, we believe great work isn&rsquo;t rushed.
            Every vehicle is treated with relentless attention to detail, premium
            products, and a commitment to restoring your car to showroom quality
            without you ever having to leave your driveway.
          </p>
        </div>
      </section>

      {/* Meet Don — text-only editorial feature */}
      <section className="bg-panel px-4 py-12 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grain-surface relative overflow-hidden rounded-[32px] border border-silver/10 bg-ink px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, rgba(176,141,87,0.14), transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent-bright">
                Owner-Operated
              </span>
              <h2 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight text-paper sm:text-5xl lg:text-[3.25rem]">
                Who&rsquo;s Behind the Work? Meet Don.
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-paper/70 sm:text-xl">
                Don&rsquo;s Mobile Detailing is a strictly{" "}
                <span className="font-semibold text-accent-bright">owner-operated</span>{" "}
                mobile wash and interior specialist. With years of dedicated
                detailing experience, Don doesn&rsquo;t just wash cars&mdash;he
                performs complete deep-clean transformations.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-paper/60 sm:text-xl">
                When you book, you skip the franchise crews and get the owner
                himself right in your driveway. From meticulous hand-washes and
                tire dressing to deep interior extraction and leather
                conditioning, the same expert hands treat every vehicle. Don
                cleans every nook and cranny like it&rsquo;s facing a strict
                inspection. If it&rsquo;s not pristine, he stays until it is.
                That&rsquo;s the unhurried, premium standard Omaha drivers trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ink px-4 pb-12 sm:px-8 sm:pb-14 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-silver">
              The Menu
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-paper sm:text-5xl lg:text-[3.25rem]">
              Services, Priced Plainly
            </h2>
          </div>

          <div className="mt-12 flex flex-col gap-12 sm:gap-16">
            {services.map(
              ({ number, service, image, alt, badge, imageWrapClass, textWrapClass, imageSizes }) => (
                <div
                  key={service.slug}
                  className="grid grid-cols-1 items-center gap-10 border-t border-silver/10 pt-10 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-16"
                >
                  <div className={imageWrapClass}>
                    <Framed src={image} alt={alt} sizes={imageSizes} />
                  </div>

                  <div className={textWrapClass}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-sm text-accent-bright">{number}</span>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-silver">
                        {service.durationLabel}
                      </p>
                      {badge ? (
                        <span className="rounded-full bg-accent/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-accent-bright">
                          {badge}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 font-serif text-3xl leading-tight text-paper sm:text-4xl">
                      {service.name}
                    </h3>
                    <p className="mt-5 text-lg text-paper/70">{service.whoFor}</p>
                    <p className="mt-4 text-lg leading-relaxed text-paper/60">
                      {service.transformation}
                    </p>

                    <ul
                      className={`mt-8 grid gap-x-4 gap-y-2 text-base text-paper/70 ${
                        service.features.length > 3 ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-9 flex flex-wrap items-center gap-5 rounded-2xl border border-silver/10 bg-panel/60 px-6 py-5">
                      <p className="text-lg text-paper/70">
                        Starting at{" "}
                        <span className="tabular-nums font-serif text-2xl font-semibold text-accent-bright">
                          ${service.price}
                        </span>
                      </p>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="ml-auto rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-accent-bright hover:shadow-[0_10px_30px_-8px_rgba(176,141,87,0.45)]"
                      >
                        Book Service
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
