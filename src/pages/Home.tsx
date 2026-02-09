import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { CodingProfiles } from "@/components/CodingProfiles";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        document.documentElement.classList.toggle('darker-mode');
        const isDarker = document.documentElement.classList.contains('darker-mode');
        
        toast({
          title: isDarker ? "Darker Mode Activated 🍫" : "Standard Mode Restored ☕",
          description: isDarker ? "Enjoy the rich dark chocolate theme!" : "Back to the warm coffee blend.",
          duration: 2000,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CodingProfiles />
        <Experience />
        <Contact />
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm bg-background border-t border-white/5">
        <p>© {new Date().getFullYear()} Dhruv Verma. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}
