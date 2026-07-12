import { Section } from "./Section";

const craftAreas = [
  {
    title: "Languages",
    items: ["C++", "Python", "Java", "TypeScript", "SQL", "MATLAB"],
  },
  {
    title: "AI / ML",
    items: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "TensorFlow", "Streamlit"],
  },
  {
    title: "Core Systems",
    items: ["Verilog", "SystemVerilog", "Signal Processing", "Embedded Systems", "Circuit Design"],
  },
];

const platforms = ["Shopify", "Uniware", "LimeChat", "GitHub", "Linux / Unix", "Jupyter", "VS Code", "Anaconda"];

export function Skills() {
  return (
    <Section
      id="skills"
      label="04 / What I Work With"
      title="A toolkit shaped by the problems I keep choosing."
      kicker="The stack is intentionally mixed: some of it comes from electronics, some from modeling, and some from the backend work that keeps real systems dependable."
      intro="craft / stack / platforms"
      folio="Toolkit"
      backgroundText="stack / python / java / typescript / verilog / ml / systems / shopify / uniware / limechat"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:gap-8">
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {craftAreas.map((group, index) => (
            <article key={group.title} className="editorial-card px-5 py-6">
              <p className="folio-tag mb-4">{(index + 1).toString().padStart(2, "0")} / {group.title}</p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="border-b border-border/70 pb-3 text-foreground last:border-b-0 last:pb-0">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <article className="editorial-card px-5 py-6 sm:px-6 sm:py-7">
          <div className="mb-6 border-b border-border/70 pb-4">
            <p className="folio-tag">Platforms I've Worked Around</p>
            <h3 className="fluid-card-title mt-3 font-semibold">The tools behind the actual work.</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <span key={platform} className="border border-border/80 px-4 py-3 text-sm text-foreground/85">
                {platform}
              </span>
            ))}
          </div>

          <p className="fluid-body mt-6 text-muted-foreground">
            This is the practical layer of the work: the tools, platforms, and habits that quietly make larger systems
            easier to build, reason about, and maintain.
          </p>
        </article>
      </div>
    </Section>
  );
}
