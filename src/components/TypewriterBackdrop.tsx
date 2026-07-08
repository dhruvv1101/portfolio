import type { CSSProperties } from "react";

interface TypewriterBackdropProps {
  text: string;
}

export function TypewriterBackdrop({ text }: TypewriterBackdropProps) {
  const tokens = text
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  const lines = Array.from({ length: 10 }, (_, index) => {
    const current = tokens[index % tokens.length] ?? "notes";
    const next = tokens[(index + 1) % tokens.length] ?? "work";
    const later = tokens[(index + 2) % tokens.length] ?? "systems";

    return `${current} / ${next} / ${later} / ${current} in progress`;
  });

  return (
    <div aria-hidden="true" className="typewriter-backdrop">
      <div className="typewriter-backdrop__sheet">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="typewriter-backdrop__line"
            style={
              {
                "--line-length": `${line.length}`,
                "--line-delay": `${index * 0.65}s`,
              } as CSSProperties
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
