import type { HighlightArt } from "@/content/types";
import { JOEY_MARK_PATH } from "./joeyMarkPath";
import { SecondBrainNetwork } from "./SecondBrainNetwork";

const fill = "absolute inset-0 h-full w-full object-cover";

/** The image half of a highlight card. Joey and Playi put the real logo over a cinematic backdrop. */
export function CardArt({ art, active }: { art: HighlightArt; active: boolean }) {
  if (art.kind === "network") return <SecondBrainNetwork active={active} />;

  if (art.kind === "image") {
    return (
      <img
        src={art.src}
        alt={art.alt}
        loading="lazy"
        decoding="async"
        className={`${fill} transition-transform duration-700 ease-out ${active ? "scale-[1.04]" : "scale-100"}`}
      />
    );
  }

  return (
    <>
      <img
        src={art.backdrop}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${fill} transition-transform duration-700 ease-out ${active ? "scale-[1.04]" : "scale-100"}`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {art.brand === "joey" ? (
          <span className="inline-flex items-center gap-3 drop-shadow-[0_1px_10px_rgba(251,250,246,0.7)]">
            <svg viewBox="0 0 512 512" className="h-14 w-14" aria-hidden>
              <path fill="#8F3720" fillRule="evenodd" d={JOEY_MARK_PATH} />
            </svg>
            <span className="font-[var(--font-jakarta)] text-[2.6rem] font-bold leading-none tracking-tight text-[#1c1b17]">Joey</span>
          </span>
        ) : (
          <span
            className="rounded-2xl border border-white/60 px-6 py-4 shadow-[0_10px_40px_-12px_rgba(20,40,20,0.45)] backdrop-blur-md"
            style={{ background: "rgba(253,250,245,0.86)" }}
          >
            <img src="/art/playi-logo.webp" alt="Playi" className="h-auto w-40 sm:w-44" />
          </span>
        )}
      </div>
    </>
  );
}
