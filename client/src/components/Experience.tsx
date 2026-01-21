import { Section } from "./Section";
import { Briefcase } from "lucide-react";

export function Experience() {
  return (
    <Section id="experience">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
          Professional Journey
        </h2>

        <div className="relative border-l-2 border-primary/20 ml-6 md:ml-0 md:pl-8 space-y-12">
          {/* Timeline Item */}
          <div className="relative pl-8 md:pl-0">
            {/* Dot */}
            <div className="absolute -left-[9px] md:-left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-[0_0_0_4px_rgba(176,137,104,0.2)]" />
            
            <div className="glass-card p-6 rounded-2xl hover:border-primary/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Vocational Trainee</h3>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> HAL Korwa (Avionics Division)
                  </p>
                </div>
                <span className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
                  Summer 2024
                </span>
              </div>
              
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>Gained hands-on exposure to avionics systems and flight control electronics.</li>
                <li>Studied the manufacturing and testing processes of critical navigation sensors.</li>
                <li>Collaborated with senior engineers to understand legacy system maintenance.</li>
              </ul>
            </div>
          </div>
          
          {/* More items can be added here following the same structure */}
        </div>
      </div>
    </Section>
  );
}
