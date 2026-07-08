import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  links: Array<{ id: string; name: string }>;
  onNavigate: (id: string) => void;
}

export function Navigation({ links, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(links[0]?.id ?? "");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleSection?.target.id) {
          setActiveId(visibleSection.target.id);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -40% 0px" }
    );

    links.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [links]);

  const handleNavigate = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "border-b border-border/70 bg-background/92 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => handleNavigate("about")}
            className="text-left text-3xl font-display font-semibold leading-none text-foreground transition-colors hover:text-primary"
          >
            DV.
            <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.34em] text-muted-foreground">
              personal issue
            </span>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            {links.map((link, index) => {
              const isActive = activeId === link.id;
              const distance = hoveredIndex === null ? 99 : Math.abs(hoveredIndex - index);
              const scale = hoveredIndex === null ? 1 : distance === 0 ? 1.14 : distance === 1 ? 1.08 : 1.02;

              return (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  animate={{ scale, y: hoveredIndex === index ? -4 : 0 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.5 }}
                  className={`rounded-full border px-4 py-2 text-sm transition-all ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  <span className="mr-2 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-primary/75">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  {link.name}
                </motion.button>
              );
            })}
          </div>

          <button className="text-foreground md:hidden" onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-4 top-24 z-40 border border-border/80 bg-card/95 p-6 shadow-[0_20px_40px_rgba(40,32,24,0.12)] md:hidden"
          >
            <div className="flex flex-col gap-3">
              {links.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className="flex items-center justify-between border-b border-border/70 pb-3 text-left last:border-b-0 last:pb-0"
                >
                  <span className="text-lg text-foreground">{link.name}</span>
                  <span className="folio-tag">{(index + 1).toString().padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
