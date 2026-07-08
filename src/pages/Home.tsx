import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { CodingProfiles } from "@/components/CodingProfiles";
import { useToast } from "@/hooks/use-toast";

const sections = [
  { id: "about", name: "More On Me" },
  { id: "skills", name: "What I Work With" },
  { id: "projects", name: "Selected Work" },
  { id: "coding", name: "On The Internet" },
  { id: "experience", name: "Things I've Built" },
  { id: "contact", name: "Let's Talk" },
];

export default function Home() {
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const [isPageTurning, setIsPageTurning] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  const sectionMap = useMemo(
    () => Object.fromEntries(sections.map((section) => [section.id, section.name])),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d") {
        document.documentElement.classList.toggle("darker-mode");
        const isDarker = document.documentElement.classList.contains("darker-mode");

        toast({
          title: isDarker ? "After Hours Mode" : "Day Edition Restored",
          description: isDarker
            ? "Switched the site into its darker print run."
            : "Back to the lighter editorial palette.",
          duration: 2000,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    []
  );

  const navigateToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    if (reduceMotion) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
    setIsPageTurning(true);

    timeoutsRef.current.push(
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 220)
    );

    timeoutsRef.current.push(
      window.setTimeout(() => {
        setIsPageTurning(false);
      }, 760)
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground paper-grain">
      <Navigation links={sections} onNavigate={navigateToSection} />

      <AnimatePresence>
        {isPageTurning && (
          <motion.div
            aria-hidden="true"
            initial={{ x: "100%", rotate: -8, skewY: 0 }}
            animate={{ x: "0%", rotate: -2, skewY: -1 }}
            exit={{ x: "-12%", opacity: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-y-0 right-0 z-[60] hidden w-[68vw] origin-right page-turn-gradient shadow-[-36px_0_80px_rgba(57,45,34,0.24)] md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[rgba(109,88,66,0.18)] via-[rgba(255,255,255,0.5)] to-transparent" />
            <div className="absolute inset-0 border-l border-[rgba(92,72,54,0.14)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero onNavigate={navigateToSection} />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <CodingProfiles />
        <Contact />
      </main>

      <footer className="border-t border-border/80 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="folio-tag">Dhruv Verma / personal issue / {new Date().getFullYear()}</p>
          <p className="text-sm text-muted-foreground">
            Built with React, Tailwind, and a better sense of pacing.
          </p>
          <p className="hidden text-sm text-muted-foreground md:block">
            {Object.keys(sectionMap).length.toString().padStart(2, "0")} sections
          </p>
        </div>
      </footer>
    </div>
  );
}
