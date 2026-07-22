export default function Logo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 236 40"
      className={className}
      role="img"
      aria-label="Don's Professional Car Detailing"
    >
      {/* Monogram: concentric rings echo a buffing pad, not a literal car icon */}
      <g transform="translate(1, 2)">
        <circle cx="18" cy="18" r="17" fill="none" stroke="#b8b8b8" strokeWidth="1" opacity="0.8" />
        <circle cx="18" cy="18" r="11.5" fill="none" stroke="#b8b8b8" strokeWidth="0.6" opacity="0.5" />
        <text
          x="18"
          y="24.5"
          textAnchor="middle"
          fill="#f5f5f5"
          fontStyle="italic"
          fontWeight="600"
          fontSize="15"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          D
        </text>
      </g>

      <text
        x="46"
        y="27"
        fill="#f5f5f5"
        fontStyle="italic"
        fontWeight="500"
        fontSize="25"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Don&rsquo;s
      </text>

      <text
        x="47"
        y="38"
        fill="#b8b8b8"
        fontWeight="500"
        fontSize="6.5"
        letterSpacing="2.6"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        PROFESSIONAL DETAILING
      </text>
    </svg>
  );
}
