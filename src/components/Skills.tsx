import { Section } from "./Section";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Programming",
    skills: ["C++", "Python", "JavaScript", "SQL", "MATLAB"],
  },
  {
    title: "AI / ML",
    skills: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch","Streamlit","Sqlite"],
  },
  {
    title: "Core EEE & VLSI",
    skills: ["Verilog", "SystemVerilog", "Signal Processing", "Circuit Design", "Embedded Systems"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "Linux/Unix", "VS Code", "Jupyter","Anaconda"],
  },
];

export function Skills() {
  return (
    <Section id="skills">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Technical Arsenal</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of tools and technologies I use to bring ideas to life.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group"
          >
            <h3 className="text-xl font-semibold text-primary mb-6 pb-2 border-b border-white/10 group-hover:border-primary/30 transition-colors">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm rounded-full bg-secondary/30 text-secondary-foreground border border-white/5 hover:border-primary/50 hover:bg-primary/20 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
