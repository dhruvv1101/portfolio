import { Section } from "./Section";

const currentlyInto = [
  "AI hardware acceleration",
  "Commerce Backend Systems",
  "clean product-facing interfaces",
];

export function About() {
  return (
    <Section
      id="about"
      label="01 / More On Me"
      title="The backstory, without the LinkedIn voice."
      kicker="I study electrical and electronics engineering, but I’m just as interested in what happens when hardware, data, and product systems have to work together."
      intro="ABV-IIITM Gwalior / 2023 - 2027"
      folio="Notes"
      variant="muted"
      backgroundText="about / circuits / systems / machine learning / backend / product thinking / abv iiitm / final year"
    >
      <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I’m a final year student at <span className="text-foreground">ABV-IIITM Gwalior</span>. My lane
            started with circuits and systems, but it widened fast into machine learning, backend logic, and the kind
            of software that supports real operations instead of just looking good in demos.
          </p>
          <p>
            I like work that has texture to it: production constraints, integrations, async workflows, and enough
            ambiguity that you need both technical depth and product judgment to make clean decisions.
          </p>
          <p>
            That is why my projects swing between VLSI, ML tooling, and backend-heavy flows like CSAT journeys,
            invoice sync, and platform integrations. Same curiosity, different surfaces.
          </p>
        </div>

        <div className="editorial-card grid gap-6 px-6 py-7">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <p className="folio-tag">Currently Into</p>
            <span className="text-sm text-muted-foreground">a.k.a. what keeps stealing my tabs</span>
          </div>

          <div className="space-y-4">
            {currentlyInto.map((item, index) => (
              <div key={item} className="flex items-start gap-4 border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-primary/80">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <p className="text-lg text-foreground">{item}</p>
              </div>
            ))}
          </div>

          <p className="border-t border-border/80 pt-5 text-sm leading-relaxed text-muted-foreground">
            The fun part for me is switching layers without losing the thread, from circuit-level thinking to ML logic
            to the backend services that make a user-facing flow actually survive.
          </p>
        </div>
      </div>
    </Section>
  );
}
