"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  follow: boolean;
  visible: boolean;
  onToggleFollow: () => void;
  onToggleVisible: () => void;
};

const round =
  "grid cursor-pointer place-items-center rounded-full border shadow-sm transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2";
const tip =
  "pointer-events-none absolute whitespace-nowrap rounded-full bg-[var(--gray-12)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] tracking-[0.04em] text-white opacity-0 shadow-sm transition-opacity duration-200";

function SubButton({
  open,
  x,
  y,
  delay,
  pressed,
  disabled,
  label,
  onClick,
  className = "",
  children,
}: {
  open: boolean;
  x: number;
  y: number;
  delay: number;
  pressed: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group/sub absolute left-1/2 top-1/2 ${className}`}
      style={{
        transform: open ? `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)` : "translate(-50%, -50%) scale(0.4)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: `transform 320ms cubic-bezier(.34,1.56,.64,1) ${open ? delay : 0}ms, opacity 200ms ease ${open ? delay : 0}ms`,
      }}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={pressed}
        aria-label={label}
        tabIndex={open ? 0 : -1}
        className={`${round} h-8 w-8 disabled:cursor-not-allowed disabled:opacity-40`}
        style={{
          borderColor: pressed ? "var(--accent)" : "var(--gray-4)",
          background: pressed ? "var(--accent-soft)" : "rgba(255,255,255,0.95)",
          color: pressed ? "var(--accent-strong)" : "var(--gray-11)",
        }}
      >
        {children}
      </button>
      <span className={`${tip} left-full top-1/2 ml-2.5 -translate-y-1/2 group-hover/sub:opacity-100 group-focus-within/sub:opacity-100`}>{label}</span>
    </div>
  );
}

/**
 * Top-left control for the background second brain. Hover or click the main button
 * and two smaller buttons fan out to the right: follow the cursor, and turn the
 * animation off / on.
 */
export function BrainControls({ follow, visible, onToggleFollow, onToggleVisible }: Props) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // A short grace period lets the pointer cross the gap to the smaller buttons.
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 280);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div ref={wrapRef} className="fixed left-6 top-6 z-40" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Control the second brain animation"
        className={`group/main ${round} relative h-10 w-10`}
        style={{
          borderColor: open || follow ? "var(--accent)" : "var(--gray-4)",
          background: follow ? "var(--accent-soft)" : "rgba(255,255,255,0.92)",
          color: open || follow ? "var(--accent-strong)" : "var(--gray-11)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c-2.8 2.4-2.8 13.6 0 16M12 4c2.8 2.4 2.8 13.6 0 16" />
          {!visible && <path d="M4 4l16 16" />}
        </svg>
        <span className={`${tip} left-0 top-full mt-2.5 ${open ? "" : "group-hover/main:opacity-100 group-focus-visible/main:opacity-100"}`}>
          Control the second brain animation
        </span>
      </button>

      <SubButton
        open={open}
        x={50}
        y={-20}
        delay={0}
        pressed={follow}
        disabled={!visible}
        label={follow ? "Stop following my cursor" : "Follow my cursor"}
        onClick={onToggleFollow}
        className="pointer-coarse:hidden motion-reduce:hidden"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M5 3.5l13.5 6.3-5.6 1.7-1.9 5.8z" />
        </svg>
      </SubButton>
      <SubButton
        open={open}
        x={52}
        y={14}
        delay={60}
        pressed={!visible}
        label={visible ? "Turn the animation off" : "Turn the animation on"}
        onClick={onToggleVisible}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
          <circle cx="12" cy="12" r="2.8" />
          {!visible && <path d="M4 4l16 16" />}
        </svg>
      </SubButton>
    </div>
  );
}
