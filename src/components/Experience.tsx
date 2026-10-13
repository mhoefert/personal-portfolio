import { EXPERIENCE } from "@/content/experience";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-28">
      <SectionHeader eyebrow="Experience" title="Where I've worked" subtitle="Product at Mitie, strategy at JLL" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {EXPERIENCE.map((role) => (
          <article
            key={role.company}
            className="flex flex-col rounded-[var(--card-radius)] border bg-white p-6 sm:p-8"
            style={{ borderColor: "var(--gray-4)", boxShadow: "var(--float-shadow)" }}
          >
            <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--gray-10)]">
              {role.place} · {role.dates}
            </p>
            <h3 className="mt-3 font-[var(--font-serif)] text-[2rem] leading-[1.05] text-[var(--gray-12)]">{role.company}</h3>
            <p className="mt-1 font-[var(--font-serif)] text-lg italic text-[var(--gray-10)]">{role.title}</p>
            <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--gray-11)] [text-wrap:pretty]">{role.context}</p>

            <ul className="mt-5 flex flex-col gap-3">
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

            <div className="mt-auto pt-6">
              <div className="flex items-baseline gap-4 border-t pt-5" style={{ borderColor: "var(--gray-4)" }}>
                <span className="font-[var(--font-serif)] text-[2rem] leading-none tabular-nums text-[var(--accent-strong)]">{role.stat.v}</span>
                <span className="font-[var(--font-mono)] text-[10.5px] uppercase leading-snug tracking-[0.12em] text-[var(--gray-10)]">{role.stat.l}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
