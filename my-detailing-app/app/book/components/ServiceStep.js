"use client";

export default function ServiceStep({ services, selectedSlug, onSelect }) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        Choose Your Service
      </h2>
      <p className="mb-8 text-[#B3B3B3]">
        Premium mobile detailing packages, brought straight to your driveway.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = service.slug === selectedSlug;
          return (
            <button
              key={service.slug}
              type="button"
              onClick={() => onSelect(service.slug)}
              aria-pressed={isSelected}
              className={[
                "group flex h-full flex-col rounded-xl border bg-[#171717] p-6 text-left transition-all duration-200",
                "hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)]",
                isSelected
                  ? "border-[#DC2626] shadow-[0_0_25px_rgba(220,38,38,0.3)]"
                  : "border-[#2A2A2A] hover:border-[#DC2626]",
              ].join(" ")}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <span className="whitespace-nowrap text-2xl font-black text-[#EF4444]">
                  ${service.price}
                </span>
              </div>

              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#DC2626]">
                {service.durationLabel}
              </p>
              <p className="mb-4 text-sm text-[#B3B3B3]">{service.description}</p>

              <ul className="mt-auto space-y-1.5 text-sm text-[#B3B3B3]">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#DC2626]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#2A2A2A] bg-[#111111] p-5">
        <span className="text-2xl" aria-hidden="true">
          🚗
        </span>
        <div>
          <p className="font-bold text-white">Mobile Service — We come to you!</p>
          <p className="text-sm text-[#B3B3B3]">
            All we need is access to your driveway or parking space.
          </p>
        </div>
      </div>
    </div>
  );
}
