import type { HighlightArt } from "@/content/types";
import { JOEY_MARK_PATH } from "./joeyMarkPath";
import { SecondBrainNetwork } from "./SecondBrainNetwork";

const fill = "absolute inset-0 h-full w-full object-cover";

/* Frosted glass plate behind a logo: see-through enough to show the backdrop. */
function GlassPlate({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-2xl border border-white/50 px-5 py-2.5 shadow-[0_10px_36px_-14px_rgba(20,16,10,0.45)] backdrop-blur-md"
      style={{ background: "rgba(253,250,245,0.58)" }}
    >
      {children}
    </span>
  );
}

const GITHUB_MARK =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";

/** Per-image light effects layered over the slowly drifting artwork. */
function Effect({ effect }: { effect: "cycling" | "rail" | "workshop" }) {
  if (effect === "cycling") {
    // Sunrise glow breathing at the sun, top left.
    return (
      <span
        className="art-glow pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: "radial-gradient(circle at 7% 12%, rgba(255,170,80,0.55) 0%, rgba(255,140,60,0.18) 16%, transparent 34%)" }}
      />
    );
  }
  if (effect === "workshop") {
    // Lamplight from the open door, flickering gently.
    return (
      <span
        className="art-flicker pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: "radial-gradient(ellipse at 74% 42%, rgba(255,175,90,0.45) 0%, rgba(255,150,70,0.14) 22%, transparent 42%)" }}
      />
    );
  }
  // GitHub mark as the headlight on the single track at the vanishing point.
  return (
    <span className="art-headlight pointer-events-none absolute" style={{ left: "55%", top: "16.5%", width: "8.5%" }}>
      <span
        className="absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,170,80,0.65) 0%, rgba(255,130,40,0.25) 35%, transparent 70%)" }}
      />
      <svg viewBox="0 0 16 16" className="relative block h-auto w-full drop-shadow-[0_0_6px_rgba(255,190,110,0.95)]" aria-hidden>
        <path fill="#FFE7C2" d={GITHUB_MARK} />
      </svg>
    </span>
  );
}

/** The image half of a highlight card. Joey and Playi put the real logo over a cinematic backdrop. */
export function CardArt({ art, active }: { art: HighlightArt; active: boolean }) {
  if (art.kind === "network") return <SecondBrainNetwork active={active} />;

  const zoom = `absolute inset-0 transition-transform duration-700 ease-out ${active ? "scale-[1.04]" : "scale-100"}`;

  if (art.kind === "image") {
    return (
      <div className={zoom}>
        <div className={`absolute inset-0 ${art.effect ? (art.effect === "rail" ? "art-kenburns-b" : "art-kenburns-a") : ""}`}>
          <img src={art.src} alt={art.alt} loading="lazy" decoding="async" className={fill} />
          {art.effect && <Effect effect={art.effect} />}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={zoom}>
        <img src={art.backdrop} alt="" loading="lazy" decoding="async" className={fill} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <GlassPlate>
          {art.brand === "joey" ? (
            <span className="inline-flex items-center gap-2.5">
              <svg viewBox="0 0 512 512" className="h-11 w-11" aria-hidden>
                <path fill="#8F3720" fillRule="evenodd" d={JOEY_MARK_PATH} />
              </svg>
              <span className="font-[var(--font-jakarta)] text-[2.1rem] font-bold leading-none tracking-tight text-[#1c1b17]">Joey</span>
            </span>
          ) : (
            <img src="/art/playi-logo.webp" alt="Playi" className="h-auto w-36 sm:w-40" />
          )}
        </GlassPlate>
      </div>
    </>
  );
}
