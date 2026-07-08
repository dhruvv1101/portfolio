import { Github } from "lucide-react";
import { useState } from "react";
import { Section } from "./Section";
import chessflowBishop from "@/assets/logos/chessflow-bishop.png";
import intentlensLogo from "@/assets/logos/intentlens-logo.png";
import kaggleLogo from "@/assets/logos/kaggle-logo.png";

const projects = [
  {
    id: "chessflow",
    title: "ChessFlow",
    category: "Analysis product",
    deck: "A chess analysis product shaped around game flow, positional clarity, and practical improvement loops.",
    description:
      "Built to turn raw gameplay into something more readable, ChessFlow focuses on helping players understand why a game drifted, not just where the engine says they blundered.",
    tags: ["Python", "Analysis tooling", "Algorithms", "UX for learning"],
    github: "https://github.com/dhruvv1101",
    logo: chessflowBishop,
  },
  {
    id: "study-buddy",
    title: "Study Buddy",
    category: "Student systems",
    deck: "A productivity setup for structured study sessions, scheduling, and consistency nudges with automation in the loop.",
    description:
      "Study Buddy is a planning-focused project built to make study sessions easier to structure, track, and revisit with a little automation helping in the background.",
    tags: ["Streamlit", "Google APIs", "Scheduling", "Agentic flows"],
    github: "https://github.com/dhruvv1101",
  },
  {
    id: "intentlens",
    title: "IntentLens",
    category: "Browser extension",
    deck: "A browser extension concept built around reading user intent faster and making the web feel more context-aware.",
    description:
      "IntentLens explores how a browser extension can surface intent, context, and useful cues directly in the browsing flow instead of forcing users to keep switching tabs and mental modes.",
    tags: ["Browser extension", "JavaScript", "UX", "Context-aware tooling"],
    github: "https://github.com/dhruvv1101",
    logo: intentlensLogo,
  },
  {
    id: "kaggle-health-risk",
    title: "Student Health Risk (Kaggle)",
    category: "Competition entry",
    deck: "My Kaggle run for Playground Series S6E7: Predicting Student Health Risk, built around balanced accuracy and pragmatic model blending.",
    description:
      "I approached the problem with feature engineering first, then a blend of CatBoost, pseudo-labeled CatBoost, and LightGBM. The pipeline adds ratio features, interaction features, categorical crosses, and class-weight tuning around the competition metric. My current best local balanced accuracy reached 0.94994.",
    tags: ["Kaggle", "CatBoost", "LightGBM", "Feature engineering", "Balanced accuracy"],
    github: "https://www.kaggle.com/competitions/playground-series-s6e7/data",
    logo: kaggleLogo,
  },
];

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <Section
      id="projects"
      label="02 / Selected Work"
      title="A few things I’ve made, tuned, or thought through properly."
      kicker="Click a project and it takes over the main spread. The layout stays magazine-like, but now it actually reacts."
      intro="projects / experiments / systems"
      folio="Features"
      backgroundText="projects / chessflow / study buddy / intentlens / kaggle / analysis / extension / machine learning"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <article className="editorial-card self-start grid gap-8 px-6 py-7 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5 border-b border-border/70 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <p className="folio-tag">Feature Story</p>
            <div className="flex items-center gap-3">
              {activeProject.logo && (
                <span className="flex h-12 w-12 items-center justify-center border border-border/80 bg-background/80 p-1.5">
                  <img src={activeProject.logo} alt="" className="h-full w-full object-contain" />
                </span>
              )}
              <h3 className="text-4xl font-semibold md:text-5xl">{activeProject.title}</h3>
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary/80">{activeProject.deck}</p>
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">{activeProject.description}</p>
            <div className="flex flex-wrap gap-2">
              {activeProject.tags.map((tag) => (
                <span key={tag} className="border border-border/80 px-3 py-2 text-sm text-foreground/85">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-5 text-sm uppercase tracking-[0.22em] text-muted-foreground">
              <a
                href={activeProject.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                View Code
              </a>
              <span>{activeProject.category}</span>
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          {projects.map((project, index) => {
            if (index === activeIndex) return null;

            return (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="editorial-card px-6 py-7 text-left transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-5 flex items-center justify-between border-b border-border/70 pb-4">
                <p className="folio-tag">{(index + 3).toString().padStart(2, "0")} / Supporting</p>
                <span className="text-sm text-muted-foreground">{project.category}</span>
              </div>
              <div className="flex items-center gap-3">
                {project.logo && (
                  <span className="flex h-10 w-10 items-center justify-center border border-border/80 bg-background/80 p-1.5">
                    <img src={project.logo} alt="" className="h-full w-full object-contain" />
                  </span>
                )}
                <h3 className="text-3xl font-semibold">{project.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-sm text-foreground/80">
                    {tag}
                    <span className="ml-2 text-border">/</span>
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-muted-foreground transition hover:text-foreground">
                Tap to feature
              </span>
            </button>
          )})}
        </div>
      </div>
    </Section>
  );
}
