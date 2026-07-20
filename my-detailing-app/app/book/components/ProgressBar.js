"use client";

const STEPS = ["Service", "Date & Time", "Your Info", "Confirm"];

export default function ProgressBar({ currentStep }) {
  const percent = (currentStep / STEPS.length) * 100;

  return (
    <div className="mb-10">
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#DC2626] to-[#EF4444] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="flex justify-between text-xs sm:text-sm">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <li
              key={label}
              aria-current={isActive ? "step" : undefined}
              className={[
                "font-semibold uppercase tracking-wide transition-colors",
                isActive || isComplete ? "text-[#EF4444]" : "text-[#B3B3B3]",
              ].join(" ")}
            >
              {stepNumber}. {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
