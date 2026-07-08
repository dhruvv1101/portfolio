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
      title="The stack is mixed on purpose."
      kicker="Some of it is model tooling. Some of it is core electronics. Some of it is just the backend plumbing you need when real systems touch each other."
      intro="craft / stack / platforms"
      folio="Toolkit"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-6 md:grid-cols-3">
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

        <article className="editorial-card px-6 py-7">
          <div className="mb-6 border-b border-border/70 pb-4">
            <p className="folio-tag">Platforms I've Worked Around</p>
            <h3 className="mt-3 text-3xl font-semibold">The tools behind the actual work.</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <span key={platform} className="border border-border/80 px-4 py-3 text-sm text-foreground/85">
                {platform}
              </span>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            This is the layer where product systems and engineering habits meet. Not glamorous, but it is where a lot
            of useful work actually happens.
          </p>
        </article>
      </div>
    </Section>
  );
}
