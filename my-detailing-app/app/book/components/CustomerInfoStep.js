"use client";

function Field({ label, name, value, onChange, error, type = "text", autoComplete }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={[
          "w-full rounded-lg border bg-[#111111] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/40",
          error ? "border-[#EF4444]" : "border-[#2A2A2A] focus:border-[#DC2626]",
        ].join(" ")}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1 text-xs text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CustomerInfoStep({ values, errors, onChange }) {
  function handleInput(event) {
    onChange(event.target.name, event.target.value);
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        Your Information
      </h2>
      <p className="mb-8 text-[#B3B3B3]">Tell us where and how to reach you.</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          name="customerName"
          value={values.customerName}
          onChange={handleInput}
          error={errors.customerName}
          autoComplete="name"
        />
        <Field
          label="Email"
          name="customerEmail"
          type="email"
          value={values.customerEmail}
          onChange={handleInput}
          error={errors.customerEmail}
          autoComplete="email"
        />
        <Field
          label="Phone Number"
          name="customerPhone"
          type="tel"
          value={values.customerPhone}
          onChange={handleInput}
          error={errors.customerPhone}
          autoComplete="tel"
        />
        <Field
          label="Vehicle Make"
          name="vehicleMake"
          value={values.vehicleMake}
          onChange={handleInput}
          error={errors.vehicleMake}
        />
        <Field
          label="Vehicle Model"
          name="vehicleModel"
          value={values.vehicleModel}
          onChange={handleInput}
          error={errors.vehicleModel}
        />
        <Field
          label="Vehicle Color"
          name="vehicleColor"
          value={values.vehicleColor}
          onChange={handleInput}
          error={errors.vehicleColor}
        />
      </div>

      <div className="mt-5">
        <Field
          label="Full Service Address"
          name="address"
          value={values.address}
          onChange={handleInput}
          error={errors.address}
          autoComplete="street-address"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="City"
          name="city"
          value={values.city}
          onChange={handleInput}
          error={errors.city}
          autoComplete="address-level2"
        />
        <Field
          label="ZIP Code"
          name="zip"
          value={values.zip}
          onChange={handleInput}
          error={errors.zip}
          autoComplete="postal-code"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-white">
          Special Instructions <span className="font-normal text-[#B3B3B3]">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={handleInput}
          placeholder="Gate code, parking notes, anything Don should know..."
          className="w-full rounded-lg border border-[#2A2A2A] bg-[#111111] px-4 py-2.5 text-white placeholder-[#6b6b6b] focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/40"
        />
      </div>

      <div className="mt-8 rounded-xl border border-[#DC2626]/40 bg-[#111111] p-5">
        <p className="font-bold text-white">
          Payment is collected AFTER the detailing service is completed.
        </p>
        <p className="mt-2 text-sm font-semibold text-[#B3B3B3]">Accepted Payment Methods:</p>
        <ul className="mt-1 space-y-1 text-sm text-[#B3B3B3]">
          <li>• Cash</li>
          <li>• Cash App</li>
          <li>• Venmo</li>
        </ul>
        <p className="mt-3 text-sm text-[#EF4444]">
          No credit card information is ever collected on this website.
        </p>
      </div>
    </div>
  );
}
