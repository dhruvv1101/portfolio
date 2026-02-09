import { Section } from "./Section";
import { GraduationCap, Brain, Laptop } from "lucide-react";

export function About() {
  return (
    <Section id="about" className="bg-muted/30">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            About Me
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              I am a pre-final year student at <span className="text-primary font-semibold">ABV-IIITM Gwalior</span>,
              pursuing a B.Tech in Electrical and Electronics Engineering (2023-2027).
            </p>
            <p>
              My journey lies at the intersection of core electronics and modern computing. 
              I thrive on solving complex problems, whether it's optimizing a VLSI circuit 
              or designing an efficient ML algorithm.
            </p>
            <p>
              When I'm not coding or soldering, you can find me exploring the latest research 
              in AI hardware acceleration or contributing to open-source projects.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors duration-300">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Education</h3>
              <p className="text-primary font-medium">B.Tech in EEE</p>
              <p className="text-sm text-muted-foreground">ABV-IIITM Gwalior (2023 - 2027)</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors duration-300">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Interests</h3>
              <p className="text-muted-foreground">
                Artificial Intelligence, Machine Learning, VLSI Design, Research & Development
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors duration-300">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Goals</h3>
              <p className="text-muted-foreground">
                Building scalable, intelligent systems that solve real-world hardware challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
