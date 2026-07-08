import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onNavigate: (id: string) => void;
}

const coverMeta = [
  "VLSI / ML / backend systems",
  "Gwalior, India",
  "Issue 01",
];

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="editorial-card cover-shadow grid gap-12 overflow-hidden px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-12"
        >
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-border/80 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Dhruv Verma
                </span>
                <span className="section-rule hidden flex-1 md:block" />
              </div>

              <div className="space-y-4">
                <p className="max-w-lg text-sm uppercase tracking-[0.38em] text-primary/85">
                  Student engineer, systems thinker, and the person who likes the backend part too.
                </p>
                <h1 className="max-w-4xl text-6xl font-semibold leading-[0.92] md:text-8xl">
                  A print-minded portfolio for someone building across silicon, models, and product systems.
                </h1>
              </div>

              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                I like hard problems with real-world edges: VLSI, ML, commerce flows, and the backend glue that
                keeps them from falling apart.
              </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <button
                onClick={() => onNavigate("projects")}
                className="inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-4 text-sm uppercase tracking-[0.25em] text-background transition hover:bg-primary hover:text-primary-foreground"
              >
                Open Selected Work
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Not trying to look like a startup site. More like a personal issue of a magazine that happens to know
                its way around chips, models, and APIs.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-border/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div className="space-y-5">
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

            <blockquote className="mt-10 border-l border-primary/50 pl-5 text-2xl font-display italic leading-tight text-foreground md:text-3xl">
              “I’m most interested in the part where research taste and production reality finally meet.”
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
