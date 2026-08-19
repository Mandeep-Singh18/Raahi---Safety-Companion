"use client";

import { useEffect, useRef } from "react";

interface AriaLiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * Invisible ARIA live region that announces dynamic updates to screen readers.
 * Use 'assertive' for urgent states (SOS, alert triggered).
 * Use 'polite' (default) for timer ticks and routine status changes.
 */
export function AriaLiveRegion({ message, politeness = "polite" }: AriaLiveRegionProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Force re-announcement by briefly clearing then setting text
  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = "";
    const timeout = setTimeout(() => {
      if (ref.current) ref.current.textContent = message;
    }, 50);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  );
}
