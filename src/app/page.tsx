import HeroSection from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />

      <section
        id="about"
        aria-label="About"
        className="scroll-mt-20 py-24 px-6"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6">
            Who I Am
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Content coming soon.
          </p>
        </div>
      </section>

      <section
        id="skills"
        aria-label="Skills"
        className="scroll-mt-20 py-24 px-6 bg-surface"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6">
            What I Build With
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Content coming soon.
          </p>
        </div>
      </section>

      {/* Projects — Phase 06 */}
      <section
        id="projects"
        aria-label="Projects"
        className="scroll-mt-20 py-24 px-6"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">
            Projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6">
            Selected Work
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Content coming soon — Phase 06.
          </p>
        </div>
      </section>

      <section
        id="contact"
        aria-label="Contact"
        className="scroll-mt-20 py-24 px-6 bg-surface"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6">
            Get in Touch
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            Content coming soon.
          </p>
        </div>
      </section>
    </>
  );
}
