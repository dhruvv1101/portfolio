import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TypewriterBackdrop } from "./TypewriterBackdrop";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  contentClassName?: string;
  delay?: number;
  label?: string;
  kicker?: string;
  folio?: string;
  title?: string;
  intro?: string;
  variant?: "default" | "muted";
  backgroundText?: string;
}

export function Section({
  children,
  id,
  className,
  contentClassName,
  delay = 0,
  label,
  kicker,
  folio,
  title,
  intro,
  variant = "default",
  backgroundText,
}: SectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
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
    <section 
      ref={sectionRef}
      id={id} 
      className={cn(
        "aging-paper relative overflow-hidden border-t border-border/80 px-4 py-16 md:py-28",
        isReading && "is-reading",
        variant === "muted" && "bg-muted/40",
        className
      )}
    >
      {backgroundText && <TypewriterBackdrop text={backgroundText} />}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={cn("mx-auto max-w-7xl", contentClassName)}
      >
        {(label || title || kicker || intro || folio) && (
          <div className="mb-10 grid gap-4 md:mb-12 md:gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="max-w-3xl">
              {label && (
                <p className="fluid-label mb-3 font-mono uppercase text-muted-foreground">
                  {label}
                </p>
              )}
              {title && (
                <h2 className="fluid-section-title max-w-3xl font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {kicker && (
                <p className="fluid-lead mt-4 max-w-2xl text-muted-foreground md:mt-5">
                  {kicker}
                </p>
              )}
              {intro && (
                <p className="mt-4 max-w-2xl text-[0.78rem] uppercase tracking-[0.18em] text-primary/80 md:text-sm md:tracking-[0.22em]">
                  {intro}
                </p>
              )}
            </div>
            {folio && (
              <div className="justify-self-start border border-border/80 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground md:justify-self-end md:text-[0.68rem] md:tracking-[0.3em]">
                {folio}
              </div>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
