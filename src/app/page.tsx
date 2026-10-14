import { BackgroundBrain } from "@/components/BackgroundBrain";
import { CapabilitySnapshot } from "@/components/CapabilitySnapshot";
import { Challenges } from "@/components/Challenges";
import { Experience } from "@/components/Experience";
import { Footer, ScrollTopButton } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectTile } from "@/components/ProjectTile";
import { SectionHeader } from "@/components/SectionHeader";
import { SectionNav } from "@/components/SectionNav";
import { AUTOMATIONS, PRODUCTS } from "@/content/projects";

/* Content lives in src/content; components only render it. */
export default function Portfolio() {
  return (
    <div className="relative z-[1] min-h-screen w-full overflow-x-hidden">
      <BackgroundBrain />
      <SectionNav />
      <Hero />

      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-24 px-6 pb-24 md:gap-32 md:px-10">
        <Highlights />

        <section id="products" className="scroll-mt-28">
          <SectionHeader eyebrow="Products" title="Things I've built end to end" subtitle="Full-stack products, from discovery to production" />
          <div className="flex flex-col gap-16 md:gap-20">
            {PRODUCTS.map((p, idx) => (
              <ProjectTile key={p.slug} p={p} reversed={idx % 2 === 1} />
            ))}
          </div>
        </section>

        <section id="automations" className="scroll-mt-28">
          <SectionHeader eyebrow="Automations & AI workflows" title="Systems that run my week" subtitle="Personal automations, second brains and AI workflows" />
          <div className="flex flex-col gap-16 md:gap-20">
            {AUTOMATIONS.map((p, idx) => (
              <ProjectTile key={p.slug} p={p} reversed={idx % 2 === 1} />
            ))}
          </div>
        </section>

        <Experience />
        <CapabilitySnapshot />
        <Challenges />
      </main>

      <Footer />
      <ScrollTopButton />
      <ScrollReveal />
    </div>
  );
}
