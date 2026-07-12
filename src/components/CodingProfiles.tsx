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
      title="Competitive programming and the public trail behind it."
      kicker="“There is no secret ingredient. It’s just you.” Practice is still the part that no shortcut replaces."
      intro="profiles / practice / public signal"
      folio="Links"
      variant="muted"
      backgroundText="public trails / leetcode / codeforces / codechef / problem solving / practice / ranking / consistency"
    >
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {profiles.map((profile, index) => (
          <a
            key={profile.name}
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            className="editorial-card group flex flex-col justify-between gap-5 px-5 py-6 transition hover:-translate-y-1 sm:px-6 sm:py-7 md:gap-6"
          >
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <span className="folio-tag">{(index + 1).toString().padStart(2, "0")} / profile</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
            </div>
            <div className="space-y-4">
              <div className={`text-3xl sm:text-4xl ${profile.color}`}>
                <profile.icon />
              </div>
              <h3 className="fluid-card-title font-semibold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.label}</p>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
