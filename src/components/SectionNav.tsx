"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "highlights", label: "Highlights" },
  { id: "products", label: "Products" },
  { id: "automations", label: "Automations & AI workflows" },
  { id: "experience", label: "Career work experience" },
  { id: "challenges", label: "Challenges" },
];

/**
 * Small, subtle section nav on the left edge. Appears once you scroll past the hero,
 * marks the section you're in, and shows labels on hover (the active label stays
 * visible on very wide screens, where there's room beside the content).
 */
export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    // The section crossing the middle of the viewport is the active one.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={`fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 lg:block ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ul className="group/nav flex flex-col gap-1">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                aria-current={on ? "location" : undefined}
                className="flex cursor-pointer items-center gap-2.5 py-1.5 focus-visible:outline-none"
              >
                <span
                  className="h-[2px] rounded-full transition-all duration-300"
                  style={{ width: on ? 22 : 10, background: on ? "var(--accent)" : "var(--gray-7)" }}
                />
                <span
                  className={`whitespace-nowrap rounded-full bg-[var(--gray-1)]/85 px-2 py-0.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm transition-opacity duration-300 group-hover/nav:opacity-100 group-focus-within/nav:opacity-100 ${
                    on ? "text-[var(--gray-11)] opacity-0 min-[1600px]:opacity-100" : "text-[var(--gray-9)] opacity-0"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
