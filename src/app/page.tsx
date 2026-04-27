import HeroSection from "@/components/hero/HeroSection";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import MissionLogs from "@/components/sections/MissionLogs";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <About />
      <Skills />
      <Projects />
      <MissionLogs />
      <Contact />
    </>
  );
}
