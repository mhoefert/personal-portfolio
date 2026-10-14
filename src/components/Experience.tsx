import { EXPERIENCE } from "@/content/experience";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-28">
      <SectionHeader eyebrow="Experience" title="Where I've worked" subtitle="Product at Mitie, strategy at JLL" />
      {/* Cards are 6-row subgrids so the context, bullets and impact rows start level across both roles. */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
        {EXPERIENCE.map((role, i) => (
          <article
            key={role.company}
            data-reveal
            className="row-span-6 grid grid-rows-subgrid gap-0 rounded-[var(--card-radius)] border bg-white p-6 sm:p-8"
            style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)", "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
          >
            <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)]">
              {role.place} · {role.dates}
            </p>
            <h3 className="pt-3 font-[var(--font-serif)] text-[2rem] leading-[1.05] text-[var(--gray-12)]">{role.company}</h3>
            <p className="pt-1 font-[var(--font-serif)] text-lg italic text-[var(--gray-10)]">{role.title}</p>
            <p className="pt-4 text-[14.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">{role.context}</p>

            <ul className="flex flex-col gap-3 pt-5">
              {role.bullets.map((b) => (
                <li key={b.text} className="flex gap-3 text-[14.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                  <span>
                    {b.lead && <strong className="font-semibold text-[var(--gray-12)]">{b.lead} </strong>}
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-7">
              <div className="border-t pt-5" style={{ borderColor: "var(--gray-4)" }}>
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--gray-9)]">Impact</p>
                <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
                  {role.impact.map((m) => (
                    <div key={m.l} className="flex flex-col">
                      <dt className="font-[var(--font-serif)] text-[1.7rem] leading-none tabular-nums text-[var(--accent-strong)]">{m.v}</dt>
                      <dd className="mt-2 text-[13.5px] font-medium leading-snug text-[var(--gray-12)]">{m.l}</dd>
                      <dd className="mt-1 text-[12.5px] leading-snug text-[var(--gray-10)] [text-wrap:pretty]">{m.sub}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
