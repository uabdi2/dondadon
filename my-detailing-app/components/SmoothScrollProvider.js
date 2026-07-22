"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScrollProvider({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.11,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
