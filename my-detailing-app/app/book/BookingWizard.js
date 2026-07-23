"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SERVICES, findService } from "../../lib/services";
import ProgressBar from "./components/ProgressBar";
import ServiceStep from "./components/ServiceStep";
import DateTimeStep from "./components/DateTimeStep";
import CustomerInfoStep from "./components/CustomerInfoStep";
import ConfirmStep from "./components/ConfirmStep";

const EMPTY_VALUES = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  address: "",
  city: "",
  zip: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleColor: "",
  notes: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingWizard() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [stepVisible, setStepVisible] = useState(true);

  // Pre-select a package from ?serviceId= or ?service=, matched against slug.
  useEffect(() => {
    const requested = searchParams.get("serviceId") || searchParams.get("service");
    const match = findService(requested);
    if (match) setSelectedSlug(match.slug);
  }, [searchParams]);

  // Simple CSS-only fade between steps (no keyframe/plugin dependency).
  useEffect(() => {
    setStepVisible(false);
    const timer = setTimeout(() => setStepVisible(true), 20);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(timer);
  }, [submitted]);

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.slug === selectedSlug) || null,
    [selectedSlug]
  );

  const stepComplete = useMemo(() => {
    if (step === 1) return Boolean(selectedService);
    if (step === 2) return Boolean(selectedDate && selectedSlot);
    if (step === 3) {
      return Boolean(
        values.customerName.trim() &&
          EMAIL_RE.test(values.customerEmail) &&
          values.customerPhone.replace(/\D/g, "").length >= 10 &&
          values.address.trim() &&
          values.city.trim() &&
          /^\d{5}$/.test(values.zip.trim()) &&
          values.vehicleMake.trim() &&
          values.vehicleModel.trim() &&
          values.vehicleColor.trim()
      );
    }
    return true;
  }, [step, selectedService, selectedDate, selectedSlot, values]);

  function updateValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validateCustomerInfo() {
    const nextErrors = {};
    if (!values.customerName.trim()) nextErrors.customerName = "Required";
    if (!EMAIL_RE.test(values.customerEmail)) nextErrors.customerEmail = "Enter a valid email";
    if (values.customerPhone.replace(/\D/g, "").length < 10)
      nextErrors.customerPhone = "Enter a valid phone number";
    if (!values.address.trim()) nextErrors.address = "Required";
    if (!values.city.trim()) nextErrors.city = "Required";
    if (!/^\d{5}$/.test(values.zip.trim())) nextErrors.zip = "Enter a 5-digit ZIP";
    if (!values.vehicleMake.trim()) nextErrors.vehicleMake = "Required";
    if (!values.vehicleModel.trim()) nextErrors.vehicleModel = "Required";
    if (!values.vehicleColor.trim()) nextErrors.vehicleColor = "Required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleNext() {
    if (step === 3 && !validateCustomerInfo()) return;
    if (!stepComplete) return;
    setStep((s) => Math.min(s + 1, 4));
  }

  function handleBack() {
    setSubmitError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: selectedService.slug,
          startISO: selectedSlot.startISO,
          ...values,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.error || "Unable to submit your request. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Unable to submit your request. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#171717] px-6 py-16 text-center">
        <div
          className={[
            "mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DC2626]/20 transition-all duration-500",
            revealed ? "scale-100 opacity-100" : "scale-50 opacity-0",
          ].join(" ")}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-[#EF4444]" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-3xl font-black text-white">Check your email!</h2>
        <p className="max-w-md text-[#B3B3B3]">
          A confirmation link has been sent to your inbox. You must verify your appointment within
          2 hours to reserve your selected time slot.
        </p>

        <div className="mt-8 w-full max-w-md rounded-xl border border-[#2A2A2A] bg-[#0B0B0B] px-5 py-5 text-left">
          <p className="text-sm font-bold text-white">
            📩 Important Step to Confirm Your Appointment:
          </p>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-[#B3B3B3]">
            <li>1. Check your email inbox (and Spam/Junk folder) for your confirmation email.</li>
            <li>2. If it lands in Spam, click &ldquo;Report as Not Spam&rdquo; at the top of the email.</li>
            <li>
              3. Open the email in your primary inbox and click &ldquo;Confirm My
              Appointment&rdquo; within 2 hours to hold your spot!
            </li>
          </ol>
        </div>

        <p className="mt-4 max-w-md text-sm text-[#B3B3B3]">
          If verification is not completed before expiration, the appointment request will
          automatically expire.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar currentStep={step} />

      <div className={`transition-opacity duration-300 ${stepVisible ? "opacity-100" : "opacity-0"}`}>
        {step === 1 && (
          <ServiceStep services={SERVICES} selectedSlug={selectedSlug} onSelect={setSelectedSlug} />
        )}
        {step === 2 && selectedService && (
          <DateTimeStep
            service={selectedService}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
        )}
        {step === 3 && (
          <CustomerInfoStep values={values} errors={errors} onChange={updateValue} />
        )}
        {step === 4 && selectedService && (
          <ConfirmStep
            service={selectedService}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            values={values}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="rounded-lg border border-[#2A2A2A] px-6 py-3 font-semibold text-white transition hover:border-[#DC2626] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Previous
        </button>

        {step < 4 && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!stepComplete}
            className="rounded-lg bg-[#DC2626] px-8 py-3 font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
