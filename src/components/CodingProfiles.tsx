import { ExternalLink } from "lucide-react";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";
import { Section } from "./Section";

const profiles = [
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/ImpWevvB/",
    icon: SiLeetcode,
    color: "text-[#B57A17]",
    label: "ImpWevvB",
  },
  {
    name: "Codeforces",
    url: "https://codeforces.com/profile/Dhruv83170",
    icon: SiCodeforces,
    color: "text-[#275A92]",
    label: "Dhruv83170",
  },
  {
    name: "CodeChef",
    url: "https://www.codechef.com/users/msl_overflow",
    icon: SiCodechef,
    color: "text-[#6C5037]",
    label: "msl_overflow",
  },
];

export function CodingProfiles() {
  return (
    <Section
      id="coding"
      label="05 / On the Internet"
      title="Competitive coding, side tabs, and public trails."
      kicker="The kind of links that say something about how I think when nobody is dressing the work up."
      intro="profiles / practice / public signal"
      folio="Links"
      variant="muted"
      backgroundText="public trails / leetcode / codeforces / codechef / problem solving / practice / ranking / consistency"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {profiles.map((profile, index) => (
          <a
            key={profile.name}
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            className="editorial-card group flex flex-col justify-between gap-6 px-6 py-7 transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <span className="folio-tag">{(index + 1).toString().padStart(2, "0")} / profile</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
            </div>
            <div className="space-y-4">
              <div className={`text-4xl ${profile.color}`}>
                <profile.icon />
              </div>
              <h3 className="text-3xl font-semibold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.label}</p>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
