import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
}: SectionProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "relative overflow-hidden border-t border-border/80 px-4 py-20 md:py-28",
        variant === "muted" && "bg-muted/40",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={cn("mx-auto max-w-7xl", contentClassName)}
      >
        {(label || title || kicker || intro || folio) && (
          <div className="mb-12 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="max-w-3xl">
              {label && (
                <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">
                  {label}
                </p>
              )}
              {title && (
                <h2 className="max-w-3xl text-4xl font-semibold leading-none text-foreground md:text-6xl">
                  {title}
                </h2>
              )}
              {kicker && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {kicker}
                </p>
              )}
              {intro && (
                <p className="mt-4 max-w-2xl text-sm uppercase tracking-[0.22em] text-primary/80">
                  {intro}
                </p>
              )}
            </div>
            {folio && (
              <div className="justify-self-start border border-border/80 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground md:justify-self-end">
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
