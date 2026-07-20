"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-[#EF4444]" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-[#EF4444]" aria-hidden="true">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusCard({ iconBg, icon, title, message, action }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-[#2A2A2A] bg-[#171717] px-6 py-16 text-center">
      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <h1 className="mb-3 text-3xl font-black text-white">{title}</h1>
      <p className="max-w-sm text-[#B3B3B3]">{message}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export default function VerifyStatus() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <StatusCard
        iconBg="bg-[#DC2626]/20"
        icon={<CheckIcon />}
        title="You're All Set!"
        message="Don has confirmed your spot. He'll see you at your scheduled time — thanks for booking with Don's Professional Car Detailing."
      />
    );
  }

  if (status === "expired") {
    return (
      <StatusCard
        iconBg="bg-[#2A2A2A]"
        icon={<XIcon />}
        title="Link Expired"
        message="This verification link is no longer valid, or your 2-hour hold has passed. Pick a new time to lock in your appointment."
        action={
          <Link
            href="/book"
            className="rounded-lg bg-[#DC2626] px-8 py-3 font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            Pick a New Slot
          </Link>
        }
      />
    );
  }

  return (
    <StatusCard
      iconBg="bg-[#2A2A2A]"
      icon={<XIcon />}
      title="Something Went Wrong"
      message="We couldn't verify that link. If you already booked, try again from the email, or pick a new time below."
      action={
        <Link
          href="/book"
          className="rounded-lg bg-[#DC2626] px-8 py-3 font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
        >
          Go to Booking
        </Link>
      }
    />
  );
}
