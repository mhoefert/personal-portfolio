import { PROFILE } from "@/content/profile";
import { LinkedInIcon, MailIcon } from "./icons";

const button =
  "group/contact relative grid h-11 w-11 place-items-center rounded-full border bg-white text-[var(--gray-11)] transition-colors duration-200 hover:text-[var(--accent-strong)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2";
const tooltip =
  "pointer-events-none absolute bottom-full left-0 mb-2.5 translate-y-1 whitespace-nowrap rounded-full bg-[var(--gray-12)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] tracking-[0.04em] text-white opacity-0 shadow-sm transition-all duration-200 group-hover/contact:translate-y-0 group-hover/contact:opacity-100 group-focus-visible/contact:translate-y-0 group-focus-visible/contact:opacity-100";

/** Email + LinkedIn icon buttons. The email button shows the address on hover/focus. */
export function ContactLinks() {
  return (
    <div className="flex items-center gap-3">
      <a
        href={`mailto:${PROFILE.email}`}
        aria-label={`Email ${PROFILE.email}`}
        className={button}
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
      >
        <MailIcon />
        <span className={tooltip}>{PROFILE.email}</span>
      </a>
      <a
        href={PROFILE.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile"
        className={button}
        style={{ borderColor: "var(--gray-4)", boxShadow: "var(--card-shadow)" }}
      >
        <LinkedInIcon />
        <span className={tooltip}>LinkedIn</span>
      </a>
    </div>
  );
}
