"use client";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#2A2A2A] pb-3 last:border-0 last:pb-0">
      <dt className="text-[#B3B3B3]">{label}</dt>
      <dd className="text-right font-semibold text-white">{value}</dd>
    </div>
  );
}

export default function ConfirmStep({
  service,
  selectedDate,
  selectedSlot,
  values,
  onSubmit,
  submitting,
  submitError,
}) {
  const formattedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const vehicleSummary =
    [values.vehicleColor, values.vehicleMake, values.vehicleModel].filter(Boolean).join(" ") || "—";

  return (
    <div>
      <h2 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        Confirm Your Appointment
      </h2>
      <p className="mb-8 text-[#B3B3B3]">Review the details below before requesting your slot.</p>

      <div className="rounded-xl border border-[#2A2A2A] bg-[#171717] p-6">
        <dl className="space-y-3 text-sm">
          <Row label="Service" value={service.name} />
          <Row label="Price" value={`$${service.price}`} />
          <Row label="Duration" value={service.durationLabel} />
          <Row label="Date" value={formattedDate} />
          <Row label="Time" value={selectedSlot?.label} />
          <Row label="Name" value={values.customerName} />
          <Row label="Email" value={values.customerEmail} />
          <Row label="Phone" value={values.customerPhone} />
          <Row label="Address" value={`${values.address}, ${values.city}, NE ${values.zip}`} />
          <Row label="Vehicle" value={vehicleSummary} />
          {values.notes && <Row label="Notes" value={values.notes} />}
        </dl>
      </div>

      {submitError && (
        <p role="alert" className="mt-6 text-sm font-semibold text-[#EF4444]">
          {submitError}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#DC2626] px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#B91C1C] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting && (
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
        )}
        {submitting ? "Submitting..." : "Request Appointment"}
      </button>
    </div>
  );
}
