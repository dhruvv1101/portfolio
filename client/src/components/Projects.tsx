import { Section } from "./Section";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    id: "chessflow",
    title: "ChessFlow",
    description: "ChessFlow is an intelligent chess analysis platform designed to help players understand positional mistakes, tactical patterns, and game flow. The project focuses on transforming raw gameplay data into meaningful insights for skill improvement.",
    tags: ["Python", "Data Analysis", "Game Logic", "Algorithms"],
    github: "https://github.com/dhruv-verma/chessflow",
    link: "#",
    isFeatured: true,
  },
  {
    id: "study-buddy",
    title: "Study Buddy",
    description: "Study Buddy is a productivity-focused application aimed at helping students organize study sessions, track progress, and maintain consistency through structured planning and intelligent reminders.",
    tags: ["JavaScript", "Frontend Development", "Productivity Tools"],
    github: "https://github.com/dhruv-verma/study-buddy",
    link: "#",
    isFeatured: false,
  },
];

export function Projects() {
  return (
    <Section id="projects" className="bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Showcasing my journey through code and silicon.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="glass-card p-8 rounded-2xl flex flex-col group relative overflow-hidden"
          >
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            
            <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-muted text-muted-foreground border border-white/5">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <a 
                href={project.github} 
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" /> Code
              </a>
              {/* Optional Demo Link if available */}
              {project.link !== "#" && (
                <a 
                  href={project.link}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
