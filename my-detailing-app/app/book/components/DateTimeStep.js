"use client";

import { useEffect, useState } from "react";
import Calendar from "./Calendar";

export default function DateTimeStep({
  service,
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setSlots([]);

    fetch(`/api/slots?date=${selectedDate}&duration=${service.durationMinutes}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError(data.error || "Unable to load available times.");
          return;
        }
        setSlots(data.slots || []);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load available times. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, service.durationMinutes]);

  function handleSelectDate(dateKey) {
    onSelectDate(dateKey);
    onSelectSlot(null);
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        Select Date &amp; Time
      </h2>
      <p className="mb-8 text-[#B3B3B3]">Pick a day that works, then lock in your window.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Calendar
          viewDate={viewDate}
          onViewDateChange={setViewDate}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />

        <div className="rounded-xl border border-[#2A2A2A] bg-[#171717] p-4 sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Available Times</h3>

          {!selectedDate && (
            <p className="text-sm text-[#B3B3B3]">Choose a date to see open time slots.</p>
          )}

          {selectedDate && loading && (
            <div className="flex items-center gap-3 text-sm text-[#B3B3B3]" role="status">
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-[#2A2A2A] border-t-[#DC2626]"
              />
              Checking availability...
            </div>
          )}

          {selectedDate && !loading && error && (
            <p role="alert" className="text-sm text-[#EF4444]">
              {error}
            </p>
          )}

          {selectedDate && !loading && !error && slots.length === 0 && (
            <p className="text-sm text-[#B3B3B3]">No open slots on this date. Try another day.</p>
          )}

          {selectedDate && !loading && !error && slots.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.startISO === slot.startISO;
                return (
                  <button
                    key={slot.startISO}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
                    aria-pressed={isSelected}
                    className={[
                      "rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                      isSelected
                        ? "border-[#DC2626] bg-[#DC2626] text-white shadow-[0_0_14px_rgba(220,38,38,0.45)]"
                        : "border-[#2A2A2A] text-white hover:-translate-y-0.5 hover:border-[#DC2626]",
                    ].join(" ")}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
