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
          {/* GSSoC Mentor */}
          <div className="relative pl-8 md:pl-0">
            <div className="absolute -left-[9px] md:-left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-[0_0_0_4px_rgba(176,137,104,0.2)]" />
            
            <div className="glass-card p-6 rounded-2xl hover:border-primary/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Open Source Mentor</h3>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> GirlScript Summer of Code (Karbon & Datasentience)
                  </p>
                </div>
                <span className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
                  2024
                </span>
              </div>
              
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>Mentored students in open-source development for projects at Karbon and Datasentience.</li>
                <li>Conducted code reviews and provided architectural guidance to ensure high-quality contributions.</li>
                <li>Facilitated community engagement and helped contributors navigate complex codebases.</li>
              </ul>
            </div>
          </div>

          {/* Hacktoberfest */}
          <div className="relative pl-8 md:pl-0">
            <div className="absolute -left-[9px] md:-left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-[0_0_0_4px_rgba(176,137,104,0.2)]" />
            
            <div className="glass-card p-6 rounded-2xl hover:border-primary/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Open Source Contributor</h3>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Hacktoberfest
                  </p>
                </div>
                <span className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full w-fit">
                  Oct 2024
                </span>
              </div>
              
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>Contributed to multiple open-source repositories in the AI/ML and Web Development domains.</li>
                <li>Resolved critical bugs and implemented new features, adhering to strict documentation standards.</li>
              </ul>
            </div>
          </div>

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
