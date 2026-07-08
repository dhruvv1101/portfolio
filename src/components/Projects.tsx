import { ExternalLink, Github } from "lucide-react";
import { Section } from "./Section";

const featuredProject = {
  title: "ChessFlow",
  deck: "A chess analysis product shaped around game flow, positional clarity, and practical improvement loops.",
  description:
    "Built to turn raw gameplay into something more readable, ChessFlow focuses on helping players understand why a game drifted, not just where the engine says they blundered.",
  tags: ["Python", "Analysis tooling", "Algorithms", "UX for learning"],
  github: "https://github.com/dhruvv1101",
};

const supportingProjects = [
  {
    title: "Study Buddy",
    category: "Student systems",
    description:
      "A productivity setup for structured study sessions, scheduling, and consistency nudges with automation in the loop.",
    tags: ["Streamlit", "Google APIs", "Scheduling", "Agentic flows"],
    github: "https://github.com/dhruvv1101",
  },
  {
    title: "Backend + systems work",
    category: "Operational thinking",
    description:
      "The throughline in my work lately has been backend logic that coordinates events, async tasks, and product-facing delivery cleanly.",
    tags: ["APIs", "Integrations", "Event flows", "Async jobs"],
    github: "https://github.com/dhruvv1101",
  },
];

export function Projects() {
  return (
    <Section
      id="projects"
      label="02 / Selected Work"
      title="A few things I’ve made, tuned, or thought through properly."
      kicker="I care less about having a huge list and more about showing range with some actual taste."
      intro="projects / experiments / systems"
      folio="Features"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="editorial-card grid gap-8 px-6 py-7 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5 border-b border-border/70 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <p className="folio-tag">Feature Story</p>
            <h3 className="text-4xl font-semibold md:text-5xl">{featuredProject.title}</h3>
            <p className="text-sm uppercase tracking-[0.25em] text-primary/80">{featuredProject.deck}</p>
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">{featuredProject.description}</p>
            <div className="flex flex-wrap gap-2">
              {featuredProject.tags.map((tag) => (
                <span key={tag} className="border border-border/80 px-3 py-2 text-sm text-foreground/85">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-5 text-sm uppercase tracking-[0.22em] text-muted-foreground">
              <a
                href={featuredProject.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                View Code
              </a>
              <span>More build notes available on request</span>
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          {supportingProjects.map((project, index) => (
            <article key={project.title} className="editorial-card px-6 py-7">
              <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
                <p className="folio-tag">{(index + 3).toString().padStart(2, "0")} / Supporting</p>
                <span className="text-sm text-muted-foreground">{project.category}</span>
              </div>
              <h3 className="text-3xl font-semibold">{project.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm text-foreground/80">
                    {tag}
                    <span className="ml-2 text-border">/</span>
                  </span>
                ))}
              </div>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-muted-foreground transition hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub
              </a>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
