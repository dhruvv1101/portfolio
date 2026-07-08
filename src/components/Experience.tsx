import { Briefcase } from "lucide-react";
import { Section } from "./Section";

const experiences = [
  {
    role: "Software Intern",
    org: "Curefit",
    timeline: "May 2026 - July 2026",
    summary:
      "Assigned backend-heavy work across customer feedback flows and invoice-system exploration, with emphasis on real integrations instead of isolated toy modules.",
    bullets: [
      "Worked on CSAT flow logic for post-purchase and post-delivery journeys, tracing how feedback links are generated, dispatched, and mapped back into product systems.",
      "Studied and contributed around backend services, async/event-driven flow design, internal APIs, and the integration path between commerce systems and feedback tooling.",
      "Worked on invoice-related system design with Uniware in the loop, focusing on how shipment invoices can be fetched, tracked, and exposed cleanly through backend workflows.",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "TypeScript",
      "Shopify",
      "Uniware",
      "LimeChat",
      "APIs",
      "async flows",
    ],
  },
  {
    role: "Open Source Mentor",
    org: "GirlScript Summer of Code (Karbon & Datasentience)",
    timeline: "2024",
    summary: "Mentored contributors and helped keep open-source work readable, reviewable, and actually shippable.",
    bullets: [
      "Guided contributors across code reviews, structure, and implementation tradeoffs.",
      "Helped students navigate unfamiliar codebases without losing momentum.",
    ],
    stack: ["mentorship", "reviews", "architecture guidance"],
  },
  {
    role: "Vocational Trainee",
    org: "HAL Korwa (Avionics Division)",
    timeline: "Summer 2024",
    summary: "Hands-on exposure to avionics systems and the practical engineering around critical electronic hardware.",
    bullets: [
      "Observed manufacturing and testing processes for navigation-related systems.",
      "Learned how reliability and legacy maintenance shape engineering decisions in hardware environments.",
    ],
    stack: ["avionics", "electronics", "systems exposure"],
  },
];

export function Experience() {
  return (
    <Section
      id="experience"
      label="03 / Things I've Built"
      title="Proof that I like work with actual moving parts."
      kicker="The common thread here is not one domain. It is the habit of following a system all the way through."
      intro="backend / systems / product reality"
      folio="Timeline"
      variant="muted"
      contentClassName="max-w-6xl"
    >
      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <article
            key={`${experience.org}-${experience.role}`}
            className="editorial-card grid gap-6 px-6 py-7 md:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="border-b border-border/70 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <p className="folio-tag mb-4">{(index + 1).toString().padStart(2, "0")} / Entry</p>
              <h3 className="text-3xl font-semibold md:text-4xl">{experience.role}</h3>
              <p className="mt-3 flex items-center gap-2 text-primary">
                <Briefcase className="h-4 w-4" />
                {experience.org}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.26em] text-muted-foreground">
                {experience.timeline}
              </p>
            </div>

            <div className="space-y-5">
              <p className="text-lg leading-relaxed text-muted-foreground">{experience.summary}</p>

              <ul className="space-y-3 text-muted-foreground">
                {experience.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border/70 pt-4">
                <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                  Tech / Platforms
                </p>
                <div className="flex flex-wrap gap-2">
                  {experience.stack.map((item) => (
                    <span key={item} className="border border-border/80 px-3 py-2 text-sm text-foreground/85">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
