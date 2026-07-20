// Appointment verification landing page — reached via /api/verify's
// redirect after a customer clicks their confirmation email link.

import { Suspense } from "react";
import VerifyStatus from "./VerifyStatus";

export const metadata = {
  title: "Appointment Verification | Don's Professional Car Detailing",
};

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4 py-16">
      <Suspense
        fallback={
          <span
            aria-hidden="true"
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#2A2A2A] border-t-[#DC2626]"
          />
        }
      >
        <VerifyStatus />
      </Suspense>
    </main>
  );
}
