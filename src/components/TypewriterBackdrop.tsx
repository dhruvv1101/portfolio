import type { CSSProperties } from "react";

interface TypewriterBackdropProps {
  text: string;
}

export function TypewriterBackdrop({ text }: TypewriterBackdropProps) {
  const content = Array.from({ length: 20 }, () => text).join(" / ");
  const characters = Array.from(content);
  const duration = `${Math.max(18, characters.length * 0.018)}s`;

  return (
    <div
      aria-hidden="true"
      className="typewriter-backdrop"
      style={{ "--typewriter-duration": duration } as CSSProperties}
    >
      <div className="typewriter-backdrop__sheet">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="typewriter-backdrop__char"
            style={{ "--char-index": index } as CSSProperties}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </div>
    </div>
  );
}
