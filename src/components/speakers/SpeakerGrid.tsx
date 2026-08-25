import { Icon } from "@/components/ui/Icon";
import Photo from "@/components/ui/Photo";
import type { Speaker } from "@/types";

/* Photo renders with `fill`, so whatever wraps it has to carry the aspect itself. */
const FRAME = "relative block aspect-[4/5] w-full overflow-hidden";

export default function SpeakerGrid({ speakers }: { speakers: Speaker[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {speakers.map((speaker, row) => {
        const shot = {
          src: speaker.photo,
          alt: `${speaker.name}, ${speaker.role}, ${speaker.company}`,
        };
        const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

        return (
          <li
            key={speaker.name}
            className="row-in visible card flex flex-col overflow-hidden bg-white shadow-[0_1px_2px_rgba(24,57,68,.06)]"
            style={{ "--i": row } as React.CSSProperties}
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
                {/*
                  A photo gives no hint that it's a link, so the affordance surfaces on
                  hover and on keyboard focus — the badge is the only thing saying where
                  the click goes.
                */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-teal-dark/0 opacity-0 transition-all duration-300 ease-out group-hover/photo:bg-teal-dark/45 group-hover/photo:opacity-100 group-focus-visible/photo:bg-teal-dark/45 group-focus-visible/photo:opacity-100"
                >
                  <span className="icon-tile flex h-10 w-10 items-center justify-center bg-cream text-teal-dark">
                    <Icon name="linkedin" size={20} />
                  </span>
                </span>
              </a>
            ) : (
              /* No profile URL yet — the photo stays a plain image rather than a dead link. */
              <div className={FRAME}>
                <Photo shot={shot} sizes={sizes} />
              </div>
            )}

            <div className="px-5 py-5">
              <h2 className="font-display text-h3 text-ink">{speaker.name}</h2>
              <p className="mt-1 text-small text-muted">{speaker.role}</p>
              <p className="mt-1.5 text-micro font-semibold uppercase text-accent">
                {speaker.company}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
