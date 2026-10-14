export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-8 md:mb-10" data-reveal>
      <div className="flex items-center gap-3">
        <span className="h-px w-6 shrink-0" style={{ background: "var(--gray-6)" }} />
        <span className="font-[var(--font-mono)] text-[10px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.16em] text-[var(--gray-10)]">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-4 font-[var(--font-serif)] text-4xl leading-[1.04] tracking-[-0.01em] text-[var(--gray-12)] md:text-[2.7rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 font-[var(--font-serif)] text-xl italic text-[var(--gray-10)]">{subtitle}</p>
      )}
    </header>
  );
}
