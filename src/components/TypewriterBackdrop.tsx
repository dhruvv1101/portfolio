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

  const getEmphasisMap = (wordCount: number, seed: number) => {
    const emphases = new Map<number, "caps" | "large">();
    let cursor = 0;
    let localSeed = seed + 3;

    while (cursor < wordCount) {
      localSeed = (localSeed * 17 + 11) % 97;
      cursor += 5 + (localSeed % 6);
      if (cursor >= wordCount) break;
      emphases.set(cursor, localSeed % 2 === 0 ? "caps" : "large");
    }

    return emphases;
  };

  return (
    <div aria-hidden="true" className="typewriter-backdrop">
      <div className="typewriter-backdrop__sheet">
        {lines.map((line, index) => {
          const words = line.split(" ");
          const emphases = getEmphasisMap(words.length, index);

          return (
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
              {words.map((word, wordIndex) => {
                const emphasis = emphases.get(wordIndex);

                return (
                  <span
                    key={`${word}-${wordIndex}`}
                    className={
                      emphasis
                        ? `typewriter-backdrop__word typewriter-backdrop__word--${emphasis}`
                        : "typewriter-backdrop__word"
                    }
                  >
                    {word}
                    {wordIndex < words.length - 1 ? "\u00A0" : ""}
                  </span>
                );
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
}
