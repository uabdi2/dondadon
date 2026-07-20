"use client";

import { useMemo } from "react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar({ viewDate, onViewDateChange, selectedDate, onSelectDate }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const weeks = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
    while (cells.length % 7 !== 0) cells.push(null);

    const result = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [viewDate]);

  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  function goToPreviousMonth() {
    onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  }
  function goToNextMonth() {
    onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }

  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#171717] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className="rounded-lg border border-[#2A2A2A] p-2 text-white transition hover:border-[#DC2626] hover:text-[#EF4444] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <h3 className="text-lg font-bold tracking-wide text-white">{monthLabel}</h3>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="rounded-lg border border-[#2A2A2A] p-2 text-white transition hover:border-[#DC2626] hover:text-[#EF4444]"
        >
          ›
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-[#B3B3B3]">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week, wi) =>
          week.map((date, di) => {
            if (!date) return <div key={`${wi}-${di}`} />;
            const dateKey = toDateKey(date);
            const isPast = startOfDay(date) < today;
            const isSunday = date.getDay() === 0;
            const disabled = isPast || isSunday;
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={dateKey}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(dateKey)}
                aria-pressed={isSelected}
                aria-label={date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                className={[
                  "aspect-square rounded-lg text-sm font-medium transition-all duration-150",
                  disabled
                    ? "cursor-not-allowed border border-transparent text-[#4a4a4a]"
                    : "border text-white hover:-translate-y-0.5 hover:border-[#DC2626] hover:shadow-[0_0_12px_rgba(220,38,38,0.35)]",
                  isSelected
                    ? "border-2 border-[#DC2626] bg-[#DC2626]/20 text-white shadow-[0_0_14px_rgba(220,38,38,0.45)]"
                    : !disabled && "border-[#2A2A2A]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
