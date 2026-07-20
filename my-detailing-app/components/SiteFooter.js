import {
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  SERVICE_CITY,
  SERVICE_REGION,
} from "../lib/business";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#111111]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-8 sm:text-left">
        <p className="text-lg font-black text-white">{BUSINESS_NAME}</p>
        <p className="mt-1 text-sm text-[#B3B3B3]">
          Mobile detailing serving {SERVICE_CITY}, {SERVICE_REGION} and the surrounding area.
        </p>
        <p className="mt-4 text-sm text-[#B3B3B3]">
          Call or text:{" "}
          <a
            href={`tel:${BUSINESS_PHONE_TEL}`}
            className="font-bold text-white transition hover:text-[#EF4444]"
          >
            {BUSINESS_PHONE_DISPLAY}
          </a>
        </p>
        <p className="mt-6 text-xs text-[#6b6b6b]">
          &copy; {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
