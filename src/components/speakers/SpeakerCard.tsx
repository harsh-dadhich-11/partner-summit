import { Icon } from "@/components/ui/Icon";
import Photo from "@/components/ui/Photo";
import type { Speaker } from "@/types";

/* Photo renders with `fill`, so whatever wraps it has to carry the aspect itself. */
const FRAME = "relative block aspect-[4/5] w-full overflow-hidden";

type SpeakerCardProps = {
  speaker: Speaker;
  index?: number;
};

export default function SpeakerCard({ speaker, index = 0 }: SpeakerCardProps) {
  const shot = {
    src: speaker.photo,
    alt: `${speaker.name}, ${speaker.role}, ${speaker.company}`,
  };
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <div
      className="row-in visible card flex flex-col overflow-hidden bg-white shadow-[0_1px_3px_rgba(24,57,68,.06),0_12px_24px_-8px_rgba(24,57,68,.04)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(24,57,68,.12)]"
      style={{ "--i": index } as React.CSSProperties}
    >
      {speaker.linkedin ? (
        <a
          href={speaker.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${speaker.name} on LinkedIn`}
          className={`group/photo ${FRAME}`}
        >
          <Photo
            shot={shot}
            sizes={sizes}
            className="transition-transform duration-500 ease-out group-hover/photo:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-teal-dark/0 opacity-0 transition-all duration-300 ease-out group-hover/photo:bg-teal-dark/45 group-hover/photo:opacity-100 group-focus-visible/photo:bg-teal-dark/45 group-focus-visible/photo:opacity-100"
          >
            <span className="icon-tile flex h-10 w-10 items-center justify-center bg-cream text-teal-dark shadow-md">
              <Icon name="linkedin" size={20} />
            </span>
          </span>
        </a>
      ) : (
        <div className={FRAME}>
          <Photo shot={shot} sizes={sizes} />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between px-5 py-5">
        <div>
          <h3 className="font-display text-h3 text-ink">{speaker.name}</h3>
          <p className="mt-1 text-small text-muted">{speaker.role}</p>
        </div>
        <p className="mt-3 text-micro font-semibold uppercase tracking-wider text-accent">
          {speaker.company}
        </p>
      </div>
    </div>
  );
}
