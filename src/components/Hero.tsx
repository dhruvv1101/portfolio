import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TypewriterBackdrop } from "./TypewriterBackdrop";
import { KioMascot } from "./KioMascot";

interface HeroProps {
  onNavigate: (id: string) => void;
}

const coverMeta = [
  "VLSI / ML / Backend Systems",
  "Gwalior, India",
  "Issue 01",
];

const backgroundText = "portfolio showcase / projects / research / open source / systems / design / engineering";

export function Hero({ onNavigate }: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReading(entry.isIntersecting);
      },
      { threshold: 0.55 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className={`aging-paper relative overflow-hidden px-4 pb-14 pt-24 md:pb-24 md:pt-32 ${isReading ? "is-reading" : ""}`}>
      <TypewriterBackdrop text={backgroundText} />

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden="true"
          className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 18, -8, 0], y: [0, 20, 10, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute right-[12%] top-40 h-56 w-56 rounded-full bg-accent/12 blur-3xl"
          animate={{ x: [0, -16, 12, 0], y: [0, -18, 8, 0], scale: [1, 0.94, 1.06, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-primary/8 blur-3xl"
          animate={{ x: [0, 14, -10, 0], y: [0, -12, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="editorial-card cover-shadow grid gap-10 overflow-hidden px-5 py-6 sm:px-6 sm:py-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:px-10 md:py-12"
        >
          <div className="flex flex-col justify-between gap-8 md:gap-10">
            <div className="space-y-5 md:space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-border/80 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground md:text-[0.68rem] md:tracking-[0.3em]">
                  Dhruv Verma
                </span>
                <span className="section-rule hidden flex-1 md:block" />
              </div>

              <div className="space-y-4">
                <p className="max-w-lg text-[0.78rem] uppercase tracking-[0.2em] text-primary/85 sm:text-sm sm:tracking-[0.3em] md:tracking-[0.38em]">
                  Showcase portfolio / work so far / systems, product, and engineering notes.
                </p>
                <h1 className="fluid-hero-title max-w-4xl font-semibold">
                  I use this portfolio as a running record of the work, projects, and technical ground I’ve covered so far.
                </h1>
              </div>

              <p className="fluid-lead max-w-2xl text-muted-foreground">
                I use this showcase to bring together what I have built, explored, and improved so far across VLSI,
                machine learning, backend systems, browser tooling, and competition work.
              </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <button
                onClick={() => onNavigate("projects")}
                className="inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-5 py-3 text-[0.75rem] uppercase tracking-[0.22em] text-background transition hover:bg-primary hover:text-primary-foreground sm:w-auto sm:px-6 sm:py-4 sm:text-sm sm:tracking-[0.25em]"
              >
                Open Selected Work
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                I wanted this to feel thoughtful, tactile, and personal, with enough structure to show how I think about
                systems, design, and engineering work.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-border/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div className="space-y-5">
              <KioMascot />
              <p className="folio-tag">Cover Notes</p>
              <div className="grid gap-4 text-sm text-muted-foreground">
                {coverMeta.map((item, index) => (
                  <div key={item} className="flex items-center gap-4 border-b border-border/70 pb-4">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary/80">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="mt-8 border-l border-primary/50 pl-4 text-[1.45rem] font-display italic leading-tight text-foreground sm:text-[1.65rem] md:mt-10 md:pl-5 md:text-3xl">
              “I’m most interested in the part where research taste and production reality finally meet.”
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
