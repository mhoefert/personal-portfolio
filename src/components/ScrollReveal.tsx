"use client";

import { useEffect } from "react";

/**
 * Subtle scroll reveal: elements marked `data-reveal` fade up into place the first
 * time they enter the bottom of the viewport. Sets `data-revealed` directly on the
 * element (an attribute React doesn't manage, so re-renders never undo it). The
 * motion itself lives in globals.css and is skipped for reduced-motion visitors.
 */
export function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
