import { Section } from "./Section";
import { SiLeetcode, SiCodeforces,SiCodechef } from "react-icons/si";
import { ExternalLink } from "lucide-react";

export function CodingProfiles() {
  const profiles = [
    {
      name: "LeetCode",
      url: "https://leetcode.com/u/ImpWevvB/",
      icon: SiLeetcode,
      color: "text-[#FFA116]",
      label: "ImpWevvB",
    },
    {
      name: "Codeforces",
      url: "https://codeforces.com/profile/Dhruv83170",
      icon: SiCodeforces,
      color: "text-[#1F8ACB]",
      label: "Dhruv83170",
    },
    {
      name: "CodeChef",
      url: "https://www.codechef.com/users/msl_overflow",
      icon: SiCodechef,
      color: "text-[#5B4638]", // CodeChef brown tone
      label: "msl_overflow",
    },
    
  ];

  return (
    <Section id="coding" className="bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
          Coding Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <a
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-6 glass-card rounded-2xl hover-elevate transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`text-4xl ${profile.color}`}>
                  <profile.icon />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {profile.name}
                  </h3>
                  <p className="text-muted-foreground">{profile.label}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
