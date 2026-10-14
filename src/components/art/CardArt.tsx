import type { HighlightArt } from "@/content/types";
import { AutomationEngineFlow } from "./AutomationEngineFlow";
import { CyclingCoachFlow } from "./CyclingCoachFlow";
import { JOEY_MARK_PATH } from "./joeyMarkPath";
import { OpenSlotArt } from "./OpenSlotArt";
import { SecondBrainNetwork } from "./SecondBrainNetwork";

const SCENES = {
  network: SecondBrainNetwork,
  cycling: CyclingCoachFlow,
  engine: AutomationEngineFlow,
  open: OpenSlotArt,
};

/** The image half of a highlight card: an animated scene, or a real logo over a cinematic backdrop. */
export function CardArt({ art, active }: { art: HighlightArt; active: boolean }) {
  if (art.kind === "scene") {
    const Scene = SCENES[art.scene];
    return <Scene active={active} />;
  }

  return (
    <>
      <div className={`absolute inset-0 transition-transform duration-700 ease-out ${active ? "scale-[1.04]" : "scale-100"}`}>
        <img src={art.backdrop} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Same see-through plate, same size, for both logos. */}
        <span
          className="flex h-[66px] w-[208px] items-center justify-center rounded-2xl border border-white/50 shadow-[0_10px_36px_-14px_rgba(20,16,10,0.45)] backdrop-blur-md"
          style={{ background: "rgba(253,250,245,0.58)" }}
        >
          {art.brand === "joey" ? (
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 512 512" className="h-11 w-11" aria-hidden>
                <path fill="#8F3720" fillRule="evenodd" d={JOEY_MARK_PATH} />
              </svg>
              <span className="font-[var(--font-jakarta)] text-[2rem] font-bold leading-none tracking-tight text-[#1c1b17]">Joey</span>
            </span>
          ) : (
            <img src="/art/playi-logo.webp" alt="Playi" className="h-11 w-auto" />
          )}
        </span>
      </div>
    </>
  );
}
