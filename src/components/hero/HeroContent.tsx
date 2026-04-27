export default function HeroContent() {
  return (
    <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-4">
        Web Developer &amp; AI Engineer
      </p>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text leading-tight mb-6">
        Dave{" "}
        <span className="bg-gradient-to-r from-accent via-nebula to-cosmic-blue bg-clip-text text-transparent">
          Macarayo
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed">
        Building modern web applications and AI-integrated systems — LLM
        workflows, RAG pipelines, speech synthesis, biometrics, and computer
        vision.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#projects"
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-[--duration-base] hover:bg-accent-hover hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-md border border-accent px-6 py-3 text-sm font-semibold text-accent transition-all duration-[--duration-base] hover:bg-accent/10 hover:border-accent-hover hover:text-accent-hover"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
