import StaticStarfield from "./StaticStarfield";
import HeroContent from "./HeroContent";
import ScrollIndicator from "./ScrollIndicator";
import GalaxyMount from "./GalaxyMount";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg"
    >
      {/* Layer 0: static starfield — SSR, always visible; galaxy fades in on top in immersive mode */}
      <StaticStarfield />

      {/* Layer 1 (dynamic): galaxy canvas, immersive + no reduced-motion only */}
      <GalaxyMount />

      {/* Layer 1: radial vignette — transparent center, dark edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #000000 100%)",
        }}
      />

      {/* Layer 2: hero copy + CTAs */}
      <HeroContent />

      {/* Scroll cue */}
      <ScrollIndicator />
    </section>
  );
}
